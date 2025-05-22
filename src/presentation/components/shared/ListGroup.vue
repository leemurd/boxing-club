<template>
  <ul class="list-group list-group-flush list-group-numbered">
    <li
      v-for="item in items"
      :key="item[itemId]"
      class="list-group-item d-flex align-items-center"
      :class="{'cursor-pointer list-group-item-action': itemLink}"
      @click="primaryAction(item)"
    >
      {{ item[itemVal] }}

      <div class="ms-auto">
        <b-button
          v-if="primaryAction"
          size="small"
          color="blue"
          class="me-2"
          @click="primaryAction(item)"
        >Edit</b-button>

        <b-button
          v-if="secondaryCallback"
          color="red"
          size="small"
          @click.stop.prevent="secondaryCallback(item[itemId])"
        >
          <i class="bi bi-x-lg"/>
        </b-button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'

const props = withDefaults(defineProps<{
  items: any[],
  itemId?: string,
  itemVal?: string,
  itemLink?: boolean,
  primaryCallback?: (val?: any) => void,
  secondaryCallback?: (val?: any) => void,
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
