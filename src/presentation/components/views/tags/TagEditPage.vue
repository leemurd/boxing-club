<template>
  <page-default>
    <h1 class="mb-4">{{ isNew ? 'Новый тег' : 'Редактировать тег' }}</h1>

    <div class="mb-3">
      <label class="form-label">Название</label>
      <input
        v-model="tag.name"
        class="form-control"
        placeholder="Введите название тега"
      >
    </div>

    <button
      class="btn btn-success me-2"
      :disabled="!tag.name.trim()"
      @click="saveTag"
    >
      {{ isNew ? 'Создать' : 'Сохранить' }}
    </button>
    <button
      class="btn btn-secondary"
      @click="goBack"
    >Отмена</button>
  </page-default>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagStore } from '@/presentation/stores/tagStore'
import type { Tag } from '@/domain/entities/Tag'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'

const route = useRoute()
const router = useRouter()
const tagStore = useTagStore()

// Определяем, создаём ли новый или редактируем существующий
const id = route.params.id as string | undefined
const isNew = ref(!id)

// Локальная модель тега
const tag = reactive<Tag>({
  id: id ?? '',
  name: ''
})

onMounted(async () => {
  await tagStore.load()
  if (!isNew.value) {
    const existing = await tagStore.getById(id!)
    if (existing) {
      tag.id = existing.id
      tag.name = existing.name
    } else {
      // если не нашли — уходим назад
      router.replace({ name: 'TagList' })
    }
  }
})

async function saveTag() {
  if (isNew.value) {
    await tagStore.add(tag.name.trim())
  } else {
    await tagStore.rename(tag)
  }
  router.push({ name: 'TagList' })
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.form-label {
  font-weight: 500;
}
</style>
