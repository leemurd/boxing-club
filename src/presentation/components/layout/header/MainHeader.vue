<!--src/presentation/components/layout/header/MainHeader.vue-->
<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons
        slot="start"
      >
        <slot name="start">
          <ion-menu-button
            v-if="$route.name === 'ProgressPage'"
            :auto-hide="false"
          />
          <ion-back-button
            v-else
            default-href="/"
            @click="router.canGoBack ? router.back() : router.navigate({ name: 'Progress' })"
          />
        </slot>
      </ion-buttons>
      <ion-title>
        <header-logo/>
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
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import HeaderLogo from '@/presentation/components/layout/header/HeaderLogo.vue'

const router = useProjectRouter()
</script>
