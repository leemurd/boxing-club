<template>
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      v-bind="route.meta?.props || {}"
      v-slot="slotProps"
    >
      <template
        v-for="(slotFn, name) in $slots"
        :key="name"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </component>
  </router-view>
</template>
