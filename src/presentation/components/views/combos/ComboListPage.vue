<!-- src/presentation/pages/ComboListPage.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button
        color="dark"
        @click="$router.push({ name: 'ComboNew' })"
      >
        Add new combo
      </b-button>

      <b-button
        color="link"
        @click="$router.push({name: 'ComboCategories'})"
      >Categories</b-button>
    </div>

    <list-group
      :items="comboStore.combos"
      item-val="title"
      :primary-callback="onEditCombo"
      :secondary-callback="remove"
      item-link
    />
  </div>
</template>

<script lang="ts" setup>
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import { useRouter } from 'vue-router'
import type { Combination } from '@/domain/entities/Combination.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'

const comboStore = useComboStore()
const router = useRouter()
const { openModalByKey } = useModalService()

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
