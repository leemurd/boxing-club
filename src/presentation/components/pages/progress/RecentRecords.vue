<template>
  <div v-if="items.length">
    <h2 class="h5 mb-3 text-center">Recent Records</h2>
    <b-card
      v-for="rec in items"
      :key="rec.id"
      class="ion-margin-bottom"
    >
      <template v-slot:header>
        <ion-card-title class="mb-2">{{ getExerciseName(rec.exerciseId) }}</ion-card-title>
        <ion-card-subtitle>{{ formatDateTime(rec.timestamp) }}</ion-card-subtitle>
      </template>

      <template v-slot>
        <div
          class="ion-text-center"
        >{{ rec.amount }} {{ rec.measurement === 'seconds' ? 'sec' : 'reps' }}</div>
      </template>

      <template v-slot:footer>
        <b-button
          color="danger"
          fill="outline"
          @click="onDelete(rec.id)"
        >
          Delete
        </b-button>
      </template>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { useProgressStore } from '@/presentation/stores/progressStore.ts'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { getShortDateWithTime } from '@/presentation/utils/dateTime.ts'
import { IonCardTitle, IonCardSubtitle } from '@ionic/vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useDeleteSheets } from '@/presentation/composition/useSheets.ts'

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

const onDelete = (id?: string) => {
  if (!id) return
  useDeleteSheets(id, progress.deleteRecord)
}

</script>
