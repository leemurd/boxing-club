<template>
  <div class="">
    <form
      class="mt-3"
      @submit.prevent="handleLogin"
    >
      <h1 class="text-center">Login</h1>
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          aria-describedby="emailHelp"
          required
        >
      </div>
      <div class="mb-3">
        <label
          for="password"
          class="form-label"
        >Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          required
        >
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        Login
      </button>

      <div
        v-if="errorMessage"
        class="alert alert-warning mt-3"
        role="alert"
      >{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'

const authRepo = container.get<IAuthRepository>(TYPES.IAuthRepository)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

async function handleLogin() {
  try {
    await authRepo.signIn(email.value, password.value)
    errorMessage.value = ''
    await router.push('/') // перенаправляем на главную после успешного входа
  } catch (error: any) {
    errorMessage.value = error.message
  }
}
</script>
