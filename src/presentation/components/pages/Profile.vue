<template>
  <div class="profile-page">
    <h1>Профиль пользователя</h1>
    <div v-if="loading">Загрузка...</div>
    <b-alert
      v-else-if="errorMessage"
      :message="errorMessage"
      class="mt-3"
    />
    <div v-else-if="user">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Имя:</strong> {{ user.firstName }}</p>
      <p><strong>Фамилия:</strong> {{ user.lastName }}</p>
      <p><strong>Никнейм:</strong> {{ user.nickname }}</p>
      <button @click="handleLogout">Выйти</button>
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
