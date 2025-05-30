<template>
  <div>
    <div class="d-flex mb-3">
      <input
        v-model="newName"
        class="form-control me-2"
        placeholder="Новый тег"
        @keyup.enter="addTag"
      >
      <button
        class="btn btn-primary"
        @click="addTag"
      >
        Добавить
      </button>
    </div>

    <list-group
      :items="tagStore.list"
      :primary-callback="goEdit"
      :secondary-callback="removeTag"
      item-link
    >
      <template #icon>
        <i class="bi bi-bookmark"/>
      </template>
      <template #actions="{ item }">
        <b-dropdown-item @click="goEdit(item)">Edit</b-dropdown-item>
        <b-dropdown-item @click="removeTag(item.id)">Delete</b-dropdown-item>
      </template>
    </list-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTagStore } from '@/presentation/stores/tagStore'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import type { Tag } from '@/domain/entities/Tag.ts'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'

const tagStore = useTagStore()
const router = useRouter()

const newName = ref('')

onMounted(() => {
  tagStore.load()
})

async function addTag() {
  const name = newName.value.trim()
  if (!name) return
  await tagStore.add(name)
  newName.value = ''
}

// function goEdit(id: string) {
function goEdit(tag: Tag) {
  console.log(tag)
  router.push({
    name: 'TagEdit',
    params: { id: tag.id }
  })
}

async function removeTag(id: string) {
  if (confirm('Удалить этот тег?')) {
    await tagStore.remove(id)
  }
}
</script>

<style scoped>
.list-group-item span {
  font-size: 1rem;
}
</style>
