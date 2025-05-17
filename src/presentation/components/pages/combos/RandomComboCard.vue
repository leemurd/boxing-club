<template>
  <div class="d-flex flex-column gap-2">
    <div class="input-group input-group-sm">
      <span
        id="inputGroup-sizing-sm"
        class="input-group-text col justify-content-center"
      >Number of actions:</span>

      <b-input
        :model-value="iterations"
        type="number"
        class="text-center col"
        @update:model-value="$emit('update:iterations', $event)"
      />
    </div>

    <b-button
      color="blue"
      class="w-100"
      outline
      size="small"
      @click="$emit('on-generate')"
    >Generate random combo</b-button>
  </div>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BInput from '@/presentation/components/shared/BInput.vue'

withDefaults(defineProps<{
  iterations?: number,
}>(), {
  iterations: 5
})

defineEmits<{
  (e: 'on-generate'): void,
  (e: 'update:iterations', value: number): void
}>()
</script>

<style scoped lang="scss">

</style>
