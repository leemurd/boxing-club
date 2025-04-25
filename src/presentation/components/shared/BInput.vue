<template>
  <input
    v-model="localValue"
    :type="type"
    class="form-control"
    :placeholder="placeholder"
  >
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  type: 'text' | 'password' | 'email' | 'number',
  placeholder?: string,
  required?: boolean,
}>(), {
  type: 'text'
})

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  if (!value) return
  localValue.value = value
}, { immediate: true })

watch(() => localValue.value, (value) => {
  // if (!value) return
  emit('update:model-value', value)
}, { immediate: true })
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number]{
  -moz-appearance: textfield;
}
</style>
