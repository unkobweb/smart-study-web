<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  layout: "empty",
})

const route = useRoute()
const router = useRouter()

const accessToken = route.query.token

onMounted(() => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
    router.push({ path: '/' })
  } else {
    router.push({ path: '/login' })
  }
})
</script>