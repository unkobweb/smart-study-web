<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  layout: "empty",
})

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

await userStore.fetchUser();

if (route.query.token) {
  userStore.setAccessToken(route.query.token);
  await userStore.fetchUser();
  router.push({ path: '/' })
} else if (route.query.mfatoken) {
  userStore.setMfaToken(route.query.mfatoken);
  router.push({ path: `/login`, query: { mfatoken: route.query.mfatoken } })
} else {
  router.push({ path: '/login' })
}
</script>