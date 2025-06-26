<template>
  <page-default header-back>
    <div>
      <list-group
        :items="categoryStore.list"
        item-val="name"
        :primary-callback="openCategory"
        item-link
      >
        <template #icon>
          <i class="bi bi-folder2-open"/>
        </template>
        <template #actions="{ item }">
          <b-dropdown-item @click="openCategory(item)">Edit</b-dropdown-item>
          <b-dropdown-item @click="removeCategory(item.id)">Remove</b-dropdown-item>
        </template>
      </list-group>
    </div>

    <template v-slot:footer>
      <b-button-block
        @click="openAddCategoryModal"
      >
        New category
      </b-button-block>
    </template>
  </page-default>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'

const categoryStore = useCategoryStore()
const modal = useModalService()
const router = useProjectRouter()

onMounted(() => {
  categoryStore.load()
})

const openCategory = (cat: ComboCategory) => {
  router.push(`/categories/${cat.id}`)
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
