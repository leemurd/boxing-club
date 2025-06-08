<!-- src/presentation/components/shared/FilterBar.vue -->
<template>
  <div>
    <div class="d-flex align-items-center mb-4 justify-content-between">
      <b-button-group
        v-model="periodType"
        size="medium"
        class="w-100"
        color="light"
        :items="dateRangeItems"
        option-value="value"
        @update:model-value="onPeriodChange"
      >
        <template #default="{ item }">
          {{ item.label }}
        </template>
      </b-button-group>
    </div>

    <div class="d-flex">
      <b-button
        color="secondary"
        outline
        class="me-2 flex-grow-1"
        size="medium"
        :disabled="periodType === TimeRange.ALL"
        @click="shiftCursor(-1)"
      >
        Prev
      </b-button>

      <b-card
        class="flex-grow-1"
        no-padding
      >
        <div class="text-center py-2">
          {{ displayRange }}
        </div>
      </b-card>

      <b-button
        color="secondary"
        outline
        class="ms-2 flex-grow-1"
        size="medium"
        :disabled="periodType === TimeRange.ALL"
        @click="shiftCursor(1)"
      >
        Next
      </b-button>
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
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import BCard from '@/presentation/components/shared/BCard.vue'

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
const fmt = (d: Date) =>
  d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short'
  })

// вычисляем строку диапазона
const displayRange = computed(() => {
  if (periodType.value === TimeRange.ALL) {
    return 'All time'
  }
  const start = cursor.value
  if (periodType.value === TimeRange.DAY) {
    return fmt(start)
  }
  // для WEEK и MONTH
  const spanDays = periodType.value === TimeRange.WEEK ? 7 : 30
  const end = new Date(start.getTime())
  end.setDate(end.getDate() + spanDays - 1)
  return `${fmt(start)} – ${fmt(end)}`
})
</script>

<style scoped>
/* при необходимости добавьте отступы, выравнивание */
</style>
