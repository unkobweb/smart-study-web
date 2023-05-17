export default defineNuxtRouteMiddleware((to, from) => {
  const token = useUserStore().accessToken

  if (!token) {
    return navigateTo('/login')
  }
})