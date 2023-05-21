<template>
  <div class="pa-5">
    <v-row>
      <v-col cols="12" sm="8" md="8" lg="8" xl="8">

      </v-col>
      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
        <v-alert
          :icon="user.enabled2Fa ? 'unlock-outline' : 'lock-outline'" 
          :title="user.enabled2Fa ? 'Double authentification activée' : 'Double authentification'" 
          :text="alertMsg"
          :type="user.enabled2Fa ? 'success' : 'warning'"
        ></v-alert>
      </v-col>
    </v-row>
    {{ user || "pas user" }}
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

definePageMeta({
  middleware: ["auth"]
})

const { user } = storeToRefs(useUserStore());

const alertMsg = computed(() => {
  if (user.value.enabled2Fa) {
    return "Vous avez activé la double authentification, votre compte est maintenant plus sécurisé"
  } else {
    return "Vous n'avez pas activé la double authentification, votre compte est moins sécurisé, vous pouvez l'activer en cliquant sur le bouton ci-dessous"
  }
})
</script>