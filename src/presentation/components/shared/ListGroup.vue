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
        // 'cursor-pointer list-group-item-action': itemLink
        'cursor-pointer': itemLink
      }"
      @click="primaryAction(item)"
    >
      <slot name="icon"/>
      <span
        :class="{'ms-2': $slots['icon']}"
      >{{ item[itemVal] }}</span>

      <div class="ms-auto">
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
            >
              <!--              <li><button-->
              <!--                class="dropdown-item"-->
              <!--                type="button"-->
              <!--              >Action</button></li>-->
              <!--              <li><button-->
              <!--                class="dropdown-item"-->
              <!--                type="button"-->
              <!--              >Another action</button></li>-->
              <!--                <b-button-->
              <!--                  v-if="primaryAction"-->
              <!--                  size="small"-->
              <!--                  color="blue"-->
              <!--                  class="me-2"-->
              <!--                  @click="primaryAction(item)"-->
              <!--                >Edit</b-button>-->

              <!--                <b-button-->
              <!--                  v-if="secondaryCallback"-->
              <!--                  color="red"-->
              <!--                  size="small"-->
              <!--                  @click.stop.prevent="secondaryCallback(item[itemId])"-->
              <!--                >-->
              <!--                  <i class="bi bi-x-lg"/>-->
              <!--                </b-button>-->
            </slot>
          </template>
        </b-dropdown>

        <!--        <b-button-->
        <!--          v-if="primaryAction"-->
        <!--          size="small"-->
        <!--          color="blue"-->
        <!--          class="me-2"-->
        <!--          @click="primaryAction(item)"-->
        <!--        >Edit</b-button>-->

        <!--        <b-button-->
        <!--          v-if="secondaryCallback"-->
        <!--          color="red"-->
        <!--          size="small"-->
        <!--          @click.stop.prevent="secondaryCallback(item[itemId])"-->
        <!--        >-->
        <!--          <i class="bi bi-x-lg"/>-->
        <!--        </b-button>-->
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
