<template>
  <page-default class="register-page">
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email</label>
        <b-input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="firstName"
          class="form-label"
        >First name</label>
        <b-input
          id="firstName"
          v-model="firstName"
          type="text"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="lastName"
          class="form-label"
        >Last name</label>
        <b-input
          id="lastName"
          v-model="lastName"
          type="text"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="nickname"
          class="form-label"
        >Nickname</label>
        <b-input
          id="nickname"
          v-model="nickname"
          type="text"
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
          class="text-center"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="confirmPassword"
          class="form-label"
        >Repeat password</label>
        <b-input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="text-center"
          required
        />
      </div>
      <b-button
        color="primary"
        size="default"
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

    <b-card
      v-if="errorMessage"
      class="mt-3"
    >
      {{ errorMessage }}
    </b-card>
  </page-default>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import BInput from '@/presentation/components/shared/BInput.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BCard from '@/presentation/components/shared/BCard.vue'

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useProjectRouter()
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
}
</style>
