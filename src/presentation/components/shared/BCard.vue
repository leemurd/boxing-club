<template>
  <ion-card>
    <ion-card-header v-if="$slots.header">
      <slot name="header"/>
    </ion-card-header>

    <ion-card-content v-if="$slots['default']">
      <slot/>
    </ion-card-content>

    <template v-if="$slots.footer">
      <ion-buttons>
        <slot name="footer"/>
      </ion-buttons>
    </template>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonButtons } from '@ionic/vue'
</script>
