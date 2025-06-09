// src/presentation/stores/progressStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { ExerciseCategory, MeasurementUnit } from '@/domain/entities/Exercise'
import { TimeRange } from '@/presentation/components/shared/types'
import { getUserId } from '@/presentation/utils/getUserId'
import type { ProgressEntity } from '@/presentation/constants/progress/types'
import type { DeleteRecordUseCase } from '@/application/useCases/record/DeleteRecordUseCase.ts'
import type { GetRecordsUseCase } from '@/application/useCases/record/GetRecordsUseCase.ts'
import type { LogExerciseUseCase } from '@/application/useCases/record/LogExerciseUseCase.ts'
import { useToast } from 'vue-toastification'
import {
  calcByCategory,
  calcByCombo,
  calcByExercise,
  calcByTag,
  calcDailyTotals,
  computeDateRange
} from '@/application/services/progressCalculators.ts'

const toast = useToast()

export const useProgressStore = defineStore('progress', () => {
  const periodType = ref<TimeRange>(TimeRange.WEEK)
  const cursor = ref<Date>(new Date())

  const records = ref<TrainingRecord[]>([])
  const dailyTotals = ref<ProgressEntity<string>[]>([])
  const byCategory = ref<ProgressEntity<ExerciseCategory>[]>([])
  const byTag = ref<ProgressEntity<string>[]>([])
  const byExercise = ref<ProgressEntity<string>[]>([])
  const byCombo = ref<ProgressEntity<string>[]>([])

  // Основная загрузка + пересчёт всех агрегатов
  async function loadAll() {
    const { from, to } = computeDateRange(periodType.value, cursor.value)
    const userId = await getUserId()
    if (!userId) return

    records.value = await getUC<GetRecordsUseCase>(TYPES.GetRecordsUseCase).execute(userId, from, to)
    dailyTotals.value = calcDailyTotals(records.value)
    byCategory.value = calcByCategory(records.value)
    byTag.value = calcByTag(records.value)
    byExercise.value = calcByExercise(records.value)
    byCombo.value = calcByCombo(records.value)
  }

  async function logExercise(
    exerciseId: string,
    category: ExerciseCategory,
    amount: number,
    unit: MeasurementUnit,
    tagIds: string[],
    comboId: string | null
  ) {
    const userId = await getUserId()
    if (!userId) return
    try {
      await getUC<LogExerciseUseCase>(TYPES.LogExerciseUseCase).execute(
        userId,
        exerciseId,
        category,
        amount,
        unit,
        tagIds,
        comboId || null
      )
      toast.success('Successfully logged exercise')
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  // После логирования или удаления записи — просто вызвать loadAll()
  async function deleteRecord(id: string) {
    const userId = await getUserId()
    if (!userId) return
    await getUC<DeleteRecordUseCase>(TYPES.DeleteRecordUseCase).execute(userId, id)
    await loadAll()
  }

  // Перезагрузим при смене фильтра
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
