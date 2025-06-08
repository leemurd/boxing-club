<!-- src/presentation/components/shared/ProgressLine.vue -->
<template>
  <div class="progress-line">
    <div class="progress-line__title">
      <span class="">
        <slot
          name="name"
          v-bind="{ name }"
        >
          {{ name }}:
        </slot>
      </span>
      <div class="d-flex flex-shrink-0 text-dark-emphasis">
        <span
          v-if="reps"
          class="me-2"
        >{{ reps }} reps,</span>
        <span
          v-if="min"
          class="me-2"
        >{{ min.toFixed(1) }} min,</span>
        <span
          v-if="sets"
        >{{ sets }} sets</span>
      </div>
    </div>
    <div
      class="progress-stacked"
      :style="`height: ${height}px`"
    >
      <!-- Сегмент за reps -->
      <div
        v-if="reps"
        class="progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="`width: ${pctReps}%; height: ${height}px`"
      >
        <div
          class="progress-bar bg-primary"
          :class="{
            'progress-bar-striped progress-bar-animated': loading
          }"
        >
          <span class="progress-line__hint text-bg-primary">{{ (pctReps > 20 && !loading) ? 'reps' : '' }}</span>
        </div>
      </div>

      <!-- Сегмент за minutes -->
      <div
        v-if="min"
        class="progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="`width: ${pctMin}%; height: ${height}px`"
      >
        <div
          :class="[
            `progress-bar bg-${darkColor}`,
            `text-bg-${darkColor}`,
            {
              'progress-bar-striped progress-bar-animated': loading
            }
          ]
          "
        >
          <span class="progress-line__hint">{{ (pctMin > 30 && !loading) ? 'minutes' : '' }}</span>
        </div>
      </div>

      <!-- Сегмент за sets -->
      <!--      <div-->
      <!--        v-if="sets"-->
      <!--        class="progress"-->
      <!--        role="progressbar"-->
      <!--        aria-valuemin="0"-->
      <!--        aria-valuemax="100"-->
      <!--        :style="`width: ${pctSets}%; height: ${height}px`"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="progress-bar bg-secondary"-->
      <!--          :class="{-->
      <!--            'progress-bar-striped progress-bar-animated': loading-->
      <!--          }"-->
      <!--        >-->
      <!--          <span class="progress-line__hint text-bg-secondary">{{ (pctSets > 20 && !loading) ? 'sets' : '' }}</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/presentation/stores/themeStore'

const props = withDefaults(
  defineProps<{
    height?: number
    name: string
    reps: number
    min: number
    sets: number,
    loading?: boolean
  }>(),
  { height: 12 }
)

const themeStore = useThemeStore()
const darkColor = computed(() => (themeStore.isDarkTheme ? 'light' : 'dark'))

// сумма всех трёх показателей
const sum = computed(() => props.reps + props.min + props.sets || 1)

// доля reps, minutes и sets в процентах
const pctReps = computed(() => Math.round((props.reps / sum.value) * 50))
const pctMin  = computed(() => Math.round((props.min  / sum.value) * 50))
// const pctSets = computed(() => Math.round((props.sets / sum.value) * 100))
</script>

<style lang="scss" scoped>
.progress-line {
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  &__hint {
    font-size: 9px;
  }
}
</style>
