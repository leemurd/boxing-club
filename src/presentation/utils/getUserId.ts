import { useAuthStore } from '@/presentation/stores/authStore'
import { until } from '@/presentation/utils/until'

/**
 * Ждёт загрузки текущего пользователя и возвращает его ID.
 * Гарантирует, что дальше можно использовать userId без проверок.
 */
export async function getUserId(): Promise<string> {
  const authStore = useAuthStore()
  await until(() => !!authStore.currentUser)
  return authStore.currentUser!.id
}
