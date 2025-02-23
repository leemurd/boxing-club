import { createRouter, createWebHistory } from 'vue-router';
import PunchesCatalog from '@/presentation/pages/PunchesCatalog.vue';
import CombinationBuilderView from '@/presentation/pages/CombinationBuilderView.vue';

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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});
