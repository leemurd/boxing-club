import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'
import ComboListPage from '@/presentation/components/views/combos/ComboListPage.vue'
import ComboEditPage from '@/presentation/components/views/combos/ComboEditPage.vue'

export const comboRoutes: RouteRecordRaw = {
  path: 'combos',
  name: 'ComboIndex',
  component: () => import('@/presentation/components/views/combos/ComboIndex.vue'),
  redirect: { name: 'ComboList' },
  meta: {
    name: 'Combos',
    tags: [RouterTags.userRoute]
  },
  children: [
    {
      path: 'combos/index',
      name: 'ComboList',
      component: ComboListPage,
      meta: { name: 'Combos' }
    },
    {
      path: 'combos/new',
      name: 'ComboNew',
      component: ComboEditPage,
      meta: { name: 'New Combo' }
    },
    {
      path: 'combos/:id',
      name: 'ComboEdit',
      component: ComboEditPage,
      meta: { name: 'Edit Combo' }
    }
  ]
}
