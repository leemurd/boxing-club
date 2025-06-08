// src/presentation/stores/exerciseStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import type { Exercise } from '@/domain/entities/Exercise'
import { getUserId } from '@/presentation/utils/getUserId'
import { EXERCISES } from '@/domain/constants/exercises'
import type { GetExercisesUseCase } from '@/application/useCases/exercise/GetExercisesUseCase'
import type { GetExerciseByIdUseCase } from '@/application/useCases/exercise/GetExerciseByIdUseCase'
import type { CreateExerciseUseCase } from '@/application/useCases/exercise/CreateExerciseUseCase'
import type { UpdateExerciseUseCase } from '@/application/useCases/exercise/UpdateExerciseUseCase'
import type { DeleteExerciseUseCase } from '@/application/useCases/exercise/DeleteExerciseUseCase'

export const useExerciseStore = defineStore('exercise', () => {
  const exercises = ref<Exercise[]>([])
  const current = ref<Exercise | null>(null)
  const loading = ref(false)

  /** Загрузка всех упражнений (дефолтных + пользовательских) */
  async function loadAll() {
    const userId = await getUserId()
    if (!userId) return
    loading.value = true
    try {
      const uc = container.get<GetExercisesUseCase>(TYPES.GetExercisesUseCase)
      const res = await uc.execute(userId)
      exercises.value = [...EXERCISES, ...res]
    } finally {
      loading.value = false
    }
  }

  /** Загрузка одного упражнения по ID */
  async function loadById(id: string) {
    const userId = await getUserId()
    if (!userId) return
    loading.value = true
    try {
      const uc = container.get<GetExerciseByIdUseCase>(TYPES.GetExerciseByIdUseCase)
      current.value = await uc.execute(userId, id)
    } finally {
      loading.value = false
    }
  }

  /** Создание нового упражнения */
  async function createExercise(ex: Exercise) {
    const userId = await getUserId()
    if (!userId) return
    loading.value = true
    try {
      const uc = container.get<CreateExerciseUseCase>(TYPES.CreateExerciseUseCase)
      const created = await uc.execute(userId, ex)
      exercises.value.push(created)
      return created
    } finally {
      loading.value = false
    }
  }

  /** Обновление существующего упражнения */
  async function updateExercise(ex: Exercise) {
    // console.log({ ...ex })
    const val = { ...ex }
    console.log(val)
    const userId = await getUserId()
    if (!userId) return
    loading.value = true
    try {
      const uc = container.get<UpdateExerciseUseCase>(TYPES.UpdateExerciseUseCase)
      await uc.execute(userId, val)
      const idx = exercises.value.findIndex((e) => e.id === val.id)
      if (idx !== -1) exercises.value.splice(idx, 1, val)
    } finally {
      loading.value = false
    }
  }

  /** Удаление упражнения по ID */
  async function removeExercise(id: string) {
    const userId = await getUserId()
    if (!userId) return
    loading.value = true
    try {
      const uc = container.get<DeleteExerciseUseCase>(TYPES.DeleteExerciseUseCase)
      await uc.execute(userId, id)
      exercises.value = exercises.value.filter((e) => e.id !== id)
    } finally {
      loading.value = false
    }
  }

  const getExerciseById = (id: string): Exercise | undefined => exercises.value.find(
    (ex) => ex.id ===id
  )

  const isDefault = (id: string): boolean => {
    return !!EXERCISES.find((e) => e.id === id)
  }

  return {
    isDefault,
    exercises,
    current,
    loading,
    loadAll,
    loadById,
    createExercise,
    updateExercise,
    removeExercise,
    getExerciseById
  }
})
