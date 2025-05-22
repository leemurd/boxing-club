<template>
  <div class="profile-page">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="user">
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title">{{ `${user.firstName} ${user.lastName}` }}</h5>
          <p class="card-text">{{ user.email }}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <theme-toggle/>
          </li>
        </ul>
        <div class="card-body align-items-center d-flex gap-2">
          <b-button
            color="red"
            class="col"
            size="small"
            @click="confirmLogout"
          >Log out</b-button>
        </div>
      </div>
    </div>
    <b-alert
      v-else
      message="Пользователь не найден."
      class="mt-3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { IUserRepository } from '@/domain/repositories/IUserRepository.ts'
import type { User } from '@/domain/entities/User.ts'
import BAlert from '@/presentation/components/shared/BAlert.vue'
import ThemeToggle from '@/presentation/components/pages/profile/ThemeToggle.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { useToast } from 'vue-toastification'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'

const { openModalByKey } = useModalService()

function confirmLogout() {
  openModalByKey(ModalKey.CONFIRMATION, {
    title: 'Confirm logout',
    message: 'Are you sure?',
    onApply: handleLogout
  })
}
//

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
