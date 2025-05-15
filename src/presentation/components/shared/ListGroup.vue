<template>
  <ul class="list-group">
    <li
      v-for="item in items"
      :key="item[itemId]"
      class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
    >
      {{ item[itemVal] }}

      <div class="">
        <b-button
          size="small"
          color="blue"
          class="me-2"
          @click="primaryCallback(item)"
        >Edit</b-button>

        <b-button
          color="red"
          size="small"
          @click="secondaryCallback(item[itemId])"
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
  primaryCallback: (val: any) => void,
  secondaryCallback: (val: any) => void,
}>(), {
  itemId: 'id',
  itemVal: 'name'
})
</script>

<style scoped lang="scss">

</style>
