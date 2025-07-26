<template>
  <page-default header-back>
    <div>
      <list-group
        :items="categoryStore.list"
        item-val="name"
        :primary-callback="openCategory"
        item-link
      >
        <template v-slot:icon>
          <i class="bi bi-folder2-open"/>
        </template>
        <template v-slot:actions="{ item }">
          <b-dropdown-item @click="openCategory(item)">Edit</b-dropdown-item>
          <b-dropdown-item @click="onRemove(item.id)">Remove</b-dropdown-item>
        </template>
      </list-group>
    </div>

    <template v-slot:footer>
      <b-button-block
        @click="openAddCategory"
      >
        New category
      </b-button-block>
    </template>
  </page-default>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import { type ComboCategory } from '@/domain/entities/ComboCategory.ts'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import { useDeleteAlerts } from '@/presentation/composition/useAlerts.ts'

const categoryStore = useCategoryStore()
const router = useProjectRouter()

onMounted(() => {
  categoryStore.load()
})

const openCategory = (cat: ComboCategory) => {
  router.push(`/categories/${cat.id}`)
}

const openAddCategory = () => {
  router.push(`/categories/new`)
}

const onRemove = (id: string) => {
  useDeleteAlerts(id, categoryStore.remove)
}
</script>
