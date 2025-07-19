<template>
  <!-- Ежедневная нагрузка -->
  <b-card>
    <template
      v-if="label?.length"
      v-slot:header
    >
      <ion-card-title class="mb-2 ion-text-center">{{ label }}</ion-card-title>
    </template>

    <template v-slot>
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
          <template v-slot:name="{ name }">
            <slot
              name="name"
              v-bind="{ name }"
            >
              {{ name }}:
            </slot>
          </template>
        </progress-line>
      </div>
    </template>
  </b-card>
</template>

<script setup lang="ts">
import ProgressLine from '@/presentation/components/shared/ProgressLine.vue'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import { IonCardTitle } from '@ionic/vue'

defineProps<{
  items: ProgressEntity<string>[],
  label: string
}>()
</script>
