<!-- src/presentation/components/shared/BDropdown.vue-->
<template>
  <div>
    <b-button
      :id="getName"
      :color="color"
      :size="size"
      fill="clear"
      :class="{ 'action-btn': isActionBtn }"
    >
      <slot
        name="btn-text"
        v-bind="{ modelValueLabel }"
      >
        {{ modelValueLabel }}
      </slot>
      <ion-icon
        v-if="isIconVisible"
        slot="end"
        :icon="isOpen ? chevronUp : chevronDown"
      />

    </b-button>

    <ion-popover
      :trigger="getName"
      trigger-action="click"
      :dismiss-on-select="true"
      @ion-popover-did-present="onOpen"
      @ion-popover-did-dismiss="onClose"
    >
      <ion-content>
        <slot name="menu"/>
      </ion-content>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPopover, IonContent, IonIcon } from '@ionic/vue'
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'
import type { ButtonColor } from '@/presentation/components/shared/types'
import type { ButtonSize } from '@/presentation/components/shared/types'
import type { DropdownItem } from '@/presentation/constants/combo/data.ts'
import { exclusiveName } from '@/presentation/utils/exclusiveName.ts'
import BButton from '@/presentation/components/shared/BButton.vue'

// Props
const props = withDefaults(defineProps<{
  items?: DropdownItem[]
  modelValue?: any
  color?: ButtonColor
  size?: ButtonSize
  isActionBtn?: boolean
  isIconVisible?: boolean
}>(), {
  items: () => [],
  color: 'primary',
  size: 'default',
  isActionBtn: false,
  isIconVisible: true
})

// Emit
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

// Dropdown state
const isOpen = ref(false)

// Icon refs
const chevronDown = chevronDownOutline
const chevronUp = chevronUpOutline

// Label for the button
const modelValueLabel = computed(() => {
  const found = props.items?.find((i) => i.value === props.modelValue)
  return found?.label ?? ''
})

// Methods
const getName = exclusiveName()

function onOpen() {
  isOpen.value = true
}

function onClose() {
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
ion-icon {
  color: var(--ion-text-color);
}

.action-btn {
  --padding-end: 0.5rem;
  --padding-start: 0.5rem;
  color: var(--ion-text-color);
}

/* Стили активного пункта */
ion-item.active {
  --background: var(--ion-color-primary-tint);
}
</style>
