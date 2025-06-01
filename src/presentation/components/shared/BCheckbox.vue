<template>
  <div class="form-check">
    <input
      :id="name"
      ref="checkboxRef"
      v-model="localValue"
      class="form-check-input"
      type="checkbox"
      :disabled="disabled"
      @change="$emit('update:model-value', localValue)"
    >
    <label
      class="form-check-label"
      :for="name"
    >
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { exclusiveName } from '@/presentation/utils/exclusiveName.ts'

const props = withDefaults(defineProps<{
  modelValue: any,
  disabled?: boolean
}>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:model-value': [val: any]
}>()

const localValue = ref()
const checkboxRef = useTemplateRef('checkboxRef')
const name: string = exclusiveName()

watch(() => props.modelValue, (val) => {
  localValue.value = val
})
</script>

<style scoped lang="scss">

</style>
