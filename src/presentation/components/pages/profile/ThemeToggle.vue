<template>
  <ion-list>
    <ion-item lines="none">
      <ion-toggle
        label-placement="start"
        :checked="isDark"
        @ionChange="toggleTheme"
      >
        {{ label }}
      </ion-toggle>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonList, IonItem, IonToggle } from '@ionic/vue'
import type { ToggleCustomEvent } from '@ionic/vue'
import { useThemeStore } from '@/presentation/stores/themeStore'

// Props: необязательный текст метки
const props = withDefaults(
  defineProps<{ label?: string }>(),
  { label: 'Dark theme' }
)

// Подключаем Pinia store
const themeStore = useThemeStore()

// Композиция для двусторонней связи
const isDark = computed(() => themeStore.isDarkTheme)

// Обработчик переключения
function toggleTheme(event: ToggleCustomEvent) {
  themeStore.toggleTheme()
}
</script>

<style scoped>
/* Отключаем анимацию при переключении */
ion-item {
  --transition: none;
}
</style>
