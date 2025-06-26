<!--src/presentation/components/layout/header/MainHeader.vue-->
<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons
        slot="start"
      >
        <slot name="start">
          <ion-back-button
            v-if="headerBack"
            default-href="/"
            @click="router.canGoBack ? router.back() : router.navigate({ name: 'Progress' })"
          />
          <ion-menu-button
            v-else
            :auto-hide="false"
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

defineProps<{
  headerBack?: boolean
}>()

const router = useProjectRouter()
</script>
