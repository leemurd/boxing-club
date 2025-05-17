<template>
  <div class="card">
    <div
      v-if="$slots['header']"
      class="card-header text-muted"
      :class="{
        'border-bottom-0': !$slots['default'],
      }"
    >
      <slot name="header"/>
    </div>

    <div
      v-if="$slots['default']"
      class="card-body"
    >
      <slot/>
    </div>

    <div
      v-if="$slots['footer']"
      class="card-footer text-body-secondary"
    >
      <slot name="footer"/>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
