<template>
  <div class="card empty-state">
    <div class="card-body empty-state-body">
      <h5 class="card-title">
        <slot name="title">{{ title }}</slot>
      </h5>
      <slot name="description">
        <p class="card-text">{{ description }}</p>
      </slot>

      <slot name="button"/>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  description: string,
}>()
</script>

<style scoped lang="scss">
.empty-state {
  &-body {
    padding: 24px 16px;
  }
}
</style>
