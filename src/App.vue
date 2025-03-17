<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
</script>

<template>
  <header-main />
  <div class="container mt-4 mb-3">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
</style>
