import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'
import ExercisesIndex from '@/presentation/components/views/exercises/ExercisesIndex.vue'
import ExerciseEditPage from '@/presentation/components/views/exercises/ExerciseEditPage.vue'

export const exerciseRoutes: RouteRecordRaw[] = [
  {
    path: 'exercises/index',
    name: 'ExercisesIndex',
    component: ExercisesIndex,
    meta: {
      name: 'Exercises',
      tags: [RouterTags.userRoute]
    }
  },
  {
    path: 'exercises/new',
    name: 'ExerciseCreate',
    component: ExerciseEditPage,
    meta: { name: 'Create Exercise' }
  },
  {
    path: 'exercises/:id',
    name: 'ExerciseEdit',
    component: ExerciseEditPage,
    meta: { name: 'Edit Exercise' }
  }
]
