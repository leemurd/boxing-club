<template>
  <ion-input
    ref="inputRef"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :label="label"
    :label-placement="labelPlacement"
    @ion-input="onIonInput"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonInput } from '@ionic/vue'

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
  placeholder: '',
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

// onMounted(() => {
//   if (props.autofocus) {
//     inputRef.value?.setFocus()
//   }
// })
</script>
