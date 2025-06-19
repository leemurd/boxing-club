import TagListPage from '@/presentation/components/views/tags/TagListPage.vue'
import TagEditPage from '@/presentation/components/views/tags/TagEditPage.vue'
import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'

export const tagRoutes: RouteRecordRaw[] = [
  {
    path: 'tags/index',
    name: 'TagIndex',
    component: TagListPage,
    meta: {
      name: 'Tags',
      tags: [RouterTags.userRoute]
    }
  },
  {
    path: 'tags/new',
    name: 'TagCreate',
    component: TagEditPage,
    meta: { name: 'Create Tag' }
  },
  {
    path: 'tags/:id',
    name: 'TagEdit',
    component: TagEditPage,
    meta: { name: 'Edit Tag' }
  }
]
