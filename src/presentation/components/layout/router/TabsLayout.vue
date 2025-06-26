<!-- src/presentation/components/layout/TabsLayout.vue -->
<template>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button
        tab="progress"
        href="/tabs/progress"
      >
<!--        <ion-icon name="analytics" />-->
        <ion-label>Progress</ion-label>
      </ion-tab-button>
      <ion-tab-button
        tab="exercises"
        href="/tabs/exercises"
      >
<!--        <ion-icon name="barbell" />-->
        <ion-label>Exercises</ion-label>
      </ion-tab-button>
      <ion-tab-button
        tab="combos"
        href="/tabs/combos"
      >
<!--        <ion-icon name="list" />-->
        <ion-label>Combos</ion-label>
      </ion-tab-button>
      <ion-tab-button
        tab="combo-categories"
        href="/tabs/combo-categories"
      >
<!--        <ion-icon name="pricetags" />-->
        <ion-label>Categories</ion-label>
      </ion-tab-button>
      <ion-tab-button
        tab="tags"
        href="/tabs/tags"
      >
<!--        <ion-icon name="pricetags" />-->
        <ion-label>Tags</ion-label>
      </ion-tab-button>
      <ion-tab-button
        tab="account"
        href="/tabs/account"
      >
<!--        <ion-icon name="person" />-->
        <ion-label>Account</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
    <ion-router-outlet/>
  </ion-tabs>
</template>

<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/vue'
</script>
