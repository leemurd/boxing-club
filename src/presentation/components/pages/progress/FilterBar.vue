<!-- src/presentation/components/shared/FilterBar.vue -->
<template>
  <div class="d-flex align-items-center mb-4 justify-content-between">
    <b-button
      outline
      color="dark"
      class="me-2"
      size="small"
      :disabled="periodType === TimeRange.ALL"
      @click="shiftCursor(-1)"
    >
      Prev
    </b-button>

    <b-button-group
      v-model="periodType"
      size="small"
      color="dark"
      outline
      :items="dateRangeItems"
      option-value="value"
      @update:model-value="setPeriod"
    >
      <template #default="{ item }">
        {{ item?.label }}
      </template>
    </b-button-group>

    <b-button
      color="dark"
      outline
      class="ms-2"
      size="small"
      :disabled="periodType === TimeRange.ALL"
      @click="shiftCursor(1)"
    >
      Next
    </b-button>
  </div>
</template>

<script lang="ts" setup>
import { useProgressStore } from '@/presentation/stores/progressStore'
import { TimeRange } from '@/presentation/components/shared/types'
import { dateRangeItems } from '@/presentation/constants/progress/data'
import { storeToRefs } from 'pinia'
import BButton from '@/presentation/components/shared/BButton.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'

const store = useProgressStore()
const { periodType, cursor } = storeToRefs(store)

function setPeriod() {
  cursor.value = new Date() // сброс на сегодня при смене типа
}

function shiftCursor(delta: number) {
  const span =
    periodType.value === TimeRange.DAY
      ? 1
      : periodType.value === TimeRange.WEEK
        ? 7
        : periodType.value === TimeRange.MONTH
          ? 30
          : 0
  cursor.value = new Date(cursor.value.getTime())
  cursor.value.setDate(cursor.value.getDate() + delta * span)
}

</script>
