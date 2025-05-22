// src/presentation/stores/exerciseStore.ts
import { defineStore } from 'pinia'
import { TYPES } from '@/infrastructure/di/types'
import type { LogExerciseUseCase } from '@/application/useCases/exercise/LogExerciseUseCase.ts'
import type { GetUserStatsUseCase } from '@/application/useCases/user/GetUserStatsUseCase.ts'
import type { GetExerciseHistoryUseCase } from '@/application/useCases/exercise/GetExerciseHistoryUseCase.ts'
import type { Record } from '@/domain/entities/Record.ts'
import type { ManageFavoriteExercisesUseCase } from '@/application/useCases/exercise/ManageFavoriteExercisesUseCase.ts'
import { ref } from 'vue'
import type { Exercise } from '@/domain/entities/Exercise.ts'
import { TimeRange } from '@/presentation/components/shared/types.ts'
import { useToast } from 'vue-toastification'
import { getUserId } from '@/presentation/utils/getUserId.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'

const toast = useToast()

export const useExerciseStore = defineStore('exercise', () => {
  const stats = ref()
  const history = ref<Record[]>([])
  const favorites = ref<string[]>([])
  const exercises = ref<Exercise[]>([])

  async function logExercise(exerciseId: string, amount: number, unit: 'minutes' | 'repetitions') {
    const userId = await getUserId()
    if (!userId) return
    try {
      await getUC<LogExerciseUseCase>(TYPES.LogExerciseUseCase).execute(userId, exerciseId, amount, unit)
      await loadStats()
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadStats() {
    const userId = await getUserId()
    if (!userId) return
    try {
      stats.value = await getUC<GetUserStatsUseCase>(TYPES.GetUserStatsUseCase).execute(userId)
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadHistory(days: number) {
    const userId = await getUserId()
    if (!userId) return
    try {
      history.value = await getUC<GetExerciseHistoryUseCase>(TYPES.GetExerciseHistoryUseCase).execute(userId, days)
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadFavorites() {
    const userId = await getUserId()
    if (!userId) return
    try {
      favorites.value = await getUC<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase).getFavorites(userId)
    } catch (err) {
      toast.error(err)
    }
  }
  async function updateFavorites(favs: string[]) {
    const userId = await getUserId()
    if (!userId) return
    try {
      await getUC<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase).updateFavorites(userId, favs)
      favorites.value = favs
    } catch (err) {
      toast.error(err)
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
    clearStats
  }
})
