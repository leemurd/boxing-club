<!-- IonicBadge.vue -->
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

// Props definition
const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    rounded?: boolean
  }>(),
  {
    color: 'secondary',
    rounded: false
  }
)
</script>

<style scoped>
/* Optional custom styling */
.badge-pill {
  border-radius: 10px;
}
</style>
