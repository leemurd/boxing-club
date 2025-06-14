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
        <!--        class="ion-padding"-->
        <slot name="menu">
<!--          <template v-if="items && items.length">-->
<!--            <ion-list>-->
<!--              <ion-item-->
<!--                v-for="(item, i) in items"-->
<!--                :key="i"-->
<!--                button-->
<!--                :detail="false"-->
<!--                :class="{ active: isActive(item) }"-->
<!--                @click.prevent="select(item)"-->
<!--              >-->
<!--                <slot-->
<!--                  name="item"-->
<!--                  :item="item"-->
<!--                  :is-active="isActive(item)"-->
<!--                  :select="() => select(item)"-->
<!--                >-->
<!--                  {{ item.label }}-->
<!--                </slot>-->
<!--              </ion-item>-->
<!--            </ion-list>-->
<!--          </template>-->
        </slot>
      </ion-content>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonButton, IonPopover, IonContent, IonList, IonItem, IonIcon } from '@ionic/vue'
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'
// import type { ToggleCustomEvent } from '@ionic/vue' // err
import type { ButtonColor } from '@/presentation/components/shared/types'
import type { ButtonSize } from '@/presentation/components/shared/types'
import type { DropdownItem } from '@/presentation/constants/combo/data.ts'
import { exclusiveName } from '@/presentation/utils/exclusiveName.ts'
import BButton from '@/presentation/components/shared/BButton.vue' // err

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

function isActive(item: any) {
  return props.modelValue === item.value
}

function select(item: any) {
  emit('update:model-value', item.value)
}

function onOpen() {
  isOpen.value = true
}

function onClose() {
  isOpen.value = false
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

<style scoped lang="scss">
/* Дополнительный класс для “action”-кнопки */
.action-btn {
  --padding-end: 0.5rem;
  --padding-start: 0.5rem;
}

/* Стили активного пункта */
ion-item.active {
  --background: var(--ion-color-primary-tint);
  color: var(--ion-color-primary-contrast);
}
</style>
