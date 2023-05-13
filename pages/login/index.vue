<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="login-container d-flex flex-column align-center justify-center">
      <h1>Connexion</h1>
      <div class="w-100 d-flex flex-column justify-center mb-4">
        <v-form v-model="valid">
          <v-text-field
            id="email-input"
            variant="outlined"
            prepend-inner-icon="at-outline"
            :rules="[emailRules.required]"
            validate-on="blur"
            hide-details="auto"
            label="Email"
            v-model="email"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            :append-inner-icon="showPassword ? 'eye-off-outline' : 'eye-outline'"
            :type="showPassword ? 'text' : 'password'"
            @click:appendInner="showPassword = !showPassword"
            id="password-input"
            variant="outlined"
            prepend-inner-icon="lock-outline"
            label="Password"
            v-model="password"
            :rules="[passwordRules.required]"
            hide-details="auto"
            validate-on="blur"
            class="mb-4"
          ></v-text-field>
          <v-btn class="w-100" variant="tonal" @click="signIn">SE CONNECTER</v-btn>
        </v-form>
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
const valid = ref(false);
const emailRules = ref({
  required: (value) => !!value || "L'email est requis",
});
const passwordRules = ref({
  required: (value) => !!value || "Le mot de passe est requis",
});

function showFunc() {
  console.log("show");
}

async function signIn() {
  if(valid.value == false) {
    return
  }
  $event.$emit("show-snackbar", {
    message: "Connexion en cours...",
    loading: true,
  });

  const { data, error } = await useApiFetch("/auth/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    },
  });

  if (
    error.value &&
    (error.value.statusCode === 401 || error.value.statusCode === 400)
  ) {
    $event.$emit("show-snackbar", {
      message: "Identifiants incorrects",
      type: "error",
    });

    return;
  }

  $event.$emit("show-snackbar", {
    message: "Connexion réussie !",
    type: "success",
  });

  useCookie("access_token").value = data.value.access_token;
  useRouter().push("/");
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