<template>
  <page-default>
    <list-group
      :items="tagStore.list"
      :primary-callback="goEdit"
      item-link
    >
      <template v-slot:icon>
        <i class="bi bi-bookmark"/>
      </template>
      <template v-slot:actions="{ item }">
        <b-dropdown-item @click="goEdit(item)">Edit</b-dropdown-item>
        <b-dropdown-item @click="remove(item.id)">Delete</b-dropdown-item>
      </template>
    </list-group>

    <template v-slot:footer>
      <b-button-block
        @click="createNewTag"
      >
        New tag
      </b-button-block>
    </template>

    <b-alert
      header="Confirm delete"
      :is-open="isModalDeleteOpen"
      :buttons="alertButtons"
    />
  </page-default>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTagStore } from '@/presentation/stores/tagStore'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import type { Tag } from '@/domain/entities/Tag.ts'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'
import type { IAlertButton } from '@/presentation/components/shared/types.ts'
import BAlert from '@/presentation/components/shared/BAlert.vue'

const tagStore = useTagStore()
const router = useProjectRouter()

onMounted(() => {
  tagStore.load()
})

function goEdit(tag: Tag) {
  router.push({
    name: 'TagEdit',
    params: { id: tag.id }
  })
}

const createNewTag = () => {
  router.push({ name: 'TagCreate' })
}

const removingId = ref('')
const isModalDeleteOpen = ref(false)

function remove(id: string) {
  removingId.value = id
  isModalDeleteOpen.value = true
}

const alertButtons: IAlertButton[] = [
  {
    text: 'Cancel',
    role: 'cancel',
    handler: () => {
      isModalDeleteOpen.value = false
    }
  },
  {
    text: 'Confirm',
    role: 'confirm',
    handler: async () => {
      await tagStore.remove(removingId.value)
    }
  }
]
</script>
