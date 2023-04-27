<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <h1>Add input for credentials login</h1>
    <v-btn-group class="d-flex flex-row">
      <v-btn prepend-icon="google" variant="tonal" @click="logViaGoogle" class="mr-2">Google</v-btn>
      <v-btn prepend-icon="linkedin" variant="tonal" @click="logViaLinkedin">Linkedin</v-btn>
    </v-btn-group>
  </div>
</template>

<script setup>
// TODO : Add input for credentials login
/**
 *  Creer deux refs (email et password) qui seront liée au v-model des inputs
 *  Créer deux inputs (composant vuetify) avec petit placeholder, des icons seront les bienvenues (nous utilisons celles là : https://akveo.github.io/eva-icons/#/)
 *  Créer une fonction qui check que les deux valeures sont bien renseigné (si une valeur manque, affichez celle en question dans un "alert" (natif javascript))
 *  Cette fonction doit être appelée au click sur un bouton (du coup faut créer ce nouveau bouton)
 *  C'est déjà très bien d'être aller jusque là, on verra la suite ensemble
 */


function logViaGoogle() {
  window.location.href = "http://localhost:8080/auth/google"
}

function logViaLinkedin() {
  window.location.href = "http://localhost:8080/auth/linkedin"
}
</script>