<template>
  <header class="d-flex flex-row align-center justify-space-between px-4">
    <h1>Smart Study</h1>
    <div class="d-flex flex-row align-center" v-if="user">
      <NuxtLink to="/profile"><p class="mr-3">{{ user.email }}</p></NuxtLink>
      <v-btn @click="logout">Se déconnecter</v-btn>
    </div>
    <div v-else>
      <NuxtLink class="mr-3" to="/login">
        <v-btn>Se connecter</v-btn>
      </NuxtLink>
      <NuxtLink to="/signup">
        <v-btn>S'inscrire</v-btn>
      </NuxtLink>
    </div>
  </header>  
</template>

<script setup>
import { storeToRefs } from "pinia"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const logout = () => {
  useUserStore().setAccessToken('')
  window.location.reload()
}
</script>

<style lang="scss">
header {
  height: 60px;
  width: 100vw;
  background-color: #dfe6e9;
}
</style>