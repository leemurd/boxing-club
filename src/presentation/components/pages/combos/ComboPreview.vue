<template>
  <b-card>
    <template v-slot:header>
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
            color="danger"
            fill="outline"
            size="small"
            @click="$emit('clear')"
          >Clear</b-button>

          <b-button
            color="danger"
            fill="outline"
            size="small"
            class="ms-2"
            @click="$emit('clear-last')"
          >Delete last one</b-button>
        </div>
      </div>
    </template>
    <template
      v-if="comboActions.length"
      v-slot
    >
      <div class="d-flex justify-content-center flex-wrap gap-1">
        <b-badge
          v-for="(item, index) in comboActions"
          :key="index"
          color="primary"
        >
          {{ item.name }}
        </b-badge>
      </div>
    </template>
  </b-card>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'
import BBadge from '@/presentation/components/shared/BBadge.vue'

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
