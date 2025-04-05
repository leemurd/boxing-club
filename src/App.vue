<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
import ModalContainer from '@/presentation/components/modals/ModalContainer.vue'
import FooterMain from '@/presentation/components/layout/footer/FooterMain.vue'
</script>

<template>
  <div class="d-flex flex-column h-100">
    <header-main />
    <div class="container pt-4 pb-3 flex-grow-1">

      <h1 class="text-center mb-2">{{ $route.meta.name }}</h1>
      <router-view />
      <modal-container />
    </div>
    <footer-main/>
  </div>
</template>

<style scoped lang="scss">
</style>
