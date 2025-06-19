<!--src/presentation/components/layout/page/PageDefault.vue-->
<template>
  <ion-page>
    <slot name="header">
      <main-header :header-back="headerBack">
        <template #start>
          <slot name="header-start"/>
        </template>
        <template #end>
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
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage
} from '@ionic/vue'
import MainHeader from "@/presentation/components/layout/header/MainHeader.vue"


defineProps<{
  headerBack?: boolean
}>()

</script>

<style scoped lang="scss">
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
