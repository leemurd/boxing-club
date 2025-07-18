<template>
  <page-default header-back>
    <h1 class="mb-4">{{ isNew ? 'Новый тег' : 'Редактировать тег' }}</h1>

    <b-input
      v-model="tag.name"
      class="form-control me-2"
      placeholder="Enter text"
      label="New tag name"
      autofocus
      @keyup.enter="saveTag"
    />

    <template v-slot:footer>
      <b-button-block
        :disabled="!tag.name.trim()"
        @click="saveTag"
      >
        {{ isNew ? 'Создать' : 'Сохранить' }}
      </b-button-block>
    </template>
  </page-default>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagStore } from '@/presentation/stores/tagStore'
import type { Tag } from '@/domain/entities/Tag'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'
import BInput from '@/presentation/components/shared/BInput.vue'

const route = useRoute()
const router = useRouter()
const tagStore = useTagStore()

const id = route.params.id as string | undefined
const isNew = ref(!id)

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
    }
  }
})

async function saveTag() {
  if (isNew.value) {
    await tagStore.add(tag.name.trim())
  } else {
    await tagStore.rename(tag)
  }
  await router.replace({ name: 'TagIndex' })
}
</script>
