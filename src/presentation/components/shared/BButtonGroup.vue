<template>
<!--    class="btn-group"-->
  <div
    v-if="localValue"
    :class="[
      `btn-group${vertical ? '-vertical' : ' btn-group-horizontal'}`,
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
$border-color-light: $gray-300;
.btn-group {
  // light
  .btn-light {
    border: 1px solid $border-color-light;
    background-color: rgb(227 229 230);
    &:hover {
      border-color: $border-color;
      background-color: rgb(227 229 230);
    }
  }
  .btn-check:checked + .btn.btn-light {
    position: relative;
    z-index: 2;
    border-color: $border-color-light;
    background-color: $light;
  }
  // dark
  .btn-dark {
    border: 1px solid $border-color-dark;
    &:hover {
      border-color: $border-color-dark;
    }
  }
  .btn-check:checked + .btn-dark {
    position: relative;
    z-index: 2;
    border-color: transparent;
  }
}
//
.btn-group-vertical {
  // light
  .btn-light {
    border-left: 1px solid $border-color-light!important;
    border-right: 1px solid $border-color-light!important;
    background-color: rgb(227 229 230);
    &:first-of-type {
      border-top: 1px solid $border-color;
    }
    &:last-of-type {
      border-bottom: 1px solid $border-color;
    }
    &:hover {
      background-color: rgb(227 229 230);
    }
  }
  .btn-check:checked + .btn.btn-light {
    position: relative;
    z-index: 2;
    background-color: $light;
    border-color: $border-color-light;
  }
  // dark
  .btn-dark {
    border-left: 1px solid $border-color-dark!important;
    border-right: 1px solid $border-color-dark!important;
    &:first-of-type {
      border-top: 1px solid $border-color-dark;
    }
    &:last-of-type {
      border-bottom: 1px solid $border-color-dark;
    }
  }
  .btn-check:checked + .btn-dark {
    position: relative;
    z-index: 2;
    border-color: transparent!important;
  }
}

</style>
