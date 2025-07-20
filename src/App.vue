<!--src/App.vue-->
<template>
  <ion-app>
    <ion-split-pane
      when="md"
      content-id="main"
      @ionSplitPaneVisible="onSplitPaneVisible"
    >
      <app-menu content-id="main"/>

      <ion-content id="main">
        <ion-router-outlet/>
      </ion-content>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonRouterOutlet, IonSplitPane } from '@ionic/vue'
import AppMenu from '@/presentation/components/layout/header/AppMenu.vue'
import { provide, ref } from 'vue'

const isSplitPaneVisible = ref(false)

provide('isSplitPaneVisible', isSplitPaneVisible)

const onSplitPaneVisible = (event: any): void => {
  isSplitPaneVisible.value = event.detail.visible
}
</script>
