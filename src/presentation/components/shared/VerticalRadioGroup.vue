<!-- src/presentation/components/shared/VerticalRadioGroup.vue -->
<template>
  <ion-list>
    <ion-list-header v-if="label || $slots['label']">
      <ion-label
        class="text-center"
        position="stacked"
      >
        <h2>
          <slot name="label">{{ label }}</slot>
        </h2>
      </ion-label>
    </ion-list-header>
    <ion-radio-group v-model="internalValue">
      <ion-list lines="none">
        <ion-item
          v-for="option in items"
          :key="getOptionValue(option)"
          button
          :detail="false"
          @click="internalValue = getOptionValue(option)"
        >
          <ion-radio
            slot="start"
            :value="getOptionValue(option)"
          />
          <ion-label>
            <slot :item="option">{{ getOptionLabel(option) }}</slot>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-radio-group>
  </ion-list>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  IonRadioGroup,
  IonList,
  IonListHeader,
  IonItem,
  IonRadio,
  IonLabel
} from '@ionic/vue'

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
// timeout
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
