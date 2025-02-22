import { createRouter, createWebHistory } from 'vue-router';
import PunchesCatalog from '@/presentation/pages/PunchesCatalog.vue';
import CombinationBuilderView from '@/presentation/pages/CombinationBuilderView.vue';

const routes = [
  {
    path: '/',
    name: 'PunchesCatalog',
    component: PunchesCatalog,
  },
  {
    path: '/combinations',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});
