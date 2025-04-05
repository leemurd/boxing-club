<template>
  <div
    v-if="!isLoading"
    class="footer navbar navbar-expand-lg bg-secondary-subtle"
  >
    <ul class="navbar-nav align-items-center w-100 mb-2 mb-lg-0">
      <li
        v-for="(route, index) in visibleRoutes"
        :key="index"
        class="nav-item"
        :class="[index === visibleRoutes.length - 1 ? 'ms-lg-auto' : '']"
      >
        <router-link
          class="nav-link"
          :to="route.path"
          active-class="active fw-semibold"
        >
          {{ route.meta.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const routes = router.getRoutes()
const isLoading = computed(() => authStore.loading)

const userRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('userRoute')))
const authRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('authRoute')))
const visibleRoutes = computed(() => {
  if (isLoading.value) {
    return []
  } else {
    return authStore.isLoggedIn ? userRoutes.value : authRoutes.value
  }
})
</script>

<style scoped lang="scss">
@import '@/presentation/styles/mixins';

.footer {
  .nav-link {
    @include slabFont;
  }
}
</style>
