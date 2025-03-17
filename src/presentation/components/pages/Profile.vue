<template>
  <div class="profile-page">
    <h1 class="text-center">Account</h1>
    <div v-if="loading">Загрузка...</div>
    <b-alert
      v-else-if="errorMessage"
      :message="errorMessage"
      class="mt-3"
    />
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
            color="dark"
            outline
            class="col"
            size="small"
          >
            Edit
          </b-button>
          <b-button
            color="red"
            class="col"
            size="small"
            @click="handleLogout"
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
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { User } from '@/domain/entities/User'
import BAlert from '@/presentation/components/shared/BAlert.vue'
import ThemeToggle from '@/presentation/components/profile/ThemeToggle.vue'
import BButton from '@/presentation/components/shared/BButton.vue'

const user = ref<User | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const router = useRouter()

// Получаем репозитории через DI
const userRepo = container.get<IUserRepository>(TYPES.IUserRepository)
const authRepo = container.get<IAuthRepository>(TYPES.IAuthRepository)

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
        errorMessage.value = 'Профиль не найден'
      }
    } else {
      errorMessage.value = 'Пользователь не авторизован'
    }
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await authRepo.signOut()
    await router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.message
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>
