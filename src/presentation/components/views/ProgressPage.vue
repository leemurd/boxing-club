<template>
  <div class="progress-page pb-4">
    <b-card
      class="progress-page-main"
      no-border
      no-padding
    >
      <template #header>
        <h6 class="card-title mb-0">Wolf</h6>
      </template>
      <div class="row mt-3">
        <div class="col">
          <img
            :src="avatarImg"
            class="progress-page-main__avatar"
          >
        </div>
        <div class="col">
          <div class="card-title mb-2 text-body-secondary">
            {{ userStore.currentUser?.firstName }} {{ userStore.currentUser?.lastName }}
          </div>
          <div class="card-text text-muted">
            <span class="small">Physics: 21 (+2)</span>
            <div
              class="progress-stacked"
              style="height: 10px"
            >
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment one"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 25%; height: 10px"
              >
                <div class="progress-bar bg-light"/>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment two"
                aria-valuenow="10"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 10%; height: 10px"
              >
                <div class="progress-bar bg-success"/>
              </div>
            </div>
            <span class="small">Technic: 19 (+1)</span>
            <div
              class="progress-stacked"
              style="height: 10px"
            >
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment one"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 25%; height: 10px"
              >
                <div class="progress-bar bg-light"/>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment two"
                aria-valuenow="5"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 5%; height: 10px"
              >
                <div class="progress-bar bg-success"/>
              </div>
            </div>
            <span class="small">Practice: 14 (-1)</span>
            <div
              class="progress-stacked"
              style="height: 10px"
            >
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment one"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 25%; height: 10px"
              >
                <div class="progress-bar bg-light"/>
              </div>
              <div
                class="progress"
                role="progressbar"
                aria-label="Segment two"
                aria-valuenow="5"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: 5%; height: 10px"
              >
                <div class="progress-bar bg-danger"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </b-card>


    <div class="mb-3 mt-3">
      <label
        for="timeRange"
        class="form-label"
      >Time Range:</label>
      <b-dropdown
        v-model="timeRange"
        outline
        size="small"
        :items="dateRangeItems"
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
      <h4>Statistics</h4>
      <ul class="list-group">
        <template
          v-for="exercise in exercises"
          :key="exercise.id"
        >
          <li
            v-if="getStats(exercise.id, TimeRange.ALL)"
            class="list-group-item small py-1 px-2"
          >
            {{ exercise.name }}:
            <small class="text-muted">
              {{ timeRange }}: {{ getStats(exercise.id, timeRange) }},
              total: {{ getStats(exercise.id, TimeRange.ALL) }}
            </small>
          </li>
        </template>
      </ul>
    </div>

    <!-- История выполненных упражнений -->
    <div>
      <h4>History</h4>
      <ul class="list-group">
        <li
          v-for="entry in history"
          :key="entry.timestamp + entry.exerciseId"
          class="list-group-item d-flex justify-content-between align-items-center py-1 px-2"
        >
          <small class="text-muted">{{ getExerciseById(entry.exerciseId)?.name }}</small>
          <span class="badge text-bg-primary rounded-pill small">{{ entry.amount }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { type Exercise } from '@/domain/entities/Exercise.ts'
import { onUserLoaded } from '@/presentation/utils/onUserLoaded.ts'
import { TimeRange } from '@/presentation/components/shared/types.ts'
import BDropdown from '@/presentation/components/shared/BDropdown.vue'
import { dateRangeItems } from '@/presentation/constants/progress/data.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
// import avatarImg from '@/presentation/assets/avatar.webp'
// import avatarImg from '@/presentation/assets/avatar.svg'
// import avatarImg from '@/presentation/assets/avatar-fill.svg'
import avatarImg from '@/presentation/assets/avatar-colored.svg'

const store = useExerciseStore()
const userStore = useAuthStore()
const timeRange = ref<TimeRange>(dateRangeItems[0].value)

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

<style scoped lang="scss">
.progress-page {
  &-main {
    &__avatar {
      //height: 150px;
      //width: 40%;
      width: 100%;
      height: auto;
    }
  }
}
</style>
