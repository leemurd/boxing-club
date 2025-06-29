<template>
  <div class="modal-container">
    <header class="modal-header">
      <h5 class="modal-title">
        <slot name="header">
          {{ title }}
        </slot>
      </h5>
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

defineProps({
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
//$modal-content-bg

[data-bs-theme=dark] {
  .modal-container {
    //border: 1px solid $border-color-dark!important;
  }
}

.modal-container {
  //background: $modal-content-bg;
  padding: 0.5rem 1rem 1rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  color: #333;
  //border-color: $modal-content-border-color;
  //border-width: $modal-content-border-width;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal-title {
    color: var(--ion-text-color);
  }
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-body {
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: var(--ion-text-color);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
