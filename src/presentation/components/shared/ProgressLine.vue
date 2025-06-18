<!-- src/presentation/components/shared/ProgressLine.vue -->
<template>
  <div class="progress-line">
    <div class="progress-line__title">
      <span>
        <slot
          name="name"
          v-bind="{ name }"
        >{{ name }}:</slot>
      </span>
      <div class="d-flex flex-shrink-0 text-dark-emphasis">
        <span
          v-if="reps"
          class="me-2"
        >{{ reps }} reps</span>
        <span
          v-if="min"
          class="me-2"
        >{{ min.toFixed(1) }} min</span>
        <span v-if="sets">  {{ sets }} sets</span>
      </div>
    </div>

    <div
      class="progress-stacked"
      :style="`height: ${height}px`"
    >
      <!-- репы -->
      <div
        v-if="reps"
        class="progress flex-shrink-1"
        role="progressbar"
        :aria-valuenow="reps"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="`width: ${pctReps}%; height: ${height}px`"
      >
        <div
          class="progress-bar bg-primary"
          :class="{'progress-bar-striped progress-bar-animated': loading}"
        >
          <span
            v-if="pctReps > 15 && !loading"
            class="progress-line__hint"
          >reps</span>
        </div>
      </div>

      <!-- минуты -->
      <div
        v-if="min"
        class="progress flex-shrink-0"
        role="progressbar"
        :aria-valuenow="min"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="`width: ${pctMin}%; height: ${height}px`"
      >
        <div
          :class="[
            `progress-bar bg-${darkColor} progress-bar--minutes`,
            `text-bg-${darkColor}`,
            { 'progress-bar-striped progress-bar-animated': loading }
          ]"
        >
          <span
            v-if="pctMin > 15 && !loading"
            class="progress-line__hint"
          >min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/presentation/stores/themeStore'

const props = withDefaults(defineProps<{
  name: string
  reps: number
  min: number
  sets?: number
  height?: number
  loading?: boolean
}>(), {
  height: 12,
  sets: 0,
  loading: false
})

const themeStore = useThemeStore()
const darkColor = computed(() => themeStore.isDarkTheme ? 'light' : 'dark')

// теперь просто берем сами значения (не нормируем по сумме)
const pctReps = computed(() => props.reps)
const pctMin  = computed(() => props.min)
</script>

<style scoped lang="scss">
.progress-line {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
    font-size: 1rem;
    font-weight: 500;
  }
  &__hint {
    font-size: 0.6rem;
  }
}

[dark] {
  .progress-bar {
    &--minutes {
      background-color: red!important;
    }
  }
}
</style>
