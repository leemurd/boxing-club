<!-- src/presentation/components/modals/ComboSelectorModal.vue -->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          color="medium"
          @click="cancel"
        >Cancel</ion-button>
      </ion-buttons>
      <ion-title>Select combo</ion-title>
      <ion-buttons slot="end">
        <ion-button
          :strong="true"
          @click="confirm"
        >Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-radio-group
      v-model="selectedLocal"
      value="combos"
    >
      <template
        v-for="combo in comboStore.combos"
        :key="combo.id"
      >
        <ion-radio
          :value="combo.id"
          label-placement="end"
        >{{ combo.title }}</ion-radio><br>
      </template>
    </ion-radio-group>
  </ion-content>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonRadio,
  IonRadioGroup,
  modalController
} from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { useComboStore } from '@/presentation/stores/comboStore.ts'

const props = defineProps<{
  selected?: string
}>()

const cancel = () => modalController.dismiss(null, 'cancel')
const confirm = () => modalController.dismiss(selectedLocal.value, 'confirm')

const comboStore = useComboStore()
const selectedLocal = ref<string | null>(props.selected || null)

onMounted(async () => {
  await comboStore.load()
  selectedLocal.value = comboStore.combos[0].id
})
</script>
