<template>
  <page-default>
    <form
      @submit.prevent="handleLogin"
    >
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email address</label>
        <b-input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="password"
          class="form-label"
        >Password</label>
        <b-input
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>

      <b-button
        color="primary"
        size="default"
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
    </form>
  </page-default>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import BInput from '@/presentation/components/shared/BInput.vue'
import { useToast } from 'vue-toastification'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'

const toast = useToast()

const email = ref('')
const password = ref('')
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
    toast.error(authStore.error)
  }
}
</script>
