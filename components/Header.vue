<template>
  <div>
    <v-app-bar class="d-flex flex-row align-center justify-space-between">
      <v-app-bar-title>
        <NuxtLink to="/">
          Smart Study
        </NuxtLink>
      </v-app-bar-title>
      <div class="d-flex flex-row align-center" v-if="user">
        <v-menu
          open-on-hover
          open-delay="0"
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-flex flex-row align-center">
              <v-avatar :image="userImage" class="mr-2"></v-avatar>
              <p class="mr-3 user-email">{{ user.email }}</p>
            </div>
          </template>

          <v-list>
            <NuxtLink v-for="(item, index) in items" :key="index" :to="item.url">
              <v-list-item>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </NuxtLink>
          </v-list>
        </v-menu>

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

const userImage = computed(() => {
  if (user.value?.profilePicture) {
    return user.value.profilePicture.url
  }
  return "/default.jpg"
})

const items = ref([
  { title: "Mon profil", url: "/profile" },
  { title: "Mes cours", url: "/courses" },
  { title: "Espace formateur", url: "/teacher"}
])

const logout = () => {
  useUserStore().setAccessToken('')
  window.location.reload()
}
</script>

<style lang="scss">
.user-email {
  cursor: default;
}
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