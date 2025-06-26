<!-- src/presentation/components/shared/IonicListWithActions.vue -->
<template>
  <ion-list
    :inset="false"
    lines="full"
    :class="{
      'numbered-list': numbered,
      'no-border': noBorder
    }"
  >
    <ion-item
      v-for="(item, key) in items"
      :key="key"
      button
      :detail="false"
      :class="{ actionable: itemLink }"
      @click="primaryAction(item)"
    >
      <!-- Иконка слота -->
      <slot
        v-if="hasIcon"
        name="icon"
        :item="item"
      />

      <!-- Метка элемента -->
      <ion-label :class="{ 'ms-2': $slots.icon }">
        {{ item[optionLabel] ?? item }}
      </ion-label>

      <!-- Кнопка действий -->
      <div
        v-if="hasActions"
        class="ms-auto"
      >
        <b-dropdown
          color="light"
          size="small"
          outline
          is-action-btn
          :is-icon-visible="false"
          @click.prevent.stop
        >
          <template #btn-text>
            <ion-icon
              slot="icon-only"
              :icon="ellipsisVertical"
            />
          </template>
          <template #menu>
            <slot
              name="actions"
              :item="item"
            />
          </template>
        </b-dropdown>
      </div>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { ellipsisVertical } from 'ionicons/icons'
import BDropdown from '@/presentation/components/shared/BDropdown.vue'

const props = withDefaults(defineProps<{
  items: any[]
  optionLabel?: string
  optionValue?: string
  itemLink?: boolean
  numbered?: boolean
  noBorder?: boolean
  primaryCallback?: (val: any) => void
}>(), {
  optionLabel: 'name',
  optionValue: 'id',
  itemLink: false,
  numbered: false,
  noBorder: false
})

const slots = defineSlots<{
  icon(props: { item: any }): any
  actions(props: { item: any }): any
}>()

const hasIcon = computed<boolean>(() => !!slots.icon)
const hasActions = computed<boolean>(() => !!slots.icon)

// Вызывается при клике по строке
function primaryAction(item: any) {
  if (props.itemLink && props.primaryCallback) {
    props.primaryCallback(item)
  }
}
</script>

<style scoped lang="scss">
.numbered-list ion-item::before {
  content: counter(item) '. ';
  counter-increment: item;
  margin-right: 8px;
}

.actionable {
  cursor: pointer;
}

.ms-2 {
  margin-left: 0.5rem;
}

.no-border {
  --ion-item-border-style: none;
}
</style>
