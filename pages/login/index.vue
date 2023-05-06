<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="login-container d-flex flex-column align-center justify-center">
      <h1>Connexion</h1>
      <div class="w-100 d-flex flex-column justify-center mb-4">
        <v-text-field
          id="email-input"
          variant="outlined"
          prepend-inner-icon="at-outline"          
          :rules="[emailRules.required]"
          validate-on="blur"
          label="Email"
          v-model="email"
        ></v-text-field>
        <v-text-field
          id="password-input"
          variant="outlined"
          prepend-inner-icon="lock-outline"
          :append-inner-icon="showPassword ? 'eye-off-outline' : 'eye-outline'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[passwordRules.required]"
          validate-on="blur"
          label="Password"
          v-model="password"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-btn variant="tonal" @click="signIn">SE CONNECTER</v-btn>
      </div>
      <v-btn-group class="d-flex flex-row">
        <v-btn
          id="google-login-btn"
          prepend-icon="google"
          variant="tonal"
          @click="logViaGoogle"
          class="mr-2"
          >Google</v-btn
        >
        <v-btn
          id="linkedin-login-btn"
          prepend-icon="linkedin"
          variant="tonal"
          @click="logViaLinkedin"
          >Linkedin</v-btn
        >
      </v-btn-group>
      <p class="mt-4">
        Pas encore de compte ? <NuxtLink to="/signup">S'inscrire</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const emailRules = ref({
  required: value => !!value || "L'email est requis"
});
const passwordRules = ref({
  required: (value) => !!value || "Le mot de passe est requis"
});

async function signIn() {
  $event.$emit("show-snackbar", {
    message: "Connexion en cours...",
    loading: true,
  });
  return;

  await useApiFetch("/auth/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    },
  });
}

function logViaGoogle() {
  window.location.href = "http://localhost:8080/auth/google";
}

function logViaLinkedin() {
  window.location.href = "http://localhost:8080/auth/linkedin";
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  max-width: 350px;
  padding: 20px;
}
</style>