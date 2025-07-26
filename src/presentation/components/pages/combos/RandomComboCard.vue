<template>
  <div class="d-flex flex-column">
    <div class="small text-muted mb-1">or generate random combo (beta-version)</div>

    <b-card>
      <div class="d-flex flex-column w-100 gap-1">
        <b-button
          size="default"
          color="medium"
          @click="$emit('on-generate')"
        >
          <span class="small">Generate combo</span>
        </b-button>

        <span class="small">with</span>

        <ion-item>
          <b-select
            v-model="localValue"
            :items="comboRandomItems"
            option-label="label"
            label="Number of moves"
          />
        </ion-item>
      </div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import BCard from '@/presentation/components/shared/BCard.vue'
import { comboRandomItems } from '@/presentation/constants/combo/data.ts'
import BSelect from '@/presentation/components/shared/BSelect.vue'
import { ref, watch } from 'vue'
import { IonItem } from '@ionic/vue'

const props = withDefaults(defineProps<{
  iterations?: number,
}>(), {
  iterations: 5
})

const emit = defineEmits<{
  (e: 'on-generate'): void,
  (e: 'update:iterations', value: number): void
}>()

const localValue = ref(props.iterations)

watch(localValue, (value: number): void => {
  emit('update:iterations', value)
})

</script>
