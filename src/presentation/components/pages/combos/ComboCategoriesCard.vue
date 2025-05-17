<template>
  <b-card class="mb-3">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div class="card-title mb-0">Categories</div>
        <b-button
          color="primary"
          outline
          class="ms-2"
          size="small"
          @click="$emit('on-edit')"
        >Edit</b-button>
      </div>
    </template>

    <template
      v-if="categoryIds.length"
      #default
    >
      <div class="d-flex align-items-center justify-content-center">
        <div v-if="categoryIds.length">
          <span
            v-for="id in categoryIds"
            :key="id"
            class="badge bg-secondary me-1"
          >
            {{ getCategoryName(id) }}
          </span>
        </div>
        <template v-else>
          <span class="small">Empty</span>
        </template>
      </div>
    </template>
  </b-card>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'

defineProps<{
  categoryIds: string[],
}>()

defineEmits<{
  (e: 'on-edit'): void
}>()

const categoryStore = useCategoryStore()

function getCategoryName(id: string) {
  const cat = categoryStore.list.find((c) => c.id === id)
  return cat ? cat.name : ''
}
</script>
