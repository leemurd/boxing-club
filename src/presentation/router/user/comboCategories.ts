import type { RouteRecordRaw } from 'vue-router'
import CategoryListPage from '@/presentation/components/views/combos/CategoryListPage.vue'
import CategoryEditPage from '@/presentation/components/views/combos/CategoryEditPage.vue'

export const comboCategoryRoutes: RouteRecordRaw[] = [
  {
    path: 'categories/index',
    name: 'ComboCategoriesIndex',
    component: CategoryListPage,
    meta: { name: 'Combo Categories' }
  },
  {
    path: 'categories/new',
    name: 'ComboCategoriesNew',
    component: CategoryEditPage,
    meta: { name: 'New Combo Category' }
  },
  {
    path: 'categories/:id',
    name: 'ComboCategoriesEdit',
    component: CategoryEditPage,
    meta: { name: 'Edit Combo Category' }
  }
]
