<template>
  <div class="login-page w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="login-container d-flex flex-column align-center justify-center">
      <h2 class="w-100 mb-4">Connexion</h2>
      <div class="d-flex flex-column w-100">
        <v-btn
          class="social-btn btnSecondary mb-2"
          id="google-login-btn"
          prepend-icon="googleColored"
          @click="logViaGoogle"
          >Google</v-btn
        >
        <v-btn
          class="social-btn btnSecondary"
          id="linkedin-login-btn"
          prepend-icon="linkedinColored"
          @click="logViaLinkedin"
          >LinkedIn</v-btn
        >
      </div>
      <div class="d-flex flex-row align-center my-4 w-100">
        <v-divider></v-divider>
        <span class="mx-1">ou</span>
        <v-divider></v-divider>
      </div>
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
            density="compact"
            color="primary"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            :append-inner-icon="showPassword ? 'eye-off-outline' : 'eye-outline'"
            :type="showPassword ? 'text' : 'password'"
            @click:appendInner="showPassword = !showPassword"
            id="password-input"
            variant="outlined"
            prepend-inner-icon="lock-outline"
            label="Mot de passe"
            v-model="password"
            :rules="[passwordRules.required]"
            hide-details="auto"
            validate-on="blur"
            density="compact"
            color="primary"
            class="mb-4"
          ></v-text-field>
          <v-btn class="w-100 btnPrimary" @click="signIn">Se connecter</v-btn>
        </v-form>
      </div>
      <p class="mt-4">
        Pas encore de compte ? <NuxtLink to="/signup">S'inscrire</NuxtLink>
      </p>
    </div>
    <v-dialog persistent v-model="showMfaVerify" max-width="500">
      <MfaVerify @close="showMfaVerify = false" />
    </v-dialog>
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const userStore = useUserStore();

definePageMeta({
  layout: "empty",
})

const route = useRoute();

const showMfaVerify = ref(!!route.query.mfatoken);

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

  if (data.value.token && data.value.type === "2fa") {
    userStore.setMfaToken(data.value.token);
    showMfaVerify.value = true;
    return;
  } 

  userStore.setAccessToken(data.value.token); 
  await userStore.fetchUser();
  useRouter().push({ path: "/" });
}

function logViaGoogle() {
  window.location.href = "http://localhost:8080/auth/google";
}

function logViaLinkedin() {
  window.location.href = "http://localhost:8080/auth/linkedin";
}
</script>

<style lang="scss" scoped>
.login-page {
  background-color: #F3F5FF;
}
.login-container {
  width: 100%;
  max-width: 350px;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.social-btn {
  width: 100%;
  height: auto;
  padding: 10px;
}

a {
  color: #0984e3;
}
</style>