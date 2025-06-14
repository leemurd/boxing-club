<!-- src/presentation/components/shared/FilterBar.vue -->
<template>
  <div>
    <div class="row mb-3">
      <div class="col-auto">
        <b-button
          color="dark"
          size="small"
          outline
          :disabled="periodType === TimeRange.ALL"
          @click="shiftCursor(-1)"
        >
          Prev
        </b-button>
      </div>
      <div class="col p-0 d-flex align-items-center">
        <div class="text-center flex-grow-1 mb-0 fw-normal">
          {{ displayRange }}
        </div>
      </div>
      <div class="col-auto">
        <b-button
          color="dark"
          size="small"
          outline
          :disabled="periodType === TimeRange.ALL"
          @click="shiftCursor(1)"
        >
          Next
        </b-button>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between">
      <horizontal-segment-group
        v-model="periodType"
        :items="dateRangeItems"
        option-value="value"
        option-label="label"
        @update:model-value="onPeriodChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useProgressStore } from '@/presentation/stores/progressStore'
import { TimeRange } from '@/presentation/components/shared/types'
import { dateRangeItems } from '@/presentation/constants/progress/data'
import { storeToRefs } from 'pinia'
import BButton from '@/presentation/components/shared/BButton.vue'
import { getShortDate } from '@/presentation/utils/dateTime.ts'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'

const store = useProgressStore()
const { periodType, cursor } = storeToRefs(store)

// при смене периода сразу сбрасываем курсор на сегодняшний день
function onPeriodChange() {
  store.cursor = new Date()
}

// сдвигаем курсор на span дней
function shiftCursor(delta: number) {
  const span =
    periodType.value === TimeRange.DAY   ? 1  :
    periodType.value === TimeRange.WEEK  ? 7  :
    periodType.value === TimeRange.MONTH ? 30 :
    0

  const next = new Date(cursor.value.getTime())
  next.setDate(next.getDate() + delta * span)
  store.cursor = next
}

// форматтер дат вида "1 Feb"


// вычисляем строку диапазона
const displayRange = computed(() => {
  if (periodType.value === TimeRange.ALL) {
    return 'All time'
  }

  const end = new Date(cursor.value)   // курсор — это конец периода
  // const fmt = (d: Date) =>
  //   d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

  if (periodType.value === TimeRange.DAY) {
    return getShortDate(end)
  }

  // для WEEK и MONTH
  const spanDays = periodType.value === TimeRange.WEEK ? 7 : 30
  const start = new Date(end.getTime())
  start.setDate(end.getDate() - spanDays + 1)

  return `${getShortDate(start)} – ${getShortDate(end)}`
})
</script>
