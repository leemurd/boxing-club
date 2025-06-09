<!-- src/presentation/components/views/progress/ProgressPage.vue -->
<template>
  <div class="progress-page">
    <b-card
      class="mb-4"
      no-border
    >
      <h5 class="card-title mb-4 text-center">{{ fullname }}</h5>
      <img
        :src="avatarImg"
        class="progress-page-main__avatar mb-4"
      >

      <b-button
        color="dark"
        class="w-100 mb-4"
        @click="$router.push({name: 'ProgressRecord'})"
      >New Record</b-button>

      <!-- Фильтр периода -->
      <filter-bar class="mb-2" />
    </b-card>

    <progress-stats-row
      v-if="dailyTotals.length"
      label="Daily Load"
      :items="dailyTotals"
    />

    <progress-stats-row
      v-if="byCategory.length"
      label="Categories"
      :items="byCategory"
    />

    <progress-stats-row
      v-if="byExercise.length"
      label="Exercises"
      :items="byExercise"
    >
      <template #name="{ name }">
        {{ getExerciseName(name) }}:
      </template>
    </progress-stats-row>

    <progress-stats-row
      v-if="byCombo.length"
      label="Combos"
      :items="byCombo"
    >
      <template #name="{ name }">
        {{ getComboTitle(name) }}:
      </template>
    </progress-stats-row>

    <progress-stats-row
      v-if="topTags.length"
      label="Tags"
      :items="topTags"
    >
      <template #name="{ name }">
        {{ getTagName(name) }}:
      </template>
    </progress-stats-row>

    <recent-records
      v-if="recentRecordsList.length"
      :items="recentRecordsList"
    />

    <empty-state
      v-if="!(recentRecordsList.length || dailyTotals.length || byCategory.length || topTags.length)"
      title="Empty state"
      description="No records found for this period"
    >
      <template #button>
        <b-button
          color="dark"
          class="w-100"
          outline
          @click="$router.push({name: 'ProgressRecord'})"
        >New Record</b-button>
      </template>
    </empty-state>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/presentation/stores/progressStore'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { useTagStore } from '@/presentation/stores/tagStore'
import FilterBar from '@/presentation/components/pages/progress/FilterBar.vue'
import avatarImg from '@/presentation/assets/avatar-colored.svg'
import BButton from '@/presentation/components/shared/BButton.vue'
import ProgressStatsRow from '@/presentation/components/pages/progress/ProgressStatsRow.vue'
import EmptyState from '@/presentation/components/shared/EmptyState.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import RecentRecords from '@/presentation/components/pages/progress/RecentRecords.vue'

const progress  = useProgressStore()
const exStore   = useExerciseStore()
const tagStore  = useTagStore()
const authStore = useAuthStore()
const comboStore = useComboStore()

// Загрузка данных при монтировании
onMounted(async () => {
  await tagStore.load()
  await exStore.loadAll()
  await progress.loadAll()
  await comboStore.load()
})

const fullname = computed(() => authStore.currentUser?.firstName + ' ' + authStore.currentUser?.lastName)

const dailyTotals = computed(() => progress.dailyTotals)
const byCategory = computed(() => progress.byCategory)
const topTags = computed(() => [...progress.byTag].sort((a, b) => b.reps - a.reps))
const byExercise = computed(() => progress.byExercise)
const byCombo = computed( () => progress.byCombo)

// Последние 10 записей
const recentRecordsList = computed(() =>
  progress.records
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 10)
)


// Хелперы
function getExerciseName(id: string) {
  return exStore.exercises.find((e) => e.id === id)?.name ?? id
}
function getTagName(id: string) {
  return tagStore.list.find((t) => t.id === id)?.name ?? id
}
function getComboTitle(id: string) {
  return comboStore.combos.find((c) => c.id === id)?.title ?? id
}
</script>

<style scoped lang="scss">
.progress-page {
  &-main {
    &__avatar {
      display: block;
      margin: 0 auto 1.5rem;
      height: 150px;
    }
  }
  &__line-title {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
}
</style>
