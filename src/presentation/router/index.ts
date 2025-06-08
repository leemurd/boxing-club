import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import EnemyCard from '@/presentation/components/views/EnemyCard.vue'
import Account from '@/presentation/components/views/Account.vue'
import Signup from '@/presentation/components/views/auth/Signup.vue'
import Login from '@/presentation/components/views/auth/Login.vue'
import NotFoundPage from '@/presentation/components/views/auth/NotFoundPage.vue'
import { requireAuth } from './guards'
import PunchCounter from '@/presentation/components/views/PunchCounter.vue'
import ProgressPage from '@/presentation/components/views/progress/ProgressPage.vue'
import RouterViewWithSlots from '@/presentation/components/layout/router/RouterViewWithSlots.vue'
import ComboListPage from '@/presentation/components/views/combos/ComboListPage.vue'
import ComboEditPage from '@/presentation/components/views/combos/ComboEditPage.vue'
import Combos from '@/presentation/components/views/combos/Combos.vue'
import CategoryListPage from '@/presentation/components/views/combos/CategoryListPage.vue'
import CategoryEditPage from '@/presentation/components/views/combos/CategoryEditPage.vue'
import TagListPage from '@/presentation/components/views/tags/TagListPage.vue'
import TagEditPage from '@/presentation/components/views/tags/TagEditPage.vue'
import ExerciseEditPage from '@/presentation/components/views/exercises/ExerciseEditPage.vue'
import ExercisesIndex from '@/presentation/components/views/exercises/ExercisesIndex.vue'
import RecordLogger from '@/presentation/components/views/progress/RecordLogger.vue'
// import NewRecord from '@/presentation/components/views/progress/NewRecord.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Progress',
    component: RouterViewWithSlots,
    beforeEnter: requireAuth,
    meta: {
      name: 'My Progress',
      tags: ['userRoute']
    },
    redirect: { name: 'ProgressPage' },
    children: [
      {
        path: '/progress/index',
        name: 'ProgressPage',
        component: ProgressPage,
        meta: {
          name: 'My Progress'
        }
      },
      {
        path: '/progress/record',
        name: 'ProgressRecord',
        component: RecordLogger,
        meta: {
          name: 'Progress Record'
        }
      }
    ]
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: RouterViewWithSlots,
    beforeEnter: requireAuth,
    // component: ExercisesPage,
    meta: {
      name: 'Exercises',
      tags: ['userRoute'],
      requiresAuth: true
    },
    redirect: '/exercises/index',
    children: [
      {
        path: '/exercises/index',
        name: 'ExercisesIndex',
        component: ExercisesIndex,
        // component: ExercisesPage,
        meta: {
          name: 'Exercises'
        }
      },
      {
        path: '/exercises/new',
        name: 'ExerciseCreate',
        component: ExerciseEditPage
        // meta: { requiresAuth: true }
      },
      {
        path: '/exercises/:id',
        name: 'ExerciseEdit',
        component: ExerciseEditPage
        // meta: { requiresAuth: true }
      }
      // {
      //   path: '/exercises//rounds',
      //   name: 'Exercises rounds',
      //   component: ExerciseEditPage,
      //   meta: {
      //     name: 'Exercises rounds'
      //   }
      // }
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
        name: 'ComboNew',
        component: ComboEditPage,
        props: true,
        meta: {
          name: 'New combo'
        }
      },
      {
        path: '/combos/:id',
        name: 'ComboEdit',
        component: ComboEditPage,
        props: true,
        meta: {
          name: 'Edit combo'
        }
      },
      {
        path: '/combos/categories',
        name: 'ComboCategories',
        component: RouterViewWithSlots,
        redirect: '/combos/categories/index',
        children: [
          {
            path: '/combos/categories/index',
            name: 'ComboCategoriesIndex',
            component: CategoryListPage,
            meta: {
              name: 'Combo categories'
            }
          },
          {
            path: '/combos/categories/new',
            name: 'ComboCategoriesNew',
            component: CategoryEditPage,
            meta: {
              name: 'New combo category'
            }
          },
          {
            path: '/combos/categories/:id',
            name: 'ComboCategoriesEdit',
            component: CategoryEditPage,
            meta: {
              name: 'Edit combo category'
            }
          }
        ]
      }
    ]
  },

  {
    path: '/tags',
    component: RouterViewWithSlots,
    meta: {
      requiresAuth: true,
      tags: ['userRoute'],
      name: 'Tags'
    },
    children: [
      {
        path: '',
        name: 'TagIndex',
        component: TagListPage,
        meta: { title: 'Tags' }
      },
      {
        path: 'new',
        name: 'TagCreate',
        component: TagEditPage,
        meta: { title: 'Create Tag' }
      },
      {
        path: ':id',
        name: 'TagEdit',
        component: TagEditPage,
        meta: { title: 'Edit Tag' }
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
