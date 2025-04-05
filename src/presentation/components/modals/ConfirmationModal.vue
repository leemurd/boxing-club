<template>
  <base-modal
    :visible="visible"
    :title="title"
  >
    <template #body>
      <p>{{ message }}</p>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Are you sure?'
  }
})
</script>
