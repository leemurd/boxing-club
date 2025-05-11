<template>
  <div>
    <h2>Категории</h2>
    <div class="d-flex justify-content-between mb-3">
      <button
        class="btn btn-primary"
        @click="$router.back()"
      >Назад</button>

      <button
        class="btn btn-primary"
        @click="openAddCategoryModal"
      >Добавить</button>
    </div>

    <ul class="list-group">
      <li
        v-for="cat in categoryStore.list"
        :key="cat.id"
        class="list-group-item d-flex align-items-center justify-content-between"
      >
        {{ cat.name }}

        <div class="">
          <button
            class="btn btn-secondary btn-sm me-2"
            @click="openEditCategoryModal(cat)"
          >
            <i class="bi bi-pencil-fill"/>
          </button>

          <button
            class="btn btn-danger btn-sm"
            @click="removeCategory(cat.id)"
          >
            <i class="bi bi-x-lg"/>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import { Category } from '@/domain/entities/Category'

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
