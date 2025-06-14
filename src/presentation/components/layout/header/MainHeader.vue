<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons
        slot="start"
      >
        <slot name="start">
          <ion-back-button
            v-if="headerBack"
            default-href="/"
            @click="router.back()"
          />
          <ion-menu-button
            v-else
            :auto-hide="false"
          />
        </slot>
      </ion-buttons>
      <ion-title>
        <img
          :src="logo"
          class="navbar-brand-logo"
        >
        {{ $route.meta.name }}
      </ion-title>
      <ion-buttons
        v-if="$slots['end']"
        slot="end"
      >
        <!--        :collapse="true"-->
        <slot name="end"/>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonBackButton } from '@ionic/vue'
import logo from '@/presentation/assets/app-logo3.png'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'

defineProps<{
  headerBack?: boolean
}>()

const router = useProjectRouter()
</script>

<style scoped lang="scss">
.navbar-brand-logo {
  height: 24px;
  margin-right: 8px;
}
</style>
