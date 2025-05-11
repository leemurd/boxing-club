<template>
  <div class="modal-container">
    <header class="modal-header">
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
      <button
        class="close-btn"
        @click="handleClose"
      >×</button>
    </header>
    <section class="modal-body">
      <slot name="body"/>
    </section>
    <footer class="modal-footer justify-content-between">
      <slot name="footer">
        <button
          class="btn btn-secondary me-auto"
          @click="handleClose"
        >Cancel</button>
        <button
          class="btn btn-primary"
          @click="handleApply"
        >Apply</button>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close', 'apply'])

function handleClose() {
  emit('close')
}
function handleApply() {
  emit('apply')
}
</script>

<style scoped lang="scss">
.modal-container {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  color: #333;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
