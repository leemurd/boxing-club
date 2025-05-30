<template>
  <div
    class="progress-stacked"
    :style="`height: ${height}px`"
  >
    <div
      class="progress"
      role="progressbar"
      aria-label="Segment one"
      :aria-valuenow="oldValue"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="`width: ${oldValue}%; height: ${height}px`"
    >
      <div :class="`progress-bar bg-${oldValueColor}`"/>
    </div>
    <div
      v-if="progressValue"
      class="progress"
      role="progressbar"
      aria-label="Segment two"
      aria-valuenow="10"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="`width: ${Math.abs(progressValue)}%; height: ${height}px`"
    >
      <div :class="`progress-bar bg-${progressColor}`"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/presentation/stores/themeStore.ts'

const themeStore = useThemeStore()
const props = withDefaults(defineProps<{
  progressValue?: number,
  oldValue: number,
  height?: number
}>(), {
  height: 10
})

const isProgressPositive = computed(() => {
  if (!props.progressValue) {
    return null
  } else {
    return props.progressValue > 0
  }
})

const progressColor = computed(() => isProgressPositive.value ? 'success' : 'danger')
const oldValueColor = computed(() => themeStore.isDarkTheme ? 'light' : 'dark')
</script>
