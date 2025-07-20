<template>
  <ion-checkbox
    ref="checkboxRef"
    :value="modelValue"
    :checked="modelValue"
    label-placement="end"
    :disabled="disabled"
    @ion-change="$emit('update:model-value', $event.target.checked)"
  >
    <slot/>
  </ion-checkbox>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { IonCheckbox } from '@ionic/vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  disabled?: boolean
}>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:model-value': [val: any]
}>()
const checkboxRef = useTemplateRef('checkboxRef')
</script>

<style scoped lang="scss">

</style>
