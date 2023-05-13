<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div
      class="signup-container d-flex flex-column align-center justify-center"
    >
      <h1>Inscription</h1>
      <div class="w-100 d-flex flex-column justify-center mb-4">
        <v-form v-model="valid">
          <v-text-field
            id="email-input"
            variant="outlined"
            prepend-inner-icon="at-outline"
            label="Email"
            v-model="email"
            :rules="[emailRules.required, emailRules.reel]"
            validate-on="blur"
          ></v-text-field>

          <v-text-field
            id="password-input"
            variant="outlined"
            prepend-inner-icon="lock-outline"
            :append-inner-icon="
              showPassword ? 'eye-off-outline' : 'eye-outline'
            "
            :type="showPassword ? 'text' : 'password'"
            :rules="[passwordRules.required, passwordRules.length]"
            validate-on="blur"
            label="Password"
            v-model="password"
            @click:appendInner="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            id="password-input"
            variant="outlined"
            prepend-inner-icon="lock-outline"
            :append-inner-icon="
              showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
            "
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[samePassword.rule]"
            validate-on="blur"
            label="Confirm Password"
            v-model="confirmedPassword"
            @click:appendInner="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>
          <v-btn variant="tonal" @click="signUp">S'INSCRIRE</v-btn>
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
  rule: (value) =>
    password.value === value ||
    "Les deux mots de passe doivent être identiques",
});

async function signUp() {
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

  const token = useCookie("access_token");
  token.value = data.value.access_token;

  useRouter().push("/");
}
</script>

<style lang="scss" scoped>
.signup-container {
  width: 100%;
  max-width: 350px;
  padding: 20px;
}
</style>