<template>
  <div
    class="card"
    :class="{
      'border-0': noBorder && isDarkMode,
      [isDarkMode ? 'text-bg-dark' : 'bg-light']: true,
      // [`bg-${isDarkMode ? 'dark' : ''}`]: isDarkMode,
    }"
  >
    <div
      v-if="$slots['header']"
      class="card-header text-muted"
      :class="{
        'border-bottom-0': !$slots['default'] || noBorder,
      }"
    >
      <slot name="header"/>
    </div>

    <div
      v-if="$slots['default']"
      class="card-body"
      :class="{
        'p-0': noPadding
      }"
    >
      <slot/>
    </div>

    <div
      v-if="$slots['footer']"
      class="card-footer text-body-secondary"
    >
      <slot name="footer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
import { computed } from 'vue'

const props = defineProps<{
  noPadding?: boolean,
  noBorder?: boolean,
}>()

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkTheme)
</script>
