<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <router-link
        class="navbar-brand d-flex align-items-center"
        to="/"
      >
        <img
          class="navbar-brand-logo"
          :src="logo"
          alt="My Boxing Logo"
        >
        My Boxing {{ route.meta.name }}
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleOffcanvas"
      >
        <span class="navbar-toggler-icon"/>
      </button>

      <!-- Offcanvas -->
      <div
        id="offcanvasNavbar"
        ref="offcanvasEl"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <router-link
            class="navbar-brand d-flex align-items-center"
            to="/"
          >
            <img
              class="navbar-brand-logo"
              :src="logo"
              alt="My Boxing Logo"
            >
            My Boxing {{ route.meta.name }}
          </router-link>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeOffcanvas"
          />
        </div>

        <div class="offcanvas-body">
          <ul
            v-if="!isLoading"
            class="navbar-nav flex-grow-1 pe-3"
          >
            <li
              v-for="(routeItem, index) in visibleRoutes"
              :key="index"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                :to="routeItem.path"
                @click="closeOffcanvas"
              >
                {{ routeItem.meta.name }}
              </router-link>
            </li>
          </ul>

          <ul class="navbar-nav flex-grow-1 pe-3 mt-4">
            <li class="nav-item">
              <a
                class="nav-link fs-4"
                href="#"
                @click.stop.prevent="toggleTimerFunc(toggleTimerVisible)"
              >
                {{ isTimerVisible ? 'Hide' : 'Show' }} timer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <bc-timer v-if="isTimerVisible"/>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/presentation/assets/app-logo3.png'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { computed, onMounted, watch, ref } from 'vue'
import { Offcanvas } from 'bootstrap'
import BcTimer from '@/presentation/components/layout/header/BcTimer.vue'
import { useTimerStore } from '@/presentation/stores/timerStore.ts'
import { storeToRefs } from 'pinia'

// timer
const timerStore = useTimerStore()
const { isTimerVisible } = storeToRefs(timerStore)
const { toggleTimerVisible } = timerStore
// /timer

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

// offCanvas
const offcanvasEl = ref<HTMLElement | null>(null)
let offcanvasInstance: Offcanvas | null = null

function toggleOffcanvas() {
  if (offcanvasInstance) offcanvasInstance.toggle()
}

function closeOffcanvas() {
  if (offcanvasInstance) offcanvasInstance.hide()
}

onMounted(() => {
  if (offcanvasEl.value) offcanvasInstance = new Offcanvas(offcanvasEl.value)
})
// end offCanvas

const toggleTimerFunc = (callback: () => void) => {
  callback()
  closeOffcanvas()
}

watch(() => route.name, () => {
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
    font-size: 15px;
    &-logo {
      height: 25px;
      width: auto;
      margin-right: 8px;
      margin-bottom: -1px;
    }
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
      font-size: 20px;
      font-weight: 500;
      transition: font-size 0.3s;
    }
  }
}
</style>
