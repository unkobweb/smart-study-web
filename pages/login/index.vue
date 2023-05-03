<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="login-container d-flex flex-column align-center justify-center">
      <h1>Connexion</h1>
      <div class="w-100 d-flex flex-column justify-center mb-4">
        <v-text-field id="email-input" variant="outlined" prepend-inner-icon="at-outline" label="Email" v-model="email"></v-text-field>
        <v-text-field id="password-input" variant="outlined" prepend-inner-icon="lock-outline" label="Password" v-model="password"></v-text-field>
        <v-btn variant="tonal" @click="signIn">SE CONNECTER</v-btn>
      </div>
      <v-btn-group class="d-flex flex-row">
        <v-btn id="google-login-btn" prepend-icon="google" variant="tonal" @click="logViaGoogle" class="mr-2">Google</v-btn>
        <v-btn id="linkedin-login-btn" prepend-icon="linkedin" variant="tonal" @click="logViaLinkedin">Linkedin</v-btn>
      </v-btn-group>
      <p class="mt-4">Pas encore de compte ? <NuxtLink to="/signup">S'inscrire</NuxtLink></p>
    </div>
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
const email = ref("")
const password = ref("")

async function signIn() {
  if(email.value == "" ) {
    alert('Veillez renseigner une adresse email dans la zone')
  }
  if(password.value == "") {
    alert('Veillez renseigner une adresse email dans la zone')
  }
  await useApiFetch('/auth/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    }
  })
}

function logViaGoogle() {
  window.location.href = "http://localhost:8080/auth/google"
}

function logViaLinkedin() {
  window.location.href = "http://localhost:8080/auth/linkedin"
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  max-width: 350px;
  padding: 20px;
}
</style>