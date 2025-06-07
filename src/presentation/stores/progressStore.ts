// src/presentation/stores/progressStore.ts

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { ExerciseCategory } from '@/domain/entities/Exercise'
import { TimeRange } from '@/presentation/components/shared/types'
import { getUserId } from '@/presentation/utils/getUserId.ts'
import type { GetRecordsUseCase } from '@/application/useCases/record/GetRecordsUseCase.ts'
import type { GetTotalsByTagUseCase } from '@/application/useCases/record/GetTotalsByTagUseCase.ts'
import type { GetDailyTotalsUseCase } from '@/application/useCases/record/GetDailyTotalsUseCase.ts'
import type { GetTotalsByCategoryUseCase } from '@/application/useCases/record/GetTotalsByCategoryUseCase.ts'
import type { DeleteRecordUseCase } from '@/application/useCases/record/DeleteRecordUseCase.ts'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import type { DefaultTagId } from '@/domain/constants/defaultTags.ts'

export const useProgressStore = defineStore('progress', () => {
  // вместо строковых литералов теперь TimeRange
  const periodType = ref<TimeRange>(TimeRange.WEEK)
  const cursor = ref<Date>(new Date())

  const dateRange = computed(() => {
    const to = new Date(cursor.value)
    let from: Date

    switch (periodType.value) {
      case TimeRange.DAY:
        from = new Date(to)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break

      case TimeRange.WEEK:
        from = new Date(to)
        from.setDate(to.getDate() - 6)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break

      case TimeRange.MONTH:
        from = new Date(to)
        from.setDate(to.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break

      case TimeRange.ALL:
        from = new Date(0)
        to.setHours(23, 59, 59, 999)
        break
    }

    return {
      from,
      to
    }
  })

  const records = ref<TrainingRecord[]>([])
  const dailyTotals = ref<ProgressEntity<string>[]>([])
  const byCategory = ref<ProgressEntity<ExerciseCategory>[]>([])
  const byTag = ref<ProgressEntity<DefaultTagId>[]>([])
  const isLoading = ref<boolean>(false)

  // загрузка всех данных при изменении фильтра
  async function loadAll() {
    const { from, to } = dateRange.value
    const userId = await getUserId()
    if (!userId) return
    isLoading.value = true
    // console.log(isLoading.value)
    records.value = await getUC<GetRecordsUseCase>(TYPES.GetRecordsUseCase).execute(userId, from, to)
    dailyTotals.value = await getUC<GetDailyTotalsUseCase>(TYPES.GetDailyTotalsUseCase).execute(userId, from, to)
    byCategory.value = await getUC<GetTotalsByCategoryUseCase>(TYPES.GetTotalsByCategoryUseCase).execute(userId, from, to)
    byTag.value = await getUC<GetTotalsByTagUseCase>(TYPES.GetTotalsByTagUseCase).execute(userId, from, to)
    isLoading.value = false
    // console.log(isLoading.value)
  }

  async function deleteRecord(recordId: string) {
    const userId = await getUserId()
    if (!userId) return
    await getUC<DeleteRecordUseCase>(TYPES.DeleteRecordUseCase).execute(userId, recordId)
    await loadAll()
  }

  // следим за periodType и cursor
  watch([periodType, cursor], loadAll, { immediate: true })

  return {
    periodType,
    cursor,
    isLoading,
    dateRange,
    records,
    dailyTotals,
    byCategory,
    byTag,
    loadAll,
    deleteRecord
  }
})
