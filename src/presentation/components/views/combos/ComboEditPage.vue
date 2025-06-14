<template>
  <page-default header-back>
    <div>
      <combination-builder-view
        v-model="combo.punches"
        :is-new="isNew"
        class="mb-4"
      />

      <div class="mb-3 text-center">
        <label class="form-label mb-2">Title (required)</label>
        <b-input
          v-model="combo.title"
          placeholder="Combo name"
        />
      </div>

      <combo-categories-card
        :category-ids="combo.categoryIds"
        @on-edit="openCategoryModal"
      />

      <div class="d-flex flex-column mt-3 gap-2">
        <b-button
          color="primary"
          :disabled="combo.title?.trim().length === 0 || combo.punches.length === 0"
          @click="saveCombo"
        >{{ isNew ? 'Create' : 'Save' }}</b-button>

        <b-button
          color="secondary"
          @click="$router.back()"
        >Back</b-button>
      </div>
    </div>
  </page-default>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import { type Combination } from '@/domain/entities/Combination.ts'
import CombinationBuilderView from '@/presentation/components/pages/combos/CombinationBuilderView.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import BInput from '@/presentation/components/shared/BInput.vue'
import ComboCategoriesCard from '@/presentation/components/pages/combos/ComboCategoriesCard.vue'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction.ts'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'

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
  categoryIds: (route.query?.categoryIds as string[]) || []
})

function openCategoryModal() {
  modal.openModalByKey(ModalKey.CATEGORY_SELECTOR, {
    selected: combo.value.categoryIds,
    onSave: (ids: string[]) => {
      combo.value.categoryIds = ids
    }
  })
}

onBeforeMount(async () => {
  await comboStore.load()
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
  // await router.push({ name: 'ComboList' })
  await router.back()
}

watch(() => comboStore.combos, async (arr) => {
  if (arr.length !== 0) {
    await loadCombo()
  }
}, { immediate: true })

watch(() => combo.value.punches, async (arr) => {
  if (isNew.value) {
    if (arr.length !== 0) {
      combo.value.title = arr.map((punch) => {
        if (punch.category === BoxingActionCategory.PUNCH) return punch.id
        else return `(${punch.name})`
      }).join('-')
    }
  }
})
</script>
