<template>
  <section-layout/>
</template>

<script lang="ts" setup>
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import { onBeforeMount } from 'vue'
import SectionLayout from '@/presentation/components/layout/router/SectionLayout.vue'

const comboStore = useComboStore()
const categoryStore = useCategoryStore()

const init = async () => {
  await comboStore.load()
  await categoryStore.load()
}

onBeforeMount(async () => {
  await init()
})
</script>
