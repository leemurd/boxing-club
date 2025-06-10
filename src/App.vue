<template>
  <div class="d-flex flex-column h-100">
    <header-main />
    <div
      class="container main-container"
      :class="{
        'main-container--timer-expanded': isTimerExpanded,
        'main-container--timer-visible': isTimerVisible
      }"
    >
      <h1 class="text-center mb-4">{{ $route.meta.name }}</h1>
      <ion-app>
        <router-view />
      </ion-app>
      <modal-container />
    </div>
    <footer-main/>
  </div>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue'
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
import ModalContainer from '@/presentation/components/modals/ModalContainer.vue'
import FooterMain from '@/presentation/components/layout/footer/FooterMain.vue'
import { useTimerStore } from '@/presentation/stores/timerStore.ts'
import { storeToRefs } from 'pinia'

const timerStore = useTimerStore()
const { isTimerVisible, isTimerExpanded } = storeToRefs(timerStore)
</script>

<style scoped lang="scss">
$headerHeight: 55px;

.main-container {
  padding-top: 16px;
  padding-bottom: 12px;
  flex-grow: 1;
  transition: $transition-base;
  margin-top: $headerHeight;
  &--timer-visible {
    margin-top: calc($timerCollapsedHeight + $headerHeight);
    @media (min-width: 992px) {
      margin-top: calc($timerCollapsedHeight + $headerHeight + 10px);
    }
  }
  &--timer-expanded {
    margin-top: calc($timerExpandedHeight + $headerHeight)!important;
  }
}
</style>
