import { createRouter, createWebHistory } from 'vue-router';
import PunchesCatalog from '@/presentation/pages/PunchesCatalog.vue';
import CombinationBuilderView from '@/presentation/pages/CombinationBuilderView.vue';
import EnemyCard from '@/presentation/pages/EnemyCard.vue'

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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});
