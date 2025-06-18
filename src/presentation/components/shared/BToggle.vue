<template>
  <ion-toggle
    label-placement="start"
    :checked="modelValue"
    @ion-change="$emit('update:model-value', $event.detail.checked)"
  >
    <slot/>
  </ion-toggle>
</template>

<script setup lang="ts">
import { IonToggle } from '@ionic/vue'

defineProps<{
  modelValue: any,
}>()

defineEmits<{
  'update:model-value': [val: any]
}>()
</script>
