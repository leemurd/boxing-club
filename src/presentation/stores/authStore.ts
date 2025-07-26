// src/presentation/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useThemeStore } from '@/presentation/stores/themeStore'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { withLoading } from '@/presentation/utils/withLoading'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const error = ref('')

  const authRepo = getUC<IAuthRepository>(TYPES.IAuthRepository)
  const userRepo = getUC<IUserRepository>(TYPES.IUserRepository)
  const auth = getAuth()
  const themeStore = useThemeStore()

  const isDarkMode = computed(() => themeStore.isDarkTheme)

  function init() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        isLoggedIn.value = true
        currentUser.value = await userRepo.getUser(user.uid)
        await themeStore.loadThemeFromFirebase()
      } else {
        isLoggedIn.value = false
        currentUser.value = null
      }
    })
  }

  const login = withLoading(async (email: string, password: string) => {
    try {
      await authRepo.signIn(email, password)
      error.value = ''
      isLoggedIn.value = true
    } catch (err: any) {
      error.value = err.message
      isLoggedIn.value = false
      throw err
    }
  })

  const register = withLoading(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      nickname: string
    ) => {
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
        throw err
      }
    }
  )

  const logout = withLoading(async () => {
    try {
      await authRepo.signOut()
      error.value = ''
      isLoggedIn.value = false
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  })

  return {
    currentUser,
    isLoggedIn,
    error,
    isDarkMode,
    init,
    login,
    register,
    logout
  }
})
