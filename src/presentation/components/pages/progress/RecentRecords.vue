<template>
  <div v-if="items.length">
    <h2 class="h5 mb-3 text-center">Recent Records</h2>
    <ion-card
      v-for="rec in items"
      :key="rec.id"
      class="mb-0"
      no-border
    >
      <ion-card-header>
        <ion-card-title class="mb-2">{{ getExerciseName(rec.exerciseId) }}</ion-card-title>
        <ion-card-subtitle>{{ formatDateTime(rec.timestamp) }}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content class="ion-text-center">
        {{ rec.amount }} {{ rec.measurement === 'seconds' ? 'sec' : 'reps' }}
      </ion-card-content>
      <ion-button
        color="danger"
        fill="clear"
        @click="progress.deleteRecord(rec?.id || '')"
      >Delete</ion-button>
      <!--        <ion-button fill="clear">Action 1</ion-button>-->
      <!-- <b-dropdown-item @click="progress.deleteRecord(rec.id)">Delete</b-dropdown-item>-->

    </ion-card>
  </div>
</template>

<script setup lang="ts">
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { useProgressStore } from '@/presentation/stores/progressStore.ts'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { getShortDateWithTime } from '@/presentation/utils/dateTime.ts'
import { IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonCardSubtitle, IonCard } from '@ionic/vue'

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
