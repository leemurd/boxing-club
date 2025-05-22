<template>
  <base-modal @close="onCancel">
    <template #header>Выбор категорий</template>
    <template #body>
      <div v-if="categoryStore.list.length">
        <div
          v-for="cat in categoryStore.list"
          :key="cat.id"
          class="form-check mb-2"
        >
          <input
            :id="cat.id"
            v-model="selected"
            class="form-check-input"
            type="checkbox"
            :value="cat.id"
          >
          <label
            class="form-check-label"
            :for="cat.id"
          >
            {{ cat.name }}
          </label>
        </div>
      </div>
      <div
        v-else
        class="text-muted"
      >Пока нет категорий.</div>
    </template>
    <template #footer>
      <button
        class="btn btn-secondary"
        @click="onCancel"
      >Cancel</button>
      <button
        class="btn btn-primary"
        @click="save"
      >Select</button>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore'
import { closeModal } from '@/presentation/composition/useModalService'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'

// props: начальный список выбранных ID + callback onSave
const props = defineProps<{
  selected: string[]
  onSave: (ids: string[]) => void
}>()

const selected = ref<string[]>([...props.selected])
const categoryStore = useCategoryStore()

onMounted(async () => {
  await categoryStore.load()
})

function onCancel() {
  closeModal()
}

function save() {
  props.onSave(selected.value)
  closeModal()
}

// async function onAddCategory() {
//   const name = prompt('Введите название новой категории')
//   if (name?.trim()) {
//     await categoryStore.add(name.trim())
//   }
// }
</script>
