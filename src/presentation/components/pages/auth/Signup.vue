<!--<template>-->
<!--  <div class="">-->
<!--    <form class="mt-3">-->
<!--      <h1 class="text-center">Sign Up</h1>-->
<!--      <div class="mb-3">-->
<!--        <label-->
<!--          for="exampleInputEmail1"-->
<!--          class="form-label"-->
<!--        >Email address</label>-->
<!--        <input-->
<!--          id="exampleInputEmail1"-->
<!--          type="email"-->
<!--          class="form-control"-->
<!--          aria-describedby="emailHelp"-->
<!--        >-->
<!--      </div>-->
<!--      <div class="mb-3">-->
<!--        <label-->
<!--          for="exampleInputPassword1"-->
<!--          class="form-label"-->
<!--        >Password</label>-->
<!--        <input-->
<!--          id="exampleInputPassword1"-->
<!--          type="password"-->
<!--          class="form-control"-->
<!--        >-->
<!--      </div>-->
<!--      <div class="mb-3 form-check">-->
<!--        <input-->
<!--          id="exampleCheck1"-->
<!--          type="checkbox"-->
<!--          class="form-check-input"-->
<!--        >-->
<!--        <label-->
<!--          class="form-check-label"-->
<!--          for="exampleCheck1"-->
<!--        >Check me out</label>-->
<!--      </div>-->
<!--      <button-->
<!--        type="submit"-->
<!--        class="btn btn-primary w-100"-->
<!--      >-->
<!--        Sign Up-->
<!--      </button>-->
<!--    </form>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div class="register-page">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
        >
      </div>
      <div>
        <label for="firstName">Имя</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          required
        >
      </div>
      <div>
        <label for="lastName">Фамилия</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          required
        >
      </div>
      <div>
        <label for="nickname">Никнейм</label>
        <input
          id="nickname"
          v-model="nickname"
          type="text"
          required
        >
      </div>
      <div>
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        >
      </div>
      <div>
        <label for="confirmPassword">Подтвердите пароль</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
        >
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
    <p
      v-if="errorMessage"
      class="error"
    >{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'

const authRepo = container.get<IAuthRepository>(TYPES.IAuthRepository)
const userRepo = container.get<IUserRepository>(TYPES.IUserRepository)

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useRouter()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }
  try {
    const result = await authRepo.signUp(email.value, password.value)
    // Предполагаем, что Firebase возвращает user.uid
    const userId = result.user.uid
    const newUser: User = {
      id: userId,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      nickname: nickname.value,
      role: 'user'
    }
    await userRepo.createUser(newUser)
    errorMessage.value = ''
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error {
  color: red;
}
</style>
