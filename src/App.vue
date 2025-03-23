<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
</script>

<template>
  <header-main />
  <div class="container pt-4 pb-3">

    <h1 class="text-center mb-2">{{ $route.meta.name }}</h1>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
</style>
