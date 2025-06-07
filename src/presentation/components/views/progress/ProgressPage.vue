<!-- src/presentation/components/views/progress/ProgressPage.vue -->
<template>
  <div class="progress-page py-4">
    <img
      :src="avatarImg"
      class="progress-page-main__avatar mb-4"
    >

    <b-button
      color="dark"
      class="w-100 mb-4"
      outline
      @click="$router.push({name: 'ProgressRecord'})"
    >New Record</b-button>

    <!-- Фильтр периода -->
    <filter-bar class="mb-5" />

    <progress-stats-row
      label="Daily Load"
      :items="dailyTotals"
    >
      <template #name="{ name }">
        <div class="text-muted small">[{{ name }}]:</div>
      </template>
    </progress-stats-row>

    <progress-stats-row
      label="By Category"
      :items="byCategory"
    />

    <progress-stats-row
      label="By Tag"
      :items="topTags"
    >
      <template #name="{ name }">
        {{ getTagName(name) }}:
      </template>
    </progress-stats-row>

    <section>
      <h2 class="h5 mb-3">Recent Records</h2>
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Exercise</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="rec in recentFive"
            :key="rec.id"
          >
            <td>{{ formatDateTime(rec.timestamp) }}</td>
            <td>{{ getExerciseName(rec.exerciseId) }}</td>
            <td>
              {{ rec.amount }}
              {{ rec.measurement === 'seconds' ? 'sec' : 'reps' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
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

const progress  = useProgressStore()
const exStore   = useExerciseStore()
const tagStore  = useTagStore()

// Загрузка данных при монтировании
onMounted(async () => {
  await tagStore.load()
  await exStore.loadAll()
  await progress.loadAll()
})

// Ежедневная статистика
const dailyTotals = computed(() => progress.dailyTotals)
// Статистика по категориям
const byCategory = computed(() => progress.byCategory)
// const isLoading = computed(() => progress.isLoading ?? true)

// Top-5 тегов по reps
const topTags = computed(() =>
  [...progress.byTag]
    .sort((a, b) => b.reps - a.reps)
    // .slice(0, 10)
)

// Последние 5 записей
const recentFive = computed(() =>
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
function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString()
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
