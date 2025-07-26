<template>
  <page-default header-back>
    <div>
      <div class="mb-3 text-center">
        <label class="form-label mb-2">Title (required)</label>
        <b-input
          v-model="category.name"
          placeholder="Combo name"
        />
      </div>

      <div class="mb-3">
        <b-card>
          <template v-slot:header>
            <div class="text-center">Combinations</div>
          </template>
          <template v-slot>
            <list-group
              v-if="combos.length"
              :items="combos"
              option-label="title"
              option-id="id"
              item-link
              no-border
              :primary-callback="openCombo"
            >
              <template v-slot:actions="{ item }">
                <b-dropdown-item @click="openCombo(item)">Edit</b-dropdown-item>
              </template>
            </list-group>
            <div
              v-else
              class="p-2 text-center"
            >Empty</div>
          </template>
          <template v-slot:footer>
            <div class="d-flex flex-column">
              <b-button
                color="medium"
                size="default"
                @click="createCombo"
              >New Combo</b-button>
            </div>
          </template>
        </b-card>

      </div>

      <div class="d-flex flex-column mt-3 gap-2">
        <b-button
          color="primary"
          :disabled="category.name?.trim().length === 0"
          @click="saveCombo"
        >{{ isNew ? 'Create' : 'Save' }}</b-button>
      </div>
    </div>
  </page-default>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUpdate, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import BInput from '@/presentation/components/shared/BInput.vue'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import type { Combination } from '@/domain/entities/Combination.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const isNew = ref(!route.params.id)
const category = ref<ComboCategory>({
  id: (route.params.id as string) || '',
  name: ''
})

const combos = computed<Combination[]>(() => categoryStore.getCombosByCategoryId(route.params.id as string))

const loadCategory = async (id: string) => {
  const res = await categoryStore.getById(id)
  if (res) {
    category.value = res
  }
}

const openCombo = async (combo: Combination) => {
  await router.push(`/combos/combos/${combo.id}`)
}

const createCombo = async () => {
  await router.push({
    name: 'ComboNew',
    query: {
      categoryIds: [category.value.id]
    }
  })
}

const saveCombo = async () => {
  if (isNew.value) {
    await categoryStore.create(category.value)
  } else {
    await categoryStore.update(category.value)
  }
  router.back()
}

onBeforeMount(async () => {
  if (category.value?.id) {
    await loadCategory(category.value?.id)
  }
})

onBeforeUpdate(async () => {
  if (category.value?.id) {
    await loadCategory(category.value?.id)
  }
})
</script>
