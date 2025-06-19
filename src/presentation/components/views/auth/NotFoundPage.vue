<!--src/presentation/components/views/auth/NotFoundPage.vue-->
<template>
  <page-default class="not-found">
    <h1>404</h1>
    <p>Page not found.</p>
    <router-link to="/">Go to homepage</router-link>
  </page-default>
</template>
<script setup lang="ts">
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
</script>
