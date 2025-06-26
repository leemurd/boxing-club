<!-- src/presentation/pages/ComboListPage.vue -->
<template>
  <page-default>
    <template v-slot:header-end>
      <b-button
        @click="router.push({name: 'ComboCategoriesIndex'})"
      >Categories</b-button>
    </template>

    <list-group
      :items="comboStore.combos"
      option-label="title"
      :primary-callback="onEditCombo"
      item-link
    >
      <template #actions="{ item }">
        <b-dropdown-item @click="onEditCombo(item)">Edit</b-dropdown-item>
        <b-dropdown-item @click="remove(item.id)">Remove</b-dropdown-item>
      </template>
    </list-group>

    <template v-slot:footer>
      <b-button-block
        @click="router.push({ name: 'ComboNew' })"
      >
        New combo
      </b-button-block>
    </template>
  </page-default>
</template>

<script lang="ts" setup>
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import type { Combination } from '@/domain/entities/Combination.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'

const comboStore = useComboStore()
const { openModalByKey } = useModalService()

const router = useProjectRouter()

const onEditCombo = (combo: Combination) => {
  router.push({
    name: 'ComboEdit',
    params: { id: combo?.id }
  })
}

function remove(id: string) {
  openModalByKey(ModalKey.CONFIRMATION, {
    title: 'Confirm delete',
    message: 'Are you sure?',
    onApply: () => comboStore.remove(id)
  })
}
</script>
