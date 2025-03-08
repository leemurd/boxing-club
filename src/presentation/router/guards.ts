import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = getAuth()
  if (auth.currentUser) {
    next()
  } else {
    // Подписываемся на изменение состояния авторизации,
    // чтобы дождаться, если оно ещё не установлено.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe() // отписываемся сразу после первого срабатывания
      if (user) {
        next()
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    })
  }
}
