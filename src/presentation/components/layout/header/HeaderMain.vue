<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-secondary-subtle">
      <div class="container-fluid">
        <router-link
          class="navbar-brand"
          to="/"
          @click="collapseNavbar"
        >
          My Boxing {{ route.meta.name }}
        </router-link>

        <button
          class="navbar-toggler btn-sm"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded="true"
          aria-label="Toggle navigation"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"/>
        </button>

        <div
          id="navbarSupportedContent"
          class="collapse navbar-collapse"
        >
          <ul
            v-if="!isLoading"
            class="navbar-nav align-items-center w-100 mb-2 mb-lg-0"
          >
            <li
              v-for="(routeItem, index) in visibleRoutes"
              :key="index"
              class="nav-item"
              :class="[index === visibleRoutes.length - 1 ? 'ms-lg-auto' : '']"
            >
              <router-link
                class="nav-link"
                :to="routeItem.path"
                @click="collapseNavbar"
              >
                {{ routeItem.meta.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Collapse } from 'bootstrap'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { computed, watch } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const routes = router.getRoutes()
const route = useRoute()
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

function toggleNavbar() {
  const navbar = document.getElementById('navbarSupportedContent')
  if (navbar) {
    let bsCollapse = Collapse.getInstance(navbar)
    if (!bsCollapse) {
      bsCollapse = new Collapse(navbar, { toggle: false })
    }
    bsCollapse.toggle()
  }
}

function collapseNavbar() {
  const navbar = document.getElementById('navbarSupportedContent')
  if (navbar) {
    let bsCollapse = Collapse.getInstance(navbar)
    if (!bsCollapse) {
      bsCollapse = new Collapse(navbar, { toggle: false })
    }
    setTimeout(() => {
      bsCollapse.hide()
    },250)
  }
}

watch(() => route.name, () => {
  collapseNavbar()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})
</script>

<style lang="scss" scoped>
@import '@/presentation/styles/mixins';

.navbar {
  &-brand {
    @include slabFont;
    font-weight: 500;
    &-icon {
      height: 21px;
      margin-top: -3px;
      width: 23px;
      object-fit: cover;
      object-position: center;
    }
  }

  &-toggler {
    box-shadow: none!important;
    padding: 5px 10px;
    font-size: 15px;
  }

  &-nav {
    .nav-link {
      @include slabFont;
      font-size: 16px;
      font-weight: 500;
      transition: font-size 0.3s;
    }
  }
}
</style>
