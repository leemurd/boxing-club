<!-- src/presentation/components/views/progress/ProgressPage.vue -->
<template>
  <page-default>
    <ion-card class="ion-no-margin">
      <ion-card-header>
        <ion-card-title class="ion-text-center">{{ fullname }}</ion-card-title>
      </ion-card-header>
      <ion-card-content class="ion-text-center">
        <ion-img
          :src="avatarImg"
          class="progress-page-main__avatar ioc-margin-bottom"
        />
        <b-button
          expand="block"
          color="dark"
          class="ion-margin-bottom"
          @click="router.push({ name: 'ProgressRecord' })"
        >New Record</b-button>
        <filter-bar/>
      </ion-card-content>
    </ion-card>

    <progress-stats-row
      v-if="dailyTotals.length"
      label="Daily Load"
      :items="dailyTotals"
      class="ion-margin-bottom ion-margin-top"
    />
    <progress-stats-row
      v-if="byCategory.length"
      label="Categories"
      :items="byCategory"
      class="ion-margin-bottom"
    />
    <progress-stats-row
      v-if="byExercise.length"
      label="Exercises"
      :items="byExercise"
      class="ion-margin-bottom"
    >
      <template #name="{ name }">{{ getExerciseName(name) }}:</template>
    </progress-stats-row>
    <progress-stats-row
      v-if="byCombo.length"
      label="Combos"
      :items="byCombo"
      class="ion-margin-bottom"
    >
      <template #name="{ name }">{{ getComboTitle(name) }}:</template>
    </progress-stats-row>
    <progress-stats-row
      v-if="topTags.length"
      label="Tags"
      :items="topTags"
      class="ion-margin-bottom"
    >
      <template #name="{ name }">{{ getTagName(name) }}:</template>
    </progress-stats-row>

    <recent-records
      v-if="recentRecordsList.length"
      :items="recentRecordsList"
    />
    <empty-state
      v-else
      title="Empty state"
      description="No records found for this period"
    >
      <template #footer>
        <b-button
          expand="block"
          color="dark"
          fill="outline"
          @click="$router.push({ name: 'ProgressRecord' })"
        >
          New Record
        </b-button>
      </template>
    </empty-state>
  </page-default>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/presentation/stores/progressStore'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { useTagStore } from '@/presentation/stores/tagStore'
import { useComboStore } from '@/presentation/stores/comboStore'
import { useAuthStore } from '@/presentation/stores/authStore'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
} from '@ionic/vue'
import FilterBar from '@/presentation/components/pages/progress/FilterBar.vue'
import ProgressStatsRow from '@/presentation/components/pages/progress/ProgressStatsRow.vue'
import RecentRecords from '@/presentation/components/pages/progress/RecentRecords.vue'
import EmptyState from '@/presentation/components/shared/EmptyState.vue'
import avatarImg from '@/presentation/assets/avatar-colored.svg'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'

const progress   = useProgressStore()
const exStore    = useExerciseStore()
const tagStore   = useTagStore()
const comboStore = useComboStore()
const authStore  = useAuthStore()
const router = useProjectRouter()

onMounted(async () => {
  await tagStore.load()
  await exStore.loadAll()
  await progress.loadAll()
  await comboStore.load()
})

const fullname = computed(() => `${authStore.currentUser?.firstName} ${authStore.currentUser?.lastName}`)

const dailyTotals = computed(() => progress.dailyTotals)
const byCategory  = computed(() => progress.byCategory)
const byExercise  = computed(() => progress.byExercise)
const byCombo     = computed(() => progress.byCombo)
const topTags     = computed(() => [...progress.byTag].sort((a,b)=>b.reps-a.reps))

const recentRecordsList = computed(() =>
  progress.records.slice().sort((a,b)=>a.timestamp<b.timestamp?1:-1).slice(0,10)
)

function getExerciseName(id: string) {
  return exStore.exercises.find((e)=>e.id===id)?.name ?? id
}
function getTagName(id: string) {
  return tagStore.list.find((t)=>t.id===id)?.name ?? id
}
function getComboTitle(id: string) {
  return comboStore.combos.find((c)=>c.id===id)?.title ?? id
}
</script>

<style scoped lang="scss">
.progress-page {
  background: red;
  &-main {
    &__avatar {
      display: block;
      margin: 0 auto 1.5rem;
      height: 150px;
    }
  }
}
</style>
