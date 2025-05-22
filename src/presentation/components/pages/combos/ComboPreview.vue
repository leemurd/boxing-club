<template>
  <b-card>
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div class="card-title mb-0">
          Preview
        </div>

        <span
          v-if="comboActions.length === 0"
          class="text-muted small ms-auto"
        >Empty</span>

        <div v-else>
          <b-button
            color="red"
            outline
            size="small"
            @click="$emit('clear')"
          >Clear</b-button>

          <b-button
            color="red"
            outline
            size="small"
            class="ms-2"
            @click="$emit('clear-last')"
          >Delete last one</b-button>
        </div>
      </div>
    </template>
    <template
      v-if="comboActions.length"
      #default
    >
      <div class="d-flex justify-content-center flex-wrap gap-1">
        <span
          v-for="(item, index) in comboActions"
          :key="index"
          class="badge text-bg-primary"
        >
          {{ item.name }}
        </span>
      </div>
    </template>
  </b-card>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

defineProps<{
  comboActions: BoxingAction[],
}>()

defineEmits<{
  (e: 'clear'): void,
  (e: 'clear-last'): void
}>()
</script>

<style scoped lang="scss">

</style>
