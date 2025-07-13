<!--src/presentation/components/layout/page/PageDefault.vue-->
<template>
  <ion-page>
    <slot name="header">
      <main-header :header-back="headerBack">
        <template v-slot:start>
          <slot name="header-start"/>
        </template>
        <template v-slot:end>
          <slot name="header-end"/>
        </template>
      </main-header>
    </slot>

    <ion-content
      :fullscreen="true"
      class="ion-padding"
    >
      <slot/>
    </ion-content>

    <ion-footer
      v-if="$slots['footer']"
      class="ion-no-padding"
    >
      <ion-toolbar>
        <slot name="footer"/>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonFooter,
  IonToolbar
} from '@ionic/vue'
import MainHeader from "@/presentation/components/layout/header/MainHeader.vue"

defineProps<{
  headerBack?: boolean
}>()

</script>
