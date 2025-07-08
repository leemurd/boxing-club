// src/presentation/router/guards.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function requireAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const auth = getAuth()
  if (auth.currentUser) {
    next()
  } else {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
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
