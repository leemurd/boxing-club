<template>
  <div
    v-if="modalState.isOpen"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <component
      :is="modalState.component"
      v-bind="{ ...modalState.props, visible: modalState.isOpen }"
      @apply="combinedApply"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalService } from '@/presentation/composition/useModalService'
const { modalState, closeModal } = useModalService()

function combinedApply() {
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
