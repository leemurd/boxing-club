import { defineStore } from 'pinia'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import { useAuthStore } from '@/presentation/stores/authStore'
import type { LogExerciseUseCase } from '@/application/useCases/LogExerciseUseCase.ts'
import type { GetUserStatsUseCase } from '@/application/useCases/GetUserStatsUseCase.ts'
import type { GetExerciseHistoryUseCase } from '@/application/useCases/GetExerciseHistoryUseCase.ts'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import type { ManageFavoriteExercisesUseCase } from '@/application/useCases/ManageFavoriteExercisesUseCase.ts'
import { ref } from 'vue'
import type { Exercise } from '@/domain/entities/Exercise.ts'
import { TimeRange } from '@/presentation/components/shared/types.ts'

export const useExerciseStore = defineStore('exercise', () => {
  const stats = ref()
  const history = ref<TrainingRecord[]>([])
  const favorites = ref<string[]>([])
  const exercises = ref<Exercise[]>([])
  const authStore = useAuthStore()

  async function logExercise(exerciseId: string, amount: number, unit: 'minutes' | 'repetitions') {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      await container.get<LogExerciseUseCase>(TYPES.LogExerciseUseCase).execute(userId, exerciseId, amount, unit)
      await loadStats()
    } catch (err) {
      console.error(err)
    }
  }
  async function loadStats() {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      stats.value = await container.get<GetUserStatsUseCase>(TYPES.GetUserStatsUseCase).execute(userId)
    } catch (err) {
      console.error(err)
    }
  }
  async function loadHistory(days: number) {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      history.value = await container.get<GetExerciseHistoryUseCase>(TYPES.GetExerciseHistoryUseCase).execute(userId, days)
    } catch (err) {
      console.error(err)
    }
  }
  async function loadFavorites() {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      favorites.value = await container
        .get<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase)
        .getFavorites(userId)
    } catch (err) {
      console.error(err)
    }
  }
  async function updateFavorites(favs: string[]) {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      await container.get<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase).updateFavorites(userId, favs)
      favorites.value = favs
    } catch (err) {
      console.error(err)
    }
  }
  function getStatsForPeriod(exerciseId: string, timeRange: TimeRange): number {
    if (!stats.value) return 0
    const stat = stats.value[exerciseId]
    if (!stat) return 0
    return timeRange === 'today' ? stat.today : stat.total
  }
  async function loadExercises() {
    const { EXERCISES } = await import('@/domain/constants/exercises')
    exercises.value = EXERCISES
  }

  function clearStats() {
    stats.value = undefined
    history.value = []
    favorites.value = []
    exercises.value = []
  }

  return {
    stats,
    history,
    favorites,
    exercises,
    logExercise,
    loadStats,
    loadHistory,
    loadFavorites,
    updateFavorites,
    getStatsForPeriod,
    loadExercises,
    clearStats,
  }
})
