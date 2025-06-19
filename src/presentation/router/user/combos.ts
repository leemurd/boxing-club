import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'
import ComboListPage from '@/presentation/components/views/combos/ComboListPage.vue'
import ComboEditPage from '@/presentation/components/views/combos/ComboEditPage.vue'

export const comboRoutes: RouteRecordRaw[] = [
  {
    path: 'combos/index',
    name: 'ComboList',
    component: ComboListPage,
    meta: {
      name: 'Combos',
      tags: [RouterTags.userRoute]
    }
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
