<template>
  <input
    v-if="loading"
    ref="inputRef"
    :value="'Loading'"
    :type="type"
    class="form-control"
    :class="{
      [size ? `form-control-${size}` : '']: size,
    }"
    :placeholder="placeholder"
    :disabled="disabled"
  >
  <input
    v-else
    ref="inputRef"
    v-model="localValue"
    :type="type"
    class="form-control"
    :class="{
      [size ? `form-control-${size}` : '']: size,
    }"
    :placeholder="placeholder"
    :disabled="disabled"
  >
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  type?: 'text' | 'password' | 'email' | 'number',
  placeholder?: string,
  required?: boolean,
  autofocus?: boolean,
  size?: 'sm' | '' | 'lg',
  disabled?: boolean,
  loading?: boolean,
}>(), {
  type: 'text',
  size: ''
})

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

const inputRef = useTemplateRef('inputRef')
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  // if (!value) return
  localValue.value = value
}, { immediate: true })

watch(() => localValue.value, (value) => {
  emit('update:model-value', value)
}, { immediate: true })

onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
})
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
