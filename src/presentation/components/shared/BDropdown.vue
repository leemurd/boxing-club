<template>
  <div
    ref="root"
    class="dropdown dropdown-center"
  >
    <b-button
      :color="color"
      :size="size"
      :outline="outline"
      class="dropdown-toggle"
      data-bs-toggle="dropdown"
      v-bind="attrs"
    >
      <slot
        name="btn-text"
        v-bind="{ modelValueLabel }"
      >
        {{ modelValueLabel }}
      </slot>
    </b-button>
    <!--    <button-->
    <!--      ref="toggleEl"-->
    <!--      class="btn btn-secondary dropdown-toggle"-->
    <!--      type="button"-->
    <!--      aria-expanded="false"-->
    <!--      data-bs-toggle="dropdown"-->
    <!--    >-->
    <!--      <slot name="btn-text">-->
    <!--        {{ modelValueLabel }}-->
    <!--      </slot>-->
    <!--    </button>-->

    <ul class="dropdown-menu">
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
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, useAttrs } from 'vue'
import Dropdown from 'bootstrap/js/dist/dropdown'
import type { ButtonColor, ButtonSize } from '@/presentation/components/shared/types.ts'
import BButton from '@/presentation/components/shared/BButton.vue'

export interface DropdownItem {
  label: string
  value: any
  // disabled?: boolean
}

const props = defineProps<{
  items: DropdownItem[]
  /** Текущее выбранное value */
  modelValue?: any,
  color?: ButtonColor
  size?: ButtonSize,
  outline?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
defineOptions({
  inheritAttrs: false
})

const root = ref<HTMLElement>()
const toggleEl = ref<HTMLElement>()
const attrs = useAttrs()
let bsDropdown: ReturnType<typeof Dropdown> | null = null

/** Удобство: если передали modelValue, но для toggle нет слота, покажем метку пункта */
const modelValueLabel = computed(() => {
  const found = props.items.find((i) => i.value === props.modelValue)
  return found?.label ?? ''
})

onMounted(() => {
  if (toggleEl.value) {
    bsDropdown = new Dropdown(toggleEl.value)
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
}
</style>
