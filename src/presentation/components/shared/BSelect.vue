<template>
  <ion-select
    v-model="internalValue"
    :interface="interface"
    :disabled="disabled"
  >
    <ion-select-option
      v-for="(item, index) in items"
      :key="index"
      :value="getValue(item)"
    >
      {{ getLabel(item) }}
    </ion-select-option>
  </ion-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonSelect, IonSelectOption } from '@ionic/vue'

type Item = Record<string, any>

const props = withDefaults(
  defineProps<{
    modelValue: any
    disabled?: boolean
    items: any[]
    optionId?: string
    optionLabel?: string,
    interface?: 'action-sheet' | 'popover' | 'alert' | 'modal'
  }>(),
  {
    disabled: false,
    optionId: 'id',
    optionLabel: 'name',
    interface: 'alert'
  }
)

const emit = defineEmits<{
  (e: 'update:model-value', val: any): void
}>()

// Двусторонняя связь
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:model-value', val)
})

// Получить значение опции
function getValue(item: Item) {
  return props.optionId && item[props.optionId] != null
    ? item[props.optionId]
    : item
}

// Получить отображаемый текст опции
function getLabel(item: Item) {
  return props.optionLabel && item[props.optionLabel] ? item[props.optionLabel] : item
}
</script>
