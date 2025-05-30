// src/presentation/stores/trainingStore.ts
import { defineStore } from 'pinia'
import { TYPES } from '@/infrastructure/di/types'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { GetUserStatsUseCase } from '@/application/useCases/record/GetUserStatsUseCase'
import type { GetExerciseHistoryUseCase } from '@/application/useCases/record/GetExerciseHistoryUseCase'
import { computed, ref } from 'vue'
import type { MeasurementUnit } from '@/domain/entities/Exercise.ts'
import { getUserId } from '@/presentation/utils/getUserId.ts'
import type { LogExerciseUseCase } from '@/application/useCases/record/LogExerciseUseCase.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'
import type { TimeRange } from '@/presentation/components/shared/types.ts'
import { useToast } from 'vue-toastification'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'

const toast = useToast()

export const useRecordStore = defineStore('record', () => {
  const exStore = useExerciseStore()
  const stats = ref()
  const history = ref<TrainingRecord[]>([])
  const favorites = ref<string[]>([])
  const exercises = computed(() => exStore.exercises)

  async function logExercise(exerciseId: string, amount: number, unit: MeasurementUnit) {
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

  function getStatsForPeriod(exerciseId: string, timeRange: TimeRange): number {
    if (!stats.value) return 0
    const stat = stats.value[exerciseId]
    if (!stat) return 0
    return timeRange === 'today' ? stat.today : stat.total
  }
  async function loadExercises() {
    // const { EXERCISES } = await import('@/domain/constants/exercises')
    // exercises.value = EXERCISES
  }

  function clearStats() {
    stats.value = undefined
    history.value = []
    favorites.value = []
    // exercises.value = []
  }

  return {
    stats,
    history,
    favorites,
    exercises,
    logExercise,
    loadStats,
    loadHistory,
    getStatsForPeriod,
    loadExercises,
    clearStats
  }
})
