<template>
  <div>
    <v-app-bar class="d-flex flex-row align-center justify-space-between">
      <v-app-bar-title>Smart Study</v-app-bar-title>
      <div class="d-flex flex-row align-center" v-if="user">
        <NuxtLink to="/profile"><p class="mr-3">{{ user.email }}</p></NuxtLink>
        <v-btn class="mr-3" variant="tonal" @click="logout">Se déconnecter</v-btn>
      </div>
      <div v-else>
        <NuxtLink class="mr-3" to="/login">
          <v-btn variant="tonal">Se connecter</v-btn>
        </NuxtLink>
        <NuxtLink class="mr-3" to="/signup">
          <v-btn variant="tonal">S'inscrire</v-btn>
        </NuxtLink>
      </div>
    </v-app-bar>  
    <div class="behind-app-bar"></div>
  </div>
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
.v-app-bar {
  height: 60px;
  width: 100vw;
  background-color: #dfe6e9;
}
.behind-app-bar {
  height: 60px;
  width: 100vw;
}
</style>