<template>
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      v-bind="{
        ...route.meta?.props || {},
        ...{combos: comboStore.combos}
      }"
    />
  </router-view>
</template>

<script setup lang="ts">
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { onMounted, watch } from 'vue'

const comboStore = useComboStore()
const authStore = useAuthStore()

onMounted( () => {
  comboStore.load()
})

watch(
  () => authStore.currentUser,
  (u) => {
    if (u) comboStore.load()
  }, {
    immediate: true
  }
)
</script>

<style scoped lang="scss">

</style>
