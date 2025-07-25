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
          label="Combo name"
        />
      </div>

      <combo-categories-card
        :category-ids="combo.categoryIds"
        @on-edit="openComboSelector"
      />

      <div class="d-flex flex-column mt-3 gap-2">
        <b-button
          color="primary"
          :disabled="combo.title?.trim().length === 0 || combo.punches.length === 0"
          @click="saveCombo"
        >{{ isNew ? 'Create' : 'Save' }}</b-button>
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
import BInput from '@/presentation/components/shared/BInput.vue'
import ComboCategoriesCard from '@/presentation/components/pages/combos/ComboCategoriesCard.vue'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction.ts'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import { modalController } from '@ionic/vue'
import CategorySelectorModal from '@/presentation/components/modals/CategorySelectorModal.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const comboStore = useComboStore()

const isNew = ref(!route.params.id)
const combo = ref<Combination>({
  id: (route.params.id as string) || '',
  title: '',
  punches: [],
  categoryIds: (route.query?.categoryIds as string[]) || []
})

const openComboSelector = async () => {
  const modal = await modalController.create({
    component: CategorySelectorModal,
    componentProps: {
      selected: combo.value.categoryIds ?? null
    }
  })

  await modal.present()

  const { data, role } = await modal.onWillDismiss()

  if (role === 'confirm') {
    combo.value.categoryIds = data
  }
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
  if (isNew.value) {
    await comboStore.save(combo.value)
  } else {
    await comboStore.update(combo.value)
  }
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
