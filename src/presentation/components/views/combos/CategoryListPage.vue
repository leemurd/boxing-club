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
      :primary-callback="openCategory"
      :secondary-callback="removeCategory"
      item-link
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
import { useRouter } from 'vue-router'

const categoryStore = useCategoryStore()
const modal = useModalService()
const router = useRouter()

onMounted(() => {
  categoryStore.load()
})

const openCategory = (cat: Category) => {
  router.push(`/combos/categories/${cat.id}`)
}


const openEditCategoryModal = (category: Category) => {
  modal.openModalByKey(ModalKey.BASE_RENAME, {
    title: category.name,
    onSave: (name: string) => {
      categoryStore.update({
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
  modal.openModalByKey(ModalKey.CONFIRMATION, {
    title: 'Confirm delete',
    message: 'Are you sure?',
    onApply: () => categoryStore.remove(id)
  })

}
</script>
