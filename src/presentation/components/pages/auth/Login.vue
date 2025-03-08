<template>
  <div class="py-5">
    <form
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

      <p class="mt-3 text-center">
        <small>
          Don't have account?
        </small> <RouterLink to="/signup">Sign up</RouterLink>
      </p>

      <alert
        v-if="errorMessage"
        :message="errorMessage"
        class="mt-3"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import Alert from '@/presentation/components/shared/Alert.vue'

const authRepo = container.get<IAuthRepository>(TYPES.IAuthRepository)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()

async function handleLogin() {
  try {
    await authRepo.signIn(email.value, password.value)
    errorMessage.value = ''
    const { redirect } = route.query
    if (redirect && typeof redirect === 'string') {
      await router.push(redirect)
    } else {
      await router.push('/') // перенаправляем на главную после успешного входа
    }
  } catch (error: any) {
    errorMessage.value = error.message
  }
}
</script>
