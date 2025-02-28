import { createRouter, createWebHistory } from 'vue-router';
import PunchesCatalog from '@/presentation/pages/PunchesCatalog.vue';
import CombinationBuilderView from '@/presentation/pages/CombinationBuilderView.vue';
import EnemyCard from '@/presentation/pages/EnemyCard.vue'
import Profile from '@/presentation/pages/Profile.vue'
import Signup from '@/presentation/pages/Signup.vue'
import Login from '@/presentation/pages/Login.vue'

const routes = [
  {
    path: '/',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
  },
  {
    path: '/punches',
    name: 'PunchesCatalog',
    component: PunchesCatalog,
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});
