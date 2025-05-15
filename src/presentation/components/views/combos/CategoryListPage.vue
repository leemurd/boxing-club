<template>
  <div>
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <b-button
        color="dark"
        @click="openAddCategoryModal"
      >
        Add new category
      </b-button>

      <b-button
        color="link"
        @click="$router.push({name: 'ComboList'})"
      >Back to combos</b-button>
    </div>

    <list-group
      :items="categoryStore.list"
      item-val="name"
      :primary-callback="openEditCategoryModal"
      :secondary-callback="removeCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import { Category } from '@/domain/entities/Category.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'

const categoryStore = useCategoryStore()
const modal = useModalService()

onMounted(() => {
  categoryStore.load()
})


const openEditCategoryModal = (category: Category) => {
  modal.openModalByKey(ModalKey.BASE_RENAME, {
    title: category.name,
    onSave: (name: string) => {
      categoryStore.rename({
        ...category,
        name: name
      })
    }
  })
}

const openAddCategoryModal = () => {
  modal.openModalByKey(ModalKey.BASE_RENAME, {
    title: '',
    onSave: (name: string) => {
      categoryStore.add(name)
    }
  })
}

const removeCategory = (id: string) => {
  categoryStore.remove(id)
}
</script>
