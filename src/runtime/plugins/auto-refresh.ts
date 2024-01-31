import { useDirectusAuth } from '../composables/use-directus-auth'
import {
  addRouteMiddleware,
  defineNuxtPlugin,
  useRuntimeConfig
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  addRouteMiddleware((_to, _from) => {
    const { authConfig: { useNuxtCookies } } = useRuntimeConfig().public.directus

    const {
      refreshTokenCookie,
      refreshTokens,
      tokens
    } = useDirectusAuth({ useStaticToken: false })

    if (!tokens.value?.access_token && (!!refreshTokenCookie().value || !useNuxtCookies)) {
      nuxtApp.hook('app:beforeMount', async () => {
        await refreshTokens()
      })
    }
  })
})
