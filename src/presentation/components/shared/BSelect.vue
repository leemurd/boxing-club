<template>
  <ion-item :disabled="disabled">
    <ion-select
      v-model="internalValue"
      interface="popover"
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
  </ion-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonItem, IonSelect, IonSelectOption } from '@ionic/vue'

type Item = Record<string, any>

const props = withDefaults(
  defineProps<{
    modelValue: any
    disabled?: boolean
    items: any[]
    optionId?: string
    optionValue?: string
  }>(),
  {
    disabled: false,
    optionId: 'id',
    optionValue: 'name'
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
  return props.optionValue && item[props.optionValue] != null
    ? item[props.optionValue]
    : item
}
</script>
