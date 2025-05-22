import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { TYPES } from '@/infrastructure/di/types'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(true)
  const error = ref('')

  const authRepo = getUC<IAuthRepository>(TYPES.IAuthRepository)
  const userRepo = getUC<IUserRepository>(TYPES.IUserRepository)
  const auth = getAuth()
  const exerciseStore = useExerciseStore()

  function init() {
    onAuthStateChanged(auth, async (user) => {
      loading.value = false
      if (user) {
        isLoggedIn.value = true
        currentUser.value = await userRepo.getUser(user.uid)
        const themeStore = useThemeStore()
        await themeStore.loadThemeFromFirebase()
      } else {
        isLoggedIn.value = false
        currentUser.value = null
      }
    })
  }

  async function login(email: string, password: string) {
    try {
      await authRepo.signIn(email, password)
      error.value = ''
      isLoggedIn.value = true
    } catch (err: any) {
      error.value = err.message
      isLoggedIn.value = false
    }
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    nickname: string
  ) {
    try {
      const result = await authRepo.signUp(email, password)
      const { uid } = result.user
      const newUser: User = {
        id: uid,
        email,
        firstName,
        lastName,
        nickname,
        role: 'user'
      }
      await userRepo.createUser(newUser)
      error.value = ''
    } catch (err: any) {
      error.value = err.message
    }
  }

  async function logout() {
    try {
      await authRepo.signOut()
      error.value = ''
      isLoggedIn.value = false
      exerciseStore.clearStats()
    } catch (err: any) {
      error.value = err.message
    }
  }

  return {
    currentUser,
    isLoggedIn,
    loading,
    error,
    init,
    login,
    register,
    logout
  }
})
