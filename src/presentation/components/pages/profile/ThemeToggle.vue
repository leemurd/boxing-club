<template>
  <b-toggle
    :model-value="isDark"
    @update:model-value="toggleTheme"
  >
    {{ label }}
  </b-toggle>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToggleCustomEvent } from '@ionic/vue'
import { useThemeStore } from '@/presentation/stores/themeStore'
import BToggle from '@/presentation/components/shared/BToggle.vue'

withDefaults(
  defineProps<{ label?: string }>(),
  { label: 'Dark theme' }
)

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDarkTheme)

function toggleTheme(event: ToggleCustomEvent) {
  themeStore.toggleTheme()
}
</script>
