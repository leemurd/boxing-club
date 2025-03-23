<template>
  <div class="progress-page container py-4">
    <!-- Селект для выбора временного интервала -->
    <div class="mb-3">
      <label
        for="timeRange"
        class="form-label"
      >Time Range:</label>
      <b-button-group
        v-model="timeRange"
        color="dark"
        outline
        class="w-100"
        size="small"
        :items="[TimeRange.TODAY, TimeRange.WEEK, TimeRange.MONTH, TimeRange.ALL]"
      />
    </div>

    <!-- Блок "Избранные упражнения" -->
    <div
      v-if="favoriteExercises?.length"
      class="mb-4"
    >
      <h4>Favorite Exercises</h4>
      <ul class="list-group">
        <li
          v-for="exercise in favoriteExercises"
          :key="exercise.id"
          class="list-group-item"
        >
          {{ exercise.name }}: {{ getStats(exercise.id, 'today') }}
          <small class="text-muted">
            ({{ exercise.measurement }})
          </small>
        </li>
      </ul>
    </div>

    <!-- Статистика по упражнениям -->
    <div class="mb-4">
      <h4>Exercise Statistics</h4>
      <ul class="list-group">
        <template
          v-for="exercise in exercises"
          :key="exercise.id"
        >
          <li
            v-if="getStats(exercise.id, TimeRange.ALL)"
            class="list-group-item"
          >
            {{ exercise.name }}:
            {{ timeRange }}: {{ getStats(exercise.id, timeRange) }},
            total: {{ getStats(exercise.id, TimeRange.ALL) }}
            <small class="text-muted">
              ({{ exercise.measurement }})
            </small>
          </li>
        </template>
      </ul>
    </div>

    <!-- История выполненных упражнений -->
    <div>
      <h4>Exercise History</h4>
      <ul class="list-group">
        <li
          v-for="entry in history"
          :key="entry.timestamp + entry.exerciseId"
          class="list-group-item d-flex justify-content-between align-items-center py-1 px-2"
        >
          <small class="text-muted">{{ getExerciseById(entry.exerciseId)?.name }}</small>
          <span class="badge text-bg-primary rounded-pill">{{ entry.amount }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { type Exercise } from '@/domain/entities/Exercise'
import { onUserLoaded } from '@/presentation/utils/onUserLoaded.ts'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import { TimeRange } from '@/presentation/components/shared/types.ts'

const store = useExerciseStore()
const timeRange = ref<TimeRange>(TimeRange.TODAY)

onUserLoaded(async () => {
  await store.loadStats()
  await store.loadExercises()
  await store.loadHistory(30)
  await store.loadFavorites()
})

const exercises = computed<Exercise[]>(() => store.exercises)
const history = computed(() => store.history)

// Для простоты используем один метод, который возвращает статистику для упражнения
function getStats(exerciseId: string, period: TimeRange): number {
  if (exerciseId) return store.getStatsForPeriod(exerciseId, period || timeRange.value)
  else return 0
}

const favoriteExercises = computed<Exercise[]>(() => {
  return store.exercises.filter((ex) => store.favorites.includes(ex.id))
})

const getExerciseById = (id: string): Exercise | undefined => store.exercises.find((ex) => ex.id === id)
</script>

<style scoped>
.progress-page {
  max-width: 400px;
  margin: auto;
}
</style>
