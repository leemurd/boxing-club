<template>
  <div class="register-page">
    <h1>Sign up</h1>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="form-control"
        >
      </div>
      <div class="mb-3">
        <label
          for="firstName"
          class="form-label"
        >First name</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          required
          class="form-control"
        >
      </div>
      <div class="mb-3">
        <label
          for="lastName"
          class="form-label"
        >Last name</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          required
          class="form-control"
        >
      </div>
      <div class="mb-3">
        <label
          for="nickname"
          class="form-label"
        >Nickname</label>
        <input
          id="nickname"
          v-model="nickname"
          type="text"
          required
          class="form-control"
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
          required
          class="form-control"
        >
      </div>
      <div class="mb-3">
        <label
          for="confirmPassword"
          class="form-label"
        >Repeat password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="form-control"
        >
      </div>
      <b-button
        color="blue"
        size="medium"
        type="submit"
        class="w-100"
      >
        Sign up
      </b-button>

      <p class="mt-3 text-center">
        <small>
          Already have an account?
        </small> <RouterLink to="/login">Login</RouterLink>
      </p>
    </form>
    <b-alert
      v-if="errorMessage"
      :message="errorMessage"
      class="mt-3"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BAlert from '@/presentation/components/shared/BAlert.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore'

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }
  await authStore.register(email.value, password.value, firstName.value, lastName.value, nickname.value)
  if (!authStore.error) {
    router.push('/login')
  } else {
    errorMessage.value = authStore.error
  }
}
</script>

<style scoped>
.register-page {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  //gap: 1rem;
  padding: 30px 0;
}
</style>
