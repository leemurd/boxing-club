<template>
  <div class="d-flex align-items-center justify-content-center">
    <img
      :src="logo"
      class="navbar-brand-logo"
    >
    <slot>
      {{ $route.meta.name }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import logo from '@/presentation/assets/app-logo3.png'
</script>

<style scoped lang="scss">
.navbar-brand-logo {
  height: 24px;
  margin-right: 8px;
}
</style>
