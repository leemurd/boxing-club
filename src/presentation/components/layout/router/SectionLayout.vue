<!-- SectionLayout.vue -->
<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-router-outlet/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonContent, IonRouterOutlet } from '@ionic/vue'
</script>
