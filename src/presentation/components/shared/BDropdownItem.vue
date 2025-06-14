<template>
  <ion-item
    button
    :detail="false"
    @click="$emit('click')"
  >
    <slot />
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem } from '@ionic/vue'

defineProps<{
  label?: string
}>()

defineEmits<{
  (event: 'click'): void
}>()
</script>
