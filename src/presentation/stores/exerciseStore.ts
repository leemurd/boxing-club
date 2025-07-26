// src/presentation/stores/exerciseStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserId } from '@/presentation/utils/getUserId'
import { withLoading } from '@/presentation/utils/withLoading'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { Exercise } from '@/domain/entities/Exercise'
import type { GetExercisesUseCase } from '@/application/useCases/exercise/GetExercisesUseCase'
import type { GetExerciseByIdUseCase } from '@/application/useCases/exercise/GetExerciseByIdUseCase'
import type { CreateExerciseUseCase } from '@/application/useCases/exercise/CreateExerciseUseCase'
import type { UpdateExerciseUseCase } from '@/application/useCases/exercise/UpdateExerciseUseCase'
import type { DeleteExerciseUseCase } from '@/application/useCases/exercise/DeleteExerciseUseCase'
import { DEFAULT_EXERCISES } from '@/domain/constants/defaultExercises'

export const useExerciseStore = defineStore('exercise', () => {
  const exercises = ref<Exercise[]>([])
  const current = ref<Exercise | null>(null)

  const loadAll = withLoading(async () => {
    const userId = await getUserId()
    if (!userId) return

    const getAllUC = getUC<GetExercisesUseCase>(TYPES.GetExercisesUseCase)
    const existing = await getAllUC.execute(userId)

    for (const def of DEFAULT_EXERCISES) {
      if (!existing.some((t) => t.id === def.id)) {
        const createUC = getUC<CreateExerciseUseCase>(TYPES.CreateExerciseUseCase)
        await createUC.execute(userId, def)
      }
    }

    exercises.value = await getAllUC.execute(userId)
  })

  const loadById = withLoading(async (id: string) => {
    const userId = await getUserId()
    if (!userId) return

    const uc = getUC<GetExerciseByIdUseCase>(TYPES.GetExerciseByIdUseCase)
    current.value = await uc.execute(userId, id)
  })

  const createExercise = withLoading(async (ex: Exercise) => {
    const userId = await getUserId()
    if (!userId) return

    const uc = getUC<CreateExerciseUseCase>(TYPES.CreateExerciseUseCase)
    const created = await uc.execute(userId, ex)
    exercises.value.push(created)
    return created
  })

  const updateExercise = withLoading(async (ex: Exercise) => {
    const userId = await getUserId()
    if (!userId) return

    const uc = getUC<UpdateExerciseUseCase>(TYPES.UpdateExerciseUseCase)
    await uc.execute(userId, ex)
    const idx = exercises.value.findIndex((e) => e.id === ex.id)
    if (idx !== -1) exercises.value[idx] = ex
  })

  const removeExercise = withLoading(async (id: string) => {
    const userId = await getUserId()
    if (!userId) return

    const uc = getUC<DeleteExerciseUseCase>(TYPES.DeleteExerciseUseCase)
    await uc.execute(userId, id)
    exercises.value = exercises.value.filter((e) => e.id !== id)
  })

  const getExerciseById = (id: string): Exercise | undefined =>
    exercises.value.find((ex) => ex.id === id)

  const isDefault = (id: string): boolean => DEFAULT_EXERCISES.some((e) => e.id === id)

  return {
    exercises,
    current,
    loadAll,
    loadById,
    createExercise,
    updateExercise,
    removeExercise,
    getExerciseById,
    isDefault
  }
})
