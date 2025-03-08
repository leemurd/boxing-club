<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-secondary-subtle">
      <div class="container-fluid">
        <router-link
          class="navbar-brand"
          to="/"
        >
          Boxing Club
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div
          id="navbarSupportedContent"
          class="collapse navbar-collapse"
        >
          <ul class="navbar-nav w-100 mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/"
                @click="collapseNavbar"
              >
                Combos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/enemy-card"
                @click="collapseNavbar"
              >
                Enemies
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/punches"
                @click="collapseNavbar"
              >
                Library
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/punch-counter"
                @click="collapseNavbar"
              >
                Punch-Counter
              </router-link>
            </li>
            <li class="nav-item ms-lg-auto">
              <router-link
                class="nav-link"
                to="/profile"
                @click="collapseNavbar"
              >
                My Profile
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Collapse } from 'bootstrap'

function collapseNavbar() {
  const navbar = document.getElementById('navbarSupportedContent')
  if (navbar) {
    let bsCollapse = Collapse.getInstance(navbar)
    if (!bsCollapse) {
      bsCollapse = new Collapse(navbar, { toggle: false })
    }
    bsCollapse.hide()
  }
}
</script>
