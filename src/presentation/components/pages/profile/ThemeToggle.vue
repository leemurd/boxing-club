<template>
  <div class="form-check">
    <input
      id="flexCheckDefault"
      v-model="isDarkTheme"
      class="form-check-input"
      type="checkbox"
      @change="toggleTheme"
    >
    <label
      class="form-check-label"
      for="flexCheckDefault"
    >
      Dark theme
    </label>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
const themeStore = useThemeStore()
const { isDarkTheme, toggleTheme } = themeStore
</script>
