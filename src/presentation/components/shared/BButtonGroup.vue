<template>
  <div
    v-if="localValue"
    :class="[
      `btn-group${vertical ? '-vertical' : ''}`,
      {
        [`btn-group-${BtnSizeMap[size]}`]: size !== 'medium',
      }
    ]"
    role="group"
  >
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <input
        :id="`${exclusiveName}_${getOptionValue(item)}`"
        v-model="localValue"
        type="radio"
        class="btn-check"
        :name="exclusiveName"
        :value="getOptionValue(item)"
      >
      <b-button
        :color="color"
        :outline="outline"
        tag="label"
        :for="`${exclusiveName}_${getOptionValue(item)}`"
        @click="selectItem(item)"
      >
        <slot v-bind="{ item }">
          {{ item }}
        </slot>
      </b-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import {
  BtnSizeMap,
  type ButtonColor,
  type ButtonSize
} from '@/presentation/components/shared/types.ts'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  items: any[],
  color?: ButtonColor,
  size?: ButtonSize,
  outline?: boolean,
  vertical?: boolean,
  optionValue?: any,
}>(), {
  size: 'medium',
  color: 'dark'
})

const emit = defineEmits<{
  'update:model-value': [val: boolean]
}>()

const exclusiveName = (new Date().getMilliseconds() * Math.random()).toString().slice(0, 9)
const localValue = ref()

const getOptionValue = (item: any) => props.optionValue ? item[props.optionValue] : item

const selectItem = (item: any) => {
  emit('update:model-value', getOptionValue(item))
}

onMounted(() => {
  localValue.value = props.modelValue
})

watch(() => props.modelValue, (value) => {
  if (!value) return
  localValue.value = value
}, { immediate: true })
</script>

<style scoped lang="scss">

</style>
