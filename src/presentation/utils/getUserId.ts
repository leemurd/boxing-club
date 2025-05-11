import { useAuthStore } from '@/presentation/stores/authStore'
import { until } from '@/presentation/utils/until'

/**
 * Ждёт загрузки текущего пользователя и возвращает его ID.
 * Гарантирует, что дальше можно использовать userId без проверок.
 */
export async function getUserId(): Promise<string> {
  const authStore = useAuthStore()
  // 1) Если ещё нет пользователя — ждём, пока он появится
  await until(() => !!authStore.currentUser)
  // 2) Теперь уверены, что currentUser !== null
  return authStore.currentUser!.id
}
