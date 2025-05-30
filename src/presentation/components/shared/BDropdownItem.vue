<template>
  <li>
    <button
      class="dropdown-item"
      type="button"
      @click="$emit('click')"
    >
      <slot>
        {{ label }}
      </slot>
    </button>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()

defineEmits<{
  (event: 'click'): void
}>()
</script>

<style scoped lang="scss">

</style>
