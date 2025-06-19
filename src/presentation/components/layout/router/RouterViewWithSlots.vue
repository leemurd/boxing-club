<!--src/presentation/components/layout/router/RouterViewWithSlots.vue-->
<template>
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      v-bind="route.meta?.props || {}"
      v-slot="slotProps"
    >
      <!-- итерируемся только по именам слотов, TS выводит name как string -->
      <template
        v-for="name in Object.keys($slots)"
        :key="name"
      >
        <!-- рендерим слот по имени -->
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </component>
  </router-view>
</template>
