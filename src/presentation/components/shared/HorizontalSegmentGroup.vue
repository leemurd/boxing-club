<!-- src/presentation/components/shared/HorizontalSegmentGroup.vue -->
<template>
  <ion-list lines="none">
    <ion-list-header v-if="label || $slots['label']">
      <ion-label
        position="stacked"
        class="text-center"
      >
        <h2>
          <slot name="label">{{ label }}</slot>
        </h2>
      </ion-label>
    </ion-list-header>
    <ion-segment v-model="internalValue">
      <ion-segment-button
        v-for="option in items"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        <slot :item="option">{{ getOptionLabel(option) }}</slot>
      </ion-segment-button>
    </ion-segment>
  </ion-list>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonLabel, IonSegment, IonSegmentButton, IonList, IonListHeader } from '@ionic/vue'

// Props definition
type Option = any
const props = withDefaults(
  defineProps<{
    modelValue: any
    items: Option[]
    optionValue?: string
    optionLabel?: string
    label?: string
  }>(),
  {
    optionValue: undefined,
    optionLabel: undefined
  }
)

// Emit model update
type Emits = (e: 'update:modelValue', value: any) => void
const emit = defineEmits<Emits>()

// Internal value syncing with v-model
const internalValue = ref(props.modelValue)
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  }
)
watch(
  internalValue,
  (val) => {
    emit('update:modelValue', val)
  }
)

// Helpers
function getOptionValue(item: Option) {
  return props.optionValue ? item[props.optionValue] : item
}
function getOptionLabel(item: Option) {
  return props.optionLabel ? item[props.optionLabel] : item
}
</script>

<style lang="scss" scoped>
ion-list {
  background-color: transparent;
}
</style>
