// src/presentation/composition/useProjectRouter.ts
import { useIonRouter } from '@ionic/vue'
import { useRouter } from 'vue-router'

function useProjectRouter() {
  const router = useIonRouter()
  const vueRouter = useRouter()

  const routerMap: Record<string, any> = {
    canGoBack: router.canGoBack,
    navigate: router.navigate,
    push: vueRouter.push,
    replace: vueRouter.replace,
    back: vueRouter.back,
    forward: vueRouter.forward,
    getRoutes: vueRouter.getRoutes
  }

  return routerMap
}

export default useProjectRouter
