<template>
  <div
    class="alert"
    :class="{
      [`alert-${color}`]: true,
      'alert-dismissible fade show': closable
    }"
    role="alert"
  >
    {{ message }}
    <button
      ref="closeBtn"
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type AlertType = 'primary' |
  'secondary' |
  'success' |
  'danger' |
  'warning' |
  'info' |
  'light' |
  'dark'

const props = withDefaults(defineProps<{
  message: string,
  color?: AlertType,
  closable?: boolean,
  autoClose?: boolean,
}>(), {
  color: 'warning'
})

const emit = defineEmits<{
  'close': () => void
}>()

const closeBtn = ref()

const setAutoclose = () => {
  setTimeout(() => {
    closeBtn.value.click()
  }, 2000)
}

onMounted(() => {
  if (props.autoClose) {
    setAutoclose()
  }
})

</script>

