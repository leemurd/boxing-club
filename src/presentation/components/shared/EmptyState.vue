<template>
  <b-card>
    <template #header>
      <slot name="title">{{ title }}</slot>
    </template>
    <template #default>
      <slot name="description">
        {{ description }}
      </slot>
    </template>
    <template #footer>
      <slot name="footer"/>
    </template>
  </b-card>
</template>

<script setup lang="ts">
import BCard from '@/presentation/components/shared/BCard.vue'

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
