<!--<template>-->
<!--  <router-view v-slot="{ Component, route }">-->
<!--    <component-->
<!--      :is="Component"-->
<!--      v-bind="route.meta?.props || {}"-->
<!--      v-slot="slotProps"-->
<!--    >-->
<!--      &lt;!&ndash; итерируемся только по именам слотов, TS выводит name как string &ndash;&gt;-->
<!--      <template-->
<!--        v-for="name in Object.keys($slots)"-->
<!--        :key="name"-->
<!--      >-->
<!--        &lt;!&ndash; рендерим слот по имени &ndash;&gt;-->
<!--        <slot-->
<!--          :name="name"-->
<!--          v-bind="slotProps"-->
<!--        />-->
<!--      </template>-->
<!--    </component>-->
<!--  </router-view>-->
<!--</template>-->
