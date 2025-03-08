import { createRouter, createWebHistory } from 'vue-router'
import PunchesCatalog from '@/presentation/components/pages/PunchesCatalog.vue'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Profile from '@/presentation/components/pages/Profile.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'

const routes = [
  {
    path: '/',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView
  },
  {
    path: '/punches',
    name: 'PunchesCatalog',
    component: PunchesCatalog
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})
