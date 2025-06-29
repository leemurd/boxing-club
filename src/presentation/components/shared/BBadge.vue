<!-- src/presentation/components/shared/BBadge.vue -->
<template>
  <ion-badge
    :color="color"
    :class="{ 'badge-pill': rounded }"
  >
    <slot />
  </ion-badge>
</template>

<script setup lang="ts">
import { IonBadge } from '@ionic/vue'
import type { ButtonColor } from '@/presentation/components/shared/types'

withDefaults(
  defineProps<{
    color?: ButtonColor
    rounded?: boolean
  }>(),
  {
    color: 'medium',
    rounded: false
  }
)
</script>

<style scoped lang="scss">
.badge-pill {
  border-radius: 10px;
}
</style>
