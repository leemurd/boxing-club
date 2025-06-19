<!-- src/presentation/components/shared/FilterBar.vue -->
<template>
  <ion-grid>
    <ion-row class="ion-margin-bottom ion-align-items-center">
      <ion-col size="auto">
        <b-button
          color="dark"
          size="small"
          outline
          :disabled="periodType === TimeRange.ALL"
          @click="shiftCursor(-1)"
        >
          Prev
        </b-button>
      </ion-col>
      <ion-col class="ion-text-center">
        {{ displayRange }}
      </ion-col>
      <ion-col size="auto">
        <b-button
          color="dark"
          size="small"
          outline
          :disabled="periodType === TimeRange.ALL"
          @click="shiftCursor(1)"
        >
          Next
        </b-button>
      </ion-col>
    </ion-row>
    <ion-row>
      <horizontal-segment-group
        v-model="periodType"
        :items="dateRangeItems"
        option-value="value"
        option-label="label"
        @update:model-value="onPeriodChange"
      />
    </ion-row>
  </ion-grid>
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
import { IonGrid, IonRow, IonCol } from '@ionic/vue'

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

  const end = new Date(cursor.value) // курсор — это конец периода

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
