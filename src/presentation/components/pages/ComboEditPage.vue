<!-- src/presentation/pages/ComboEditPage.vue -->
<template>
  <div>
    <div class="mb-3">
      <label class="form-label">Title</label>
      <input
        v-model="combo.title"
        class="form-control"
        placeholder="Combo name"
      >
    </div>

    <div class="mb-3">
      <label class="form-label">Категории</label>
      <div v-if="combo.categoryIds.length">
        <span
          v-for="id in combo.categoryIds"
          :key="id"
          class="badge bg-secondary me-1"
        >
          {{ getCategoryName(id) }}
        </span>
      </div>
      <button
        type="button"
        class="btn btn-outline-primary mt-2"
        @click="openCategoryModal"
      >
        Категории
      </button>
    </div>

    <combination-builder-view
      v-model="combo.punches"
      :is-new="isNew"
    />

    <b-button
      color="green"
      class="mt-3"
      :disabled="combo.title?.trim().length === 0"
      @click="saveCombo"
    >{{ isNew ? 'Create' : 'Save' }}</b-button>

    <button
      class="btn btn-secondary mt-3 ms-2"
      @click="$router.back()"
    >Cancel</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useComboStore } from '@/presentation/stores/comboStore'
import { type Combination } from '@/domain/entities/Combination'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore'
import { useModalService } from '@/presentation/composition/useModalService'
import { ModalKey } from '@/presentation/modals/modalKeys'

const route = useRoute()
const router = useRouter()
const modal = useModalService()
const categoryStore = useCategoryStore()
const comboStore = useComboStore()

const isNew = ref(!route.params.id)
const combo = ref<Combination>({
  id: (route.params.id as string) || '',
  title: '',
  punches: [],
  categoryIds: []
})

function getCategoryName(id: string) {
  const cat = categoryStore.list.find((c) => c.id === id)
  return cat ? cat.name : ''
}

function openCategoryModal() {
  modal.openModalByKey(ModalKey.CATEGORY_SELECTOR, {
    selected: combo.value.categoryIds,
    onSave: (ids: string[]) => {
      combo.value.categoryIds = ids
    }
  })
}

onBeforeMount(async () => {
  await categoryStore.load()
})

const loadCombo = async () => {
  if (!isNew.value) {
    const existing = comboStore.combos.find((c) => c.id === route.params.id)
    if (existing) {
      combo.value = {
        id: existing.id,
        title: existing.title,
        punches: [...existing.punches],
        categoryIds: [...existing.categoryIds]
      }
    }
  }
}

async function saveCombo() {
  await comboStore.save(combo.value)
  await router.push({ name: 'ComboList' })
}

watch(() => comboStore.combos, async (arr) => {
  if (arr.length !== 0) {
    await loadCombo()
  }
}, { immediate: true })
</script>
