<template>
  <!-- Ежедневная нагрузка -->
  <section>
    <h2
      v-if="label?.length"
      class="h5 mb-2 text-center"
    >{{ label }}</h2>
    <b-card no-border>
      <div
        v-for="(item, index) in items"
        :key="item.name"
        :class="{
          'mb-4': index !== items.length - 1,
          'mb-2': index === items.length - 1,
        }"
      >
        <progress-line
          :name="item.name"
          :reps="item.reps"
          :min="item.minutes"
          :sets="item.sets"
          :loading="false"
        >
          <template #name="{ name }">
            <slot
              name="name"
              v-bind="{ name }"
            >
              {{ name }}:
            </slot>
          </template>
        </progress-line>
      </div>
    </b-card>
  </section>
</template>

<script setup lang="ts">
import ProgressLine from '@/presentation/components/shared/ProgressLine.vue'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import BCard from '@/presentation/components/shared/BCard.vue'

defineProps<{
  items: ProgressEntity<string>[],
  label: string
}>()
</script>

<style scoped lang="scss">

</style>
