<template>
  <ion-card
    :class="{
      'ion-no-padding': true,
    }"
  >
    <ion-card-header v-if="$slots.header">
      <slot name="header"/>
    </ion-card-header>

    <ion-card-content
      v-if="$slots['default']"
      :class="[contentClass]"
    >
      <slot/>

      <template v-if="$slots.footer">
        <slot name="footer"/>
      </template>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/vue'

withDefaults(defineProps<{
  contentClass?: string
}>(), {
  contentClass: ''
})
</script>
