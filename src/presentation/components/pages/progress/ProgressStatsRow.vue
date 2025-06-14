<template>
  <!-- Ежедневная нагрузка -->
  <ion-card>
    <ion-card-header v-if="label?.length">
      <ion-card-title class="mb-2 ion-text-center">{{ label }}</ion-card-title>
    </ion-card-header>

    <ion-card-content class="ion-text-center">
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
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import ProgressLine from '@/presentation/components/shared/ProgressLine.vue'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import { IonCardContent, IonCardHeader, IonCardTitle, IonCard } from '@ionic/vue'

defineProps<{
  items: ProgressEntity<string>[],
  label: string
}>()
</script>

<style scoped lang="scss">

</style>
