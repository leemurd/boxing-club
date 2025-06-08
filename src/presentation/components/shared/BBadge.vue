<template>
  <span
    class="badge me-1"
    :class="[`bg-${color}`, {
      'rounded-pill': rounded,
    }]"
  >
    <slot/>
  </span>
</template>

<script setup lang="ts">
import type { ButtonColor } from '@/presentation/components/shared/types.ts'

withDefaults(defineProps<{
  color?: ButtonColor,
  rounded?: boolean,
}>(), {
  color: 'secondary'
})
</script>

<style lang="scss" scoped>
.badge {
  font-size: inherit;
}
</style>
