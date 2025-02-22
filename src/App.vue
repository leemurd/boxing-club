<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
</script>

<template>
  <header-main/>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
</style>
