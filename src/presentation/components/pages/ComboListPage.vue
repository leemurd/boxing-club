<!-- src/presentation/pages/ComboListPage.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button
        class="btn btn-primary"
        @click="$router.push({ name: 'ComboCreate' })"
      >
        New Combo
      </button>

      <router-link to="/combos/categories">Categories</router-link>
    </div>


    <ul class="list-group">
      <li
        v-for="combo in comboStore.combos"
        :key="combo.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          style="cursor: pointer;"
          @click="$router.push({ name: 'ComboEdit', params: { id: combo.id } })"
        >
          {{ combo.title || combo.punches.map(p=>p.name).join(' – ') }}
        </span>
        <button
          class="btn btn-danger btn-sm"
          @click="remove(combo.id)"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useComboStore } from '@/presentation/stores/comboStore'

const comboStore = useComboStore()

function remove(id: string) {
  if (confirm('Delete this combo?')) {
    comboStore.remove(id)
  }
}
</script>
