<template>
  <div>
    <form
      @submit.prevent="handleLogin"
    >
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

      <b-button
        color="blue"
        size="medium"
        type="submit"
        class="w-100"
      >
        Login
      </b-button>

      <p class="mt-3 text-center">
        <small>
          Don't have an account?
        </small> <RouterLink to="/signup">Sign up</RouterLink>
      </p>

      <b-alert
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
import BAlert from '@/presentation/components/shared/BAlert.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

async function handleLogin() {
  await authStore.login(email.value, password.value)
  if (!authStore.error) {
    router.push('/')
    const { redirect } = route.query
    if (redirect && typeof redirect === 'string') {
      await router.push(redirect)
    } else {
      await router.push('/') // перенаправляем на главную после успешного входа
    }
  } else {
    errorMessage.value = authStore.error
  }
}
</script>
