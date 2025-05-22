<template>
  <div class="p-4">
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

    <!-- Список тегов -->
    <ul class="list-group">
      <li
        v-for="tag in tagStore.list"
        :key="tag.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>{{ tag.name }}</span>
        <div>
          <button
            class="btn btn-sm btn-outline-secondary me-2"
            @click="goEdit(tag.id)"
          >
            Ред.
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="removeTag(tag.id)"
          >
            Удал.
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTagStore } from '@/presentation/stores/tagStore'

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

function goEdit(id: string) {
  router.push({
    name: 'TagEdit',
    params: { id }
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
