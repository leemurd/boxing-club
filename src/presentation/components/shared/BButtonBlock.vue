<template>
  <b-button
    expand="block"
    color="dark"
    class="ion-padding"
    size="default"
  >
    <slot/>
  </b-button>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
</script>
