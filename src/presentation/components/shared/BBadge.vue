<!-- src/presentation/components/shared/BBadge.vue -->
<template>
  <ion-badge
    :color="color"
    :disabled="disabled"
    :outline="outline"
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
    outline?: boolean
    disabled?: boolean
  }>(),
  {
    color: 'medium'
  }
)
</script>
