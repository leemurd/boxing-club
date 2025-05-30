<!-- src/presentation/components/modals/TagSelectorModal.vue -->
<template>
  <base-modal title="Select Tags">
    <template #body>
      <div
        v-for="tag in tagStore.list"
        :key="tag.id"
        class="form-check"
      >
        <input
          :id="tag.id"
          v-model="selectedLocal"
          class="form-check-input"
          type="checkbox"
          :value="tag.id"
        >
        <label
          class="form-check-label form-label"
          :for="tag.id"
        >
          {{ tag.name }}
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
      >Save</button>
    </template>
  </base-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useModalService } from '@/presentation/composition/useModalService'
import { useTagStore }     from '@/presentation/stores/tagStore'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'

const props = defineProps<{
  selected: string[]
  onSave: (ids: string[]) => void
}>()

const modal    = useModalService()
const tagStore = useTagStore()
const selectedLocal = ref<string[]>([...props.selected])

onMounted(async () => {
  await tagStore.load()
})

function save() {
  props.onSave(selectedLocal.value)
  modal.closeModal()
}

function close() {
  modal.closeModal()
}
</script>
