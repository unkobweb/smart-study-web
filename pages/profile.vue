<template>
  <div class="w-100 d-flex justify-center">
    <div class="mw-40 mt-8">
      <h2 class="mb-4">Votre profil</h2>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <UserProfileForm />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-alert 
            :title="user.enabled2Fa ? 'Double authentification activée' : 'Double authentification'" 
            :text="alertMsg"
            :type="user.enabled2Fa ? 'success' : 'warning'"
            @click="showSetup2Fa = true"
          >
            <template v-slot:prepend>
              <v-icon fill="white">{{ user.enabled2Fa ? 'lock-outline' : 'unlock-outline' }}</v-icon>
            </template>
            <v-dialog v-model="showSetup2Fa" max-width="800">
              <MfaSetup @close="showSetup2Fa = false" />
            </v-dialog>
          </v-alert>
          <h3 class="mt-6">Statistiques</h3>
          <v-card class="mt-4">
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="10" md="6" lg="10" xl="10">
                  <p>Nombre de cours possédés</p>
                </v-col>
                <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                  <p>0</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="10" md="10" lg="10" xl="10">
                  <p>Nombre de cours terminés</p>
                </v-col>
                <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                  <p>0</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="10" md="10" lg="10" xl="10">
                  <p>Nombre de cours en cours</p>
                </v-col>
                <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                  <p>0</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="10" md="10" lg="10" xl="10">
                  <p>Nombre de cours à faire</p>
                </v-col>
                <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                  <p>0</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

definePageMeta({
  middleware: ["auth"]
})

const showSetup2Fa = ref(false);

const { user } = storeToRefs(useUserStore());

const alertMsg = computed(() => {
  if (user.value.enabled2Fa) {
    return "Vous avez activé la double authentification, votre compte est maintenant plus sécurisé"
  } else {
    return "Vous n'avez pas activé la double authentification, votre compte est moins sécurisé, vous pouvez l'activer en cliquant ici"
  }
})
</script>