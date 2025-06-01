<template>
  <div class="progress-page pb-4">
    <b-card
      class="progress-page-main"
      no-border
      no-padding
    >
      <template #header>
        <div class="d-flex align-items-center">
          <h6 class="card-title mb-0">
            {{ userStore.currentUser?.firstName }} {{ userStore.currentUser?.lastName }}
          </h6>

          <div class="ms-auto">
            <b-dropdown
              v-model="timeRange"
              outline
              size="small"
              :items="dateRangeItems"
            />
          </div>
        </div>
      </template>
      <div class="mt-3">
        <div class="">
          <img
            :src="avatarImg"
            class="progress-page-main__avatar"
          >
        </div>
        <div class="col-12">
          <div class="card-body px-4">
            <b-card no-border>
              <div class="h1 mb-3 text-center">Skills</div>
              <div class="d-flex flex-column gap-2">
                <div class="">
                  <div class="progress-page__line-title">Physics: 21 (+2)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="10"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Practice: 14 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Cardio: 14 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Hands: 14 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Legs: 14 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Add. weight: 14 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Press: 10 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
                <div class="">
                  <div class="progress-page__line-title">Back: 10 (-1)</div>
                  <progress-line
                    :old-value="25"
                    :progress-value="-5"
                    :height="5"
                  />
                </div>
              </div>
            </b-card>
          </div>
        </div>
      </div>
    </b-card>

    <!-- Статистика по упражнениям -->
    <div class="mb-4">
      <h4>Exercises stats</h4>
      <ul class="list-group">
        <template
          v-for="exercise in exercises"
          :key="exercise.id"
        >
          <!--            v-if="getStats(exercise.id, TimeRange.ALL)"-->
          <li
            class="list-group-item small py-1 px-2 d-flex"
          >
            <div class="text-truncate me-2">
              {{ exercise.name }}
            </div>
            <small class="text-muted ms-auto flex-shrink-0">
              {{ timeRange }}: {{ getStats(exercise.id, timeRange) }},
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
import { useRecordStore } from '@/presentation/stores/recordStore.ts'
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
import ProgressLine from '@/presentation/components/shared/ProgressLine.vue'

const store = useRecordStore()
const userStore = useAuthStore()
const timeRange = ref<TimeRange>(dateRangeItems[0].value)
const recordStore = useRecordStore()

onUserLoaded(async () => {
  await recordStore.loadStats()
  await recordStore.loadExercises()
  await recordStore.loadHistory(30)
  // await trainingStore.loadFavorites()
})

const exercises = computed<Exercise[]>(() => store.exercises)
const history = computed(() => store.history)

function getStats(exerciseId: string, period: TimeRange): number {
  if (exerciseId) {
    return store.getStatsForPeriod(exerciseId, period || timeRange.value)
  }
  else {
    return 0
  }
}

const getExerciseById = (id: string): Exercise | undefined => store.exercises.find((ex) => ex.id === id)
</script>

<style scoped lang="scss">
.progress-page {
  &-main {
    &__avatar {
      width: auto;
      height: 200px;
    }
  }
  &__line-title {
    font-size: $font-size-root;
    text-align: center;
    margin-bottom: 4px;
  }
}
</style>
