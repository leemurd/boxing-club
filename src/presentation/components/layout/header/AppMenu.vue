<!--src/presentation/components/layout/header/AppMenu.vue-->
<template>
  <ion-menu
    side="start"
    menu-id="main-menu"
    content-id="main-content"
    type="overlay"
    class="app-menu"
  >
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          <header-logo>My Boxing</header-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list lines="full">
        <ion-item
          v-for="r in visibleRoutes"
          :key="r.path"
          :router-link="r.path"
          button
          :detail="false"
          class="app-menu__item ion-text-nowrap"
          :class="{
            'app-menu__item-selected': isCurrentRoute(r),
          }"
          :color="isCurrentRoute(r) ? 'light' : ''"
          @click="closeMenu()"
        >
          <ion-label>
            {{ r.meta.name }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue'
// import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/presentation/stores/authStore'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import { type RouteRecordRaw, useRoute } from 'vue-router'
import HeaderLogo from '@/presentation/components/layout/header/HeaderLogo.vue'

const authStore = useAuthStore()
const router = useProjectRouter()
const route = useRoute()
const routes = router.getRoutes()
const isCurrentRoute = (r: RouteRecordRaw) => r.path === route.path

const visibleRoutes = computed(() => {
  if (authStore.loading) return []
  return authStore.isLoggedIn
    ? routes.filter((r: RouteRecordRaw) => r.meta?.tags?.includes('userRoute'))
    : routes.filter((r: RouteRecordRaw) => r.meta?.tags?.includes('authRoute'))
})

function closeMenu() {
  const menu = document.querySelector('ion-menu')
  if (menu) (menu as any).close()
}
</script>

<style scoped lang="scss">
.navbar-brand-logo {
  height: 24px;
  margin-right: 8px;
}

ion-item:not(.app-menu__item-selected)::part(native) {
  background: var(--ion-background-color);
  //color: var(--color);
}

//ion-item.app-menu__item-selected::part(native) {
  //background: var(--ion-card-background);
//}
</style>
