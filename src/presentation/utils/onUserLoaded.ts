import { watch } from 'vue'
import { useAuthStore } from '@/presentation/stores/authStore'

export function onUserLoaded(callback: () => void): void {
  const authStore = useAuthStore()
  if (authStore.currentUser) {
    callback()
  } else {
    const stop = watch(
      () => authStore.currentUser,
      (newUser) => {
        if (newUser) {
          callback()
          stop()
        }
      }
    )
  }
}
