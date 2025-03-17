<template>
  <div
    class="alert alert-warning"
    role="alert"
  >{{ message }}</div>
</template>

<script setup lang="ts">
type AlertType = 'primary' |
  'secondary' |
  'success' |
  'danger' |
  'warning' |
  'info' |
  'light' |
  'dark'

withDefaults(defineProps<{
  message: string,
  color?: AlertType
}>(), {
  color: 'warning'
})


</script>

