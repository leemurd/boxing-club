<!-- src/presentation/components/modals/ComboSelectorModal.vue -->
<template>
  <base-modal title="Select Tags">
    <template #body>
      <div
        v-for="combo in comboStore.combos"
        :key="combo.id"
        class="form-check"
      >
        <input
          :id="combo.id"
          v-model="selectedLocal"
          class="form-check-input"
          type="radio"
          :value="combo.id"
        >
        <label
          class="form-check-label form-label"
          :for="combo.id"
        >
          {{ combo.title }}
        </label>
      </div>
    </template>
    <template #footer>
      <button
        class="btn btn-secondary"
        @click="close"
      >Cancel</button>
      <button
        class="btn btn-primary"
        @click="save"
      >Select</button>
    </template>
  </base-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useModalService } from '@/presentation/composition/useModalService'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'
import { useComboStore } from '@/presentation/stores/comboStore.ts'

const props = defineProps<{
  selected?: string
  onSave: (id?: string) => void
}>()

const modal    = useModalService()
const comboStore = useComboStore()
const selectedLocal = ref<string | null>(props.selected || null)

onMounted(async () => {
  await comboStore.load()
})

function save() {
  props.onSave(selectedLocal.value || undefined)
  modal.closeModal()
}

function close() {
  modal.closeModal()
}
</script>
