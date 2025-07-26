// src/presentation/stores/progressStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { withLoading } from '@/presentation/utils/withLoading'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { ExerciseCategory, MeasurementUnit } from '@/domain/entities/Exercise'
import { TimeRange } from '@/presentation/components/shared/types'
import { getUserId } from '@/presentation/utils/getUserId'
import type { ProgressEntity } from '@/presentation/constants/progress/types'
import type { DeleteRecordUseCase } from '@/application/useCases/record/DeleteRecordUseCase'
import type { GetRecordsUseCase } from '@/application/useCases/record/GetRecordsUseCase'
import type { LogExerciseUseCase } from '@/application/useCases/record/LogExerciseUseCase'
import { useToast } from 'vue-toastification'
import {
  calcByCategory,
  calcByCombo,
  calcByExercise,
  calcByTag,
  calcDailyTotals,
  computeDateRange
} from '@/application/services/progressCalculators'

export const useProgressStore = defineStore('progress', () => {
  const periodType = ref<TimeRange>(TimeRange.WEEK)
  const cursor = ref<Date>(new Date())

  const records = ref<TrainingRecord[]>([])
  const dailyTotals = ref<ProgressEntity<string>[]>([])
  const byCategory = ref<ProgressEntity<ExerciseCategory>[]>([])
  const byTag = ref<ProgressEntity<string>[]>([])
  const byExercise = ref<ProgressEntity<string>[]>([])
  const byCombo = ref<ProgressEntity<string>[]>([])

  const toast = useToast()

  const loadAll = withLoading(async () => {
    const { from, to } = computeDateRange(periodType.value, cursor.value)
    const userId = await getUserId()
    if (!userId) return

    const getRecordsUC = getUC<GetRecordsUseCase>(TYPES.GetRecordsUseCase)
    records.value = await getRecordsUC.execute(userId, from, to)

    dailyTotals.value = calcDailyTotals(records.value)
    byCategory.value = calcByCategory(records.value)
    byTag.value = calcByTag(records.value)
    byExercise.value = calcByExercise(records.value)
    byCombo.value = calcByCombo(records.value)
  })

  const logExercise = withLoading(
    async (
      exerciseId: string,
      category: ExerciseCategory,
      amount: number,
      unit: MeasurementUnit,
      tagIds: string[],
      comboId: string | null
    ) => {
      const userId = await getUserId()
      if (!userId) return
      try {
        const logUC = getUC<LogExerciseUseCase>(TYPES.LogExerciseUseCase)
        await logUC.execute(userId, exerciseId, category, amount, unit, tagIds, comboId)
        toast.success('Record added successfully.')
      } catch (err: any) {
        toast.error(err)
        throw err
      }
    }
  )

  const deleteRecord = withLoading(async (id: string) => {
    if (!id) return
    const userId = await getUserId()
    if (!userId) return
    const deleteUC = getUC<DeleteRecordUseCase>(TYPES.DeleteRecordUseCase)
    await deleteUC.execute(userId, id)
    await loadAll()
  })

  watch([periodType, cursor], loadAll, { immediate: true })

  return {
    periodType,
    cursor,
    records,
    dailyTotals,
    byCategory,
    byTag,
    byExercise,
    byCombo,
    loadAll,
    logExercise,
    deleteRecord
  }
})
