<template>
  <div
    ref="root"
    class="dropdown dropdown-center"
  >
    <b-button
      ref="toggleEl"
      :color="color"
      :size="size"
      :outline="outline"
      v-bind="attrs"
      class="dropdown-toggle"
      :class="{'dropdown-toggle--is-action-btn': isActionBtn}"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      type="button"
    >
      <slot
        name="btn-text"
        v-bind="{ modelValueLabel }"
      >
        {{ modelValueLabel }}
      </slot>
    </b-button>

    <ul class="dropdown-menu">
      <slot name="menu">
        <template v-if="items && items?.length > 0">
          <li
            v-for="(item, i) in items"
            :key="i"
          >
            <button
              class="dropdown-item"
              :class="{ active: isActive(item) }"
              type="button"
              @click.prevent="select(item)"
            >
              <slot
                name="item"
                :item="item"
                :is-active="isActive(item)"
                :select="() => select(item)"
              >
                {{ item.label }}
              </slot>
            </button>
          </li>
        </template>
      </slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  computed,
  useAttrs,
  type Component,
  useTemplateRef
} from 'vue'
import Dropdown from 'bootstrap/js/dist/dropdown'
import type { ButtonColor, ButtonSize } from '@/presentation/components/shared/types.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import { onClickOutside } from '@vueuse/core'

export interface DropdownItem {
  label: string
  value: any
  onClick?: () => void
  // disabled?: boolean
}

const props = defineProps<{
  items?: DropdownItem[]
  /** Текущее выбранное value */
  modelValue?: any,
  color?: ButtonColor
  size?: ButtonSize,
  outline?: boolean,
  isActionBtn?: boolean,
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
defineOptions({
  inheritAttrs: false
})

const root = useTemplateRef<HTMLElement>('root')
const toggleEl = useTemplateRef<Component>('toggleEl')
const attrs = useAttrs()
let bsDropdown: ReturnType<typeof Dropdown> | null = null

/** Удобство: если передали modelValue, но для toggle нет слота, покажем метку пункта */
const modelValueLabel = computed(() => {
  const found = props.items?.find((i) => i.value === props.modelValue)
  return found?.label ?? ''
})

onMounted(() => {
  if (toggleEl.value) {
    bsDropdown = new Dropdown(toggleEl.value.$el)
    console.log(bsDropdown)

    onClickOutside(toggleEl.value?.$el, () => {
      bsDropdown?.hide()
    })
  } else {
    console.warn('Dropdown не смонтирован')
  }
})

onBeforeUnmount(() => {
  bsDropdown?.dispose()
})

function isActive(item: DropdownItem) {
  return props.modelValue === item.value
}

function select(item: DropdownItem) {
  emit('update:model-value', item.value)
  bsDropdown?.hide()
}
</script>

<style lang="scss" scoped>
.dropdown {
  display: inline-block;
  &-toggle {
    &--is-action-btn {
      &:after {
        display: none;
      }
    }
  }
}
</style>
