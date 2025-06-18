<template>
  <page-default header-back>
    <div class="profile-page">
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="user">
        <b-card>
          <template #header>
            <ion-card-title>{{ `${user.firstName} ${user.lastName}` }}</ion-card-title>
            <ion-card-subtitle>{{ user.email }}</ion-card-subtitle>
          </template>
          <template #default>
            <theme-toggle/>
          </template>
          <template #footer>
            <b-button
              color="danger"
              class="w-100 ion-padding"
              size="default"
              @click="confirmLogout"
            >Log out</b-button>
          </template>
        </b-card>
      </div>
      <b-card v-else>
        Пользователь не найден.
      </b-card>
    </div>
  </page-default>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { IUserRepository } from '@/domain/repositories/IUserRepository.ts'
import type { User } from '@/domain/entities/User.ts'
import ThemeToggle from '@/presentation/components/pages/profile/ThemeToggle.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { useToast } from 'vue-toastification'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import { IonCardTitle, IonCardSubtitle } from '@ionic/vue'

const { openModalByKey } = useModalService()

function confirmLogout() {
  openModalByKey(ModalKey.CONFIRMATION, {
    title: 'Confirm logout',
    message: 'Are you sure?',
    onApply: handleLogout
  })
}

const toast = useToast()

const user = ref<User | null>(null)
const loading = ref(true)
const router = useRouter()

const userRepo = getUC<IUserRepository>(TYPES.IUserRepository)
const authStore = useAuthStore()

async function loadUserProfile() {
  try {
    const auth = getAuth()
    const {currentUser} = auth
    if (currentUser) {
      const {uid} = currentUser
      const fetchedUser = await userRepo.getUser(uid)
      if (fetchedUser) {
        user.value = fetchedUser
      } else {
        toast.error('Undefined user')
      }
    } else {
      toast.error('User isn\'t authorized')
    }
  } catch (error: any) {
    toast.error(error?.message || error)
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (error: any) {
    toast.error(error?.message || error)
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>
