<template>
  <ion-card>
    <ion-card-header v-if="$slots.header">
      <slot name="header"/>
    </ion-card-header>

    <ion-card-content v-if="$slots.default">
      <slot/>
    </ion-card-content>

    <template v-if="$slots.footer">
      <slot name="footer"/>
    </template>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/vue'
</script>
