<template>
  <ion-card :class="{'ion-no-margin': noMargin}">
    <ion-card-header v-if="$slots.header">
      <slot name="header"/>
    </ion-card-header>

    <ion-card-content
      v-if="$slots['default']"
      :class="[
        contentClass,
        { 'ion-no-padding': noContentPadding }
      ]"
    >
      <slot/>

      <template v-if="$slots.footer">
        <div class="ion-margin-top">
          <slot name="footer"/>
        </div>
      </template>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/vue'

withDefaults(defineProps<{
  contentClass?: string
  noMargin?: boolean
  noPadding?: boolean
  noContentPadding?: boolean
}>(), {
  contentClass: '',
  noMargin: true
})
</script>
