<template>
  <select
    :model-value="modelValue"
    class="form-select"
    :disabled="disabled"
    @input="$emit('update:model-value', $event.target?.value)"
  >
    <option
      v-for="(item, key) in items"
      :key="key"
      :value="item[itemId] || item"
    >{{ item[itemVal] || item }}</option>
  </select>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean,
  modelValue: any,
  disabled?: boolean,
  items: any[],
  itemId?: string,
  itemVal?: string
}>(), {
  itemId: 'id',
  itemVal: 'name'
})

defineEmits<{
  'update:model-value': [val: any]
}>()

</script>

<style scoped lang="scss">

</style>
