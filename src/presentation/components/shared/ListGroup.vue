<template>
  <ul
    class="list-group"
    :class="{
      'list-group-numbered': numbered,
      'list-group-flush': noBorder,
    }"
  >
    <li
      v-for="item in items"
      :key="item[itemId]"
      class="list-group-item d-flex align-items-center"
      :class="{
        'cursor-pointer list-group-item-action': itemLink
        // 'cursor-pointer': itemLink
      }"
      @click="primaryAction(item)"
    >
      <slot name="icon"/>
      <span
        :class="{'ms-2': $slots['icon']}"
      >{{ item[itemVal] }}</span>

      <div
        v-if="$slots['actions']"
        class="ms-auto"
      >
        <b-dropdown
          is-action-btn
          outline
          color="link"
          size="small"
          @click.prevent.stop
        >
          <template #btn-text>
            <i class="bi bi-three-dots-vertical"/>
          </template>
          <template #menu>
            <slot
              name="actions"
              v-bind="{ item }"
            />
          </template>
        </b-dropdown>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import BDropdown from '@/presentation/components/shared/BDropdown.vue'

const props = withDefaults(defineProps<{
  items: any[],
  itemId?: string,
  itemVal?: string,
  itemLink?: boolean,
  numbered?: boolean,
  noBorder?: boolean,
  primaryCallback?: (val?: any) => void,
  // secondaryCallback?: (val?: any) => void,
}>(), {
  itemId: 'id',
  itemVal: 'name'
})

const primaryAction = (item: any) => {
  if (props.itemLink && props.primaryCallback) {
    return props.primaryCallback(item)
  } else {
    return false
  }
}
</script>

<style scoped lang="scss">
.list-group-numbered .list-group-item:before {
  margin-right: 8px;
}
</style>
