<template>
  <v-app>
    <Header />
    <slot />
    <Snackbar />
  </v-app>
</template>

<script setup>
import { storeToRefs } from 'pinia';

useSeoMeta({
  title: "Smart Study",
  description: "Smart Study"
})

const { user } = storeToRefs(useUserStore())
const { fetchUser } = useUserStore()

if (!user.value && useCookie('access_token').value) {
  await fetchUser()  
}
console.log("Layout")
</script>