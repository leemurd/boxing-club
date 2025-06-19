<!--src/App.vue-->
<template>
  <ion-app>
    <app-menu/>

    <ion-content id="main-content">
      <ion-router-outlet/>
      <modal-container />
    </ion-content>
    <!--    <ion-router-outlet id="main-content" />-->
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonRouterOutlet
} from '@ionic/vue'
import ModalContainer from '@/presentation/components/modals/ModalContainer.vue'
import AppMenu from '@/presentation/components/layout/header/AppMenu.vue'
</script>
