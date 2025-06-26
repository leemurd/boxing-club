// src/router/index.ts
import { type RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import EnemyCard from '@/presentation/components/views/EnemyCard.vue'
import Account from '@/presentation/components/views/Account.vue'
import PunchCounter from '@/presentation/components/views/PunchCounter.vue'
import NotFoundPage from '@/presentation/components/views/auth/NotFoundPage.vue'
import { requireAuth } from '@/presentation/router/guards.ts'
import { authRoutes } from '@/presentation/router/auth/auth.ts'
import { tagRoutes } from '@/presentation/router/user/tags.ts'
import { comboRoutes } from '@/presentation/router/user/combos.ts'
import { comboCategoryRoutes } from '@/presentation/router/user/comboCategories.ts'
import { exerciseRoutes } from '@/presentation/router/user/exercises.ts'
import { progressRoutes } from '@/presentation/router/user/progress.ts'
import { RouterTags } from '@/presentation/router/routerTypes.ts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/presentation/components/layout/router/SectionLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      ...progressRoutes,
      ...exerciseRoutes,
      comboRoutes,
      ...comboCategoryRoutes,
      ...tagRoutes,
      {
        path: 'enemy-card',
        name: 'EnemyCard',
        component: EnemyCard,
        meta: {
          name: 'Enemy Card',
          tags: [RouterTags.userRoute]
        }
      },
      {
        path: 'account',
        name: 'Account',
        component: Account,
        meta: {
          name: 'Account',
          tags: [RouterTags.userRoute]
        }
      },
      {
        path: 'punch-counter',
        name: 'PunchCounter',
        component: PunchCounter,
        meta: { name: 'Punch Counter' }
      }
    ]
  },
  ...authRoutes,
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { name: 'Page Not Found' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})

router.afterEach((to) => {
  document.title = to.meta.name ? `${to.meta.name} | My Boxing` : 'My Boxing'

  //
  // const active = document.activeElement as HTMLElement
  // if (active?.blur) active.blur()
})
