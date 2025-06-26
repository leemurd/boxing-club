<template>
  <div class="d-flex flex-column">
    <div class="small text-muted mb-1">or generate random combo (beta-version)</div>

    <b-card>
      <div class="d-flex flex-column w-100 gap-1">
        <b-button
          size="default"
          color="medium"
          @click="$emit('on-generate')"
        >
          <span class="small">Generate combo</span>
        </b-button>

        <span class="small">with</span>

        <b-dropdown
          :model-value="iterations"
          :items="comboRandomItems"
          size="default"
          color="medium"
          class="w-100"
          @update:model-value="$emit('update:iterations', $event)"
        >
          <template #btn-text="{ modelValueLabel }">
            <span class="small">{{ modelValueLabel }}</span>
          </template>
        </b-dropdown>
      </div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import { comboRandomItems } from '@/presentation/constants/combo/data.ts'
import BDropdown from '@/presentation/components/shared/BDropdown.vue'

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
