<template>
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
        :id="getExclusiveName(item)"
        v-model="localValue"
        type="radio"
        class="btn-check"
        :name="exclusiveName()"
        :value="getOptionValue(item)"
      >
      <b-button
        :color="color"
        :outline="outline"
        tag="label"
        class="btn-item"
        :class="[item === modelValue ? 'active-item' : '']"
        :for="getExclusiveName(item)"
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
import { exclusiveName } from '@/presentation/utils/exclusiveName.ts'

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
  'update:model-value': [val: any]
}>()

const getExclusiveName = (item: any) => {
  const num = exclusiveName()
  const text = props.optionValue ? (item[props.optionValue] || item?.id) : item

  return `${text}_${num}`
}

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
@import '@/presentation/styles/mixins';

.btn-group {
  // light
  .btn-light {
    border-color: $border-color-light;
    background-color: $light-color-disabled;
    &:hover {
      border-color: $border-color-light;
      background-color: $light-color-disabled;
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
    border-color: $border-color-dark;
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
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-left-color: $border-color-light!important;
    border-right-color: $border-color-light!important;
    background-color: $light-color-disabled;
    &:first-of-type {
      border-top-color: $border-color-light!important;
    }
    &:last-of-type {
      border-bottom-color: $border-color-light!important;
    }
    &:hover {
      background-color: $light-color-disabled;
      border-color: transparent;
    }

    //&.active-item {
    //  background-color: $primary!important;
    //  color: $white;
    //  border-left-color: $primary!important;
    //  border-right-color: $primary!important;
    //}
  }
  .btn-check:checked + .btn.btn-light {
    position: relative;
    z-index: 2;
    background-color: $light;
    border-color: transparent;
    border-left-color: $border-color-light;
    border-right-color: $border-color-light;
  }

  // dark
  .btn-dark {
    border-left-color: $border-color-dark!important;
    border-right-color: $border-color-dark!important;
    &:first-of-type {
      border-top-color: $border-color-dark;
    }
    &:last-of-type {
      border-bottom-color: $border-color-dark;
    }

    //&.active-item {
    //  background-color: $primary!important;
    //  color: $white;
    //  border-left-color: $primary!important;
    //  border-right-color: $primary!important;
    //}
  }
  .btn-check:checked + .btn-dark {
    position: relative;
    z-index: 2;
    border-color: transparent!important;
  }
}

</style>
