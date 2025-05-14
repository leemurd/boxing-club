<template>
  <base-modal @close="onCancel">
    <template #header>
<!--      <h2 class="h4 text-center w-100">-->
        New
<!--      </h2>-->
    </template>
    <template #body>
      <input
        v-model="localValue"
        class="form-input w-100 text-center"
        type="text"
      >
    </template>
    <template #footer>
      <button
        class="btn btn-secondary"
        @click="onCancel"
      >Отмена</button>
      <button
        class="btn btn-primary"
        :disabled="!localValue.trim().length"
        @click="save"
      >Сохранить</button>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { closeModal } from '@/presentation/composition/useModalService'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'

const props = withDefaults(defineProps<{
  title: string,
  onSave: (val: string) => void
}>(), {
  title: ''
})

const localValue = ref<string>(props.title)

function onCancel() {
  closeModal()
}

function save() {
  if (!localValue.value.trim().length) return
  props.onSave(localValue.value.trim())
  closeModal()
}
</script>
