import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Account from '@/presentation/components/pages/Account.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'
import NotFoundPage from '@/presentation/components/pages/auth/NotFoundPage.vue'
import { requireAuth } from './guards'
import PunchCounter from '@/presentation/components/pages/PunchCounter.vue'
import ExercisesPage from '@/presentation/components/pages/ExercisesPage.vue'
import ProgressPage from '@/presentation/components/pages/ProgressPage.vue'
import RouterViewWithSlots from '@/presentation/components/layout/router/RouterViewWithSlots.vue'
import ComboListPage from '@/presentation/components/pages/ComboListPage.vue'
import ComboEditPage from '@/presentation/components/pages/ComboEditPage.vue'
import Combos from '@/presentation/components/pages/Combos.vue'
import CategoryListPage from '@/presentation/components/pages/CategoryListPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Progress',
    component: ProgressPage,
    beforeEnter: requireAuth,
    meta: {
      name: 'Progress',
      tags: ['userRoute']
    }
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: RouterViewWithSlots,
    beforeEnter: requireAuth,
    meta: {
      name: 'Exercises',
      tags: ['userRoute']
    },
    redirect: '/exercises/index',
    children: [
      {
        path: '/exercises/index',
        name: 'Exercises page',
        component: ExercisesPage,
        meta: {
          name: 'Exercises'
        }
      },
      {
        path: '/rounds',
        name: 'Exercises rounds',
        component: ExercisesPage,
        meta: {
          name: 'Exercises rounds'
        }
      }
    ]
  },
  {
    path: '/combos',
    name: 'Combos',
    component: Combos,
    beforeEnter: requireAuth,
    meta: {
      name: 'Combos',
      tags: ['userRoute']
    },
    redirect: '/combos/index',
    children: [
      {
        path: '/combos/index',
        name: 'ComboList',
        component: ComboListPage
      },
      {
        path: '/combos/new',
        name: 'ComboCreate',
        component: ComboEditPage,
        meta: {
          name: 'Create combo',
        },
      },
      {
        path: '/combos/:id',
        name: 'ComboEdit',
        component: ComboEditPage,
        props: true,
        meta: {
          name: 'Edit combo',
        },
      },
      {
        path: '/combos/categories',
        name: 'ComboCategories',
        component: CategoryListPage,
        meta: {
          name: 'Combo categories',
        },
        // children: [
        //   {
        //     path: '/combos/categories/index',
        //     name: 'ComboCategoriesIndex',
        //     component: ComboCategoriesList
        //   },
        //   {
        //     path: '/combos/categories/create',
        //     name: 'ComboCategoriesCreate',
        //     component: ComboCreateCategory
        //   }
        // ]
      }
    ]
  },

  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
    beforeEnter: requireAuth,
    meta: {
      name: 'Enemy Card',
      tags: ['userRoute']
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: requireAuth,
    meta: {
      name: 'Account',
      tags: ['userRoute']
    }
  },
  {
    path: '/punch-counter',
    name: 'PunchCounter',
    component: PunchCounter,
    beforeEnter: requireAuth,
    meta: {
      name: 'Punch counter',
      tags: ['userRoute']
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      name: 'Log in',
      tags: ['authRoute']
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      name: 'Sign up',
      tags: ['authRoute']
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      name: 'Page Not Found'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})

router.afterEach((to) => {
  document.title = to.meta?.name + ' | My Boxing' || 'My Boxing'
})
