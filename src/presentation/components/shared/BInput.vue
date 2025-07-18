<template>
  <ion-item>
    <ion-input
      ref="inputRef"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :label="label"
      :label-placement="labelPlacement"
      v-bind="{
        ...$attrs,
      }"
      @ion-input="onIonInput"
    />
  </ion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonInput, IonItem } from '@ionic/vue'

defineOptions({
  inheritAttrs: false
})

withDefaults(defineProps<{
  modelValue: string | number
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string,
  label?: string,
  labelPlacement?: 'fixed' | 'stacked' | 'floating' | 'start' | 'end' | undefined
  required?: boolean
  autofocus?: boolean
  disabled?: boolean
}>(), {
  type: 'text',
  placeholder: 'Enter text',
  required: false,
  autofocus: false,
  disabled: false,
  labelPlacement: 'start'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputRef = ref<InstanceType<typeof IonInput> | null>(null)

function onIonInput(event: CustomEvent) {
  emit('update:modelValue', event.detail.value)
}
</script>

<style lang="scss" scoped>
// hide arrows for [type="number"]
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance:textfield; /* Firefox */
}
</style>
