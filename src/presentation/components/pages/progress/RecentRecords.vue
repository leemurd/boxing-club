<template>
  <div v-if="items.length">
    <h2 class="h5 mb-3 text-center">Recent Records</h2>
    <b-card
      v-for="rec in items"
      :key="rec.id"
      class="mb-2"
      no-border
    >
      <div class="d-flex w-100 justify-content-between align-items-center">
        <div class="text-muted small">
          {{ formatDateTime(rec.timestamp) }}
        </div>

        <b-dropdown
          is-action-btn
          outline
          color="link"
          size="small"
          @click.prevent.stop
        >
          <template #btn-text>
            <i class="bi bi-three-dots-vertical"/>
          </template>
          <template #menu>
            <b-dropdown-item @click="progress.deleteRecord(rec.id)">Delete</b-dropdown-item>
          </template>
        </b-dropdown>
      </div>

      <div class="card-title">
        <div class="row pe-5">
          <div class="col">{{ getExerciseName(rec.exerciseId) }}</div>
          <div class="col-auto">{{ rec.amount }} {{ rec.measurement === 'seconds' ? 'sec' : 'reps' }}</div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { useProgressStore } from '@/presentation/stores/progressStore.ts'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import { getShortDateWithTime } from '@/presentation/utils/dateTime.ts'
import BDropdown from '@/presentation/components/shared/BDropdown.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'

defineProps<{
  items: TrainingRecord[]
}>()

const progress  = useProgressStore()
const exStore   = useExerciseStore()

function getExerciseName(id: string) {
  return exStore.exercises.find((e) => e.id === id)?.name ?? id
}
function formatDateTime(ts: string) {
  return getShortDateWithTime(new Date(ts))
}

</script>
