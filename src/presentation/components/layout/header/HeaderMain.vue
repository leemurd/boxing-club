<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-secondary-subtle bg-dark">
      <div class="container-fluid">
        <router-link
          class="navbar-brand"
          to="/"
          @click="collapseNavbar"
        >
          <!--                    <img-->
          <!--                      :src="logo"-->
          <!--                      alt="logo"-->
          <!--                      class="navbar-brand-icon"-->
          <!--                    >-->
          <!--                    Adidas-->
          <!--          Acting-->
          Family
          Boxing
          Club
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
          <ul class="navbar-nav align-items-center w-100 mb-2 mb-lg-0">
            <li
              v-for="(route, index) in routes"
              :key="index"
              class="nav-item"
              :class="[index === routes.length - 1 ? 'ms-lg-auto' : '']"
            >
              <router-link
                class="nav-link"
                :to="route.path"
                @click="collapseNavbar"
              >
                {{ route.name }}
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
import {
  type RouteLocation,
  RouterLink
} from 'vue-router'
// import logo from '@/presentation/assets/adidas-logo.svg'
// import logo from '@/presentation/assets/adidas-logo-white.svg'
// import logo from '@/presentation/assets/adidas-logo-filled-white.svg'

const routes = [
  {
    path: '/',
    name: 'Combos'
  },
  {
    path: '/punches',
    name: 'Library'
  },{
    path: '/enemy-card',
    name: 'Enemies'
  },{
    path: '/punch-counter',
    name: 'Punch-Counter'
  },{
    path: '/profile',
    name: 'Profile'
  }
] as RouteLocation[]

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
</script>

<style lang="scss" scoped>
@import '@/presentation/styles/mixins';

.navbar {
  &-brand {
    @include slabFont;
    font-weight: 800;
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
      &.active {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
