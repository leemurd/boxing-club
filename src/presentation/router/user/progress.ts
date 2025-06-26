// src/presentation/router/user/progress.ts
import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'
import ProgressPage from '@/presentation/components/views/progress/ProgressPage.vue'
import RecordLogger from '@/presentation/components/views/progress/RecordLogger.vue'

export const progressRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Progress',
    redirect: { name: 'ProgressPage' }
  },
  {
    path: 'progress/index',
    name: 'ProgressPage',
    component: ProgressPage,
    meta: {
      name: 'My Progress',
      tags: [RouterTags.userRoute]
    }
  },
  {
    path: 'progress/record',
    name: 'ProgressRecord',
    component: RecordLogger,
    meta: { name: 'New Record' }
  }
]
