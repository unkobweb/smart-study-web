<template>
  <div class="signup-page w-100 h-screen d-flex flex-column align-center justify-center">
    <div
      class="signup-container d-flex flex-column align-center justify-center"
    >
      <h2 class="w-100 mb-4">Inscription</h2>
      <div class="w-100 d-flex flex-column justify-center mb-4">
        <v-form v-model="valid">
          <v-text-field
            id="email-input"
            variant="outlined"
            prepend-inner-icon="at-outline"
            label="Email"
            v-model="email"
            :rules="[emailRules.required, emailRules.reel]"
            hide-details="auto"
            density="compact"
            color="primary"
            class="mb-4"
            validate-on="blur"
          ></v-text-field>

          <v-text-field
            id="password-input"
            variant="outlined"
            hide-details="auto"
            class="mb-4"
            prepend-inner-icon="lock-outline"
            :append-inner-icon="showPassword ? 'eye-off-outline' : 'eye-outline'"
            :type="showPassword ? 'text' : 'password'"
            :rules="[passwordRules.required, passwordRules.length]"
            validate-on="blur"
            label="Mot de passe"
            density="compact"
            color="primary"
            v-model="password"
            @click:appendInner="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            id="confirm-password-input"
            variant="outlined"
            hide-details="auto"
            class="mb-4"
            prepend-inner-icon="lock-outline"
            :append-inner-icon="showConfirmPassword ? 'eye-off-outline' : 'eye-outline'"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[samePassword.same, samePassword.required]"
            validate-on="blur"
            label="Confirmation du mot de passe"
            density="compact"
            color="primary"
            v-model="confirmedPassword"
            @click:appendInner="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>
          <v-btn class="w-100 btnPrimary" @click="signUp">S'inscrire</v-btn>
        </v-form>
      </div>
      <p class="mt-4">
        Déjà un compte ? <NuxtLink to="/login">Se connecter</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const userStore = useUserStore();

definePageMeta({
  layout: "empty",
})

const email = ref("");
const password = ref("");
const confirmedPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const valid = ref(false);
const emailRules = ref({
  required: (value) => !!value || "L'email est requis",
  reel: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "L'email n'est pas valide",
});
const passwordRules = ref({
  required: (value) => !!value || "Le mot de passe est requis",
  length: (value) =>
    (value && value.length >= 8) ||
    "Le mot de passe doit contenir au moins 8 caractères",
});

const samePassword = ref({
  required: (value) => !!value || "La confirmation du mot de passe est requise",
  same: (value) =>
    password.value === value ||
    "Les deux mots de passe doivent être identiques",
});

async function signUp() {
  if(valid.value == false) {
    return
  }
  $event.$emit("show-snackbar", {
    message: "Inscription en cours...",
    loading: true,
  });

  const { data, pending, error } = await useApiFetch("/auth/register", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
      confirmPassword: confirmedPassword.value,
    },
  });

  $event.$emit("show-snackbar", {
    message: "Inscription réussie !",
    type: "success",
  });

  userStore.setAccessToken(data.value.token);
  await userStore.fetchUser();

  useRouter().push("/");
}
</script>

<style lang="scss" scoped>
.signup-page {
  background-color: #F3F5FF;
}
.signup-container {
  width: 100%;
  max-width: 350px;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

a {
  color: #0984e3;
}
</style>