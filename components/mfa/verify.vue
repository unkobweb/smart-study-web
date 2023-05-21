<template>
  <v-card class="pa-8 rounded-lg d-flex align-center">
    <v-icon size="x-large" fill="#1976D2">key</v-icon>
    <h2>Double authentification</h2>
    <div class="d-flex flex-row align-center">
      <div class="d-flex flex-column align-center">
        <p class="text-center subtitle mb-6">Inscrivez le code donné par votre application de double authentification</p>
        <!-- <test /> -->
        <OTP :digit-count="6" v-model="otp" :disabled="validating"/>
        <div v-if="message" class="d-flex flex-row align-center mt-4">
          <v-icon v-if="icon">{{ icon }}</v-icon>
          <v-progress-circular v-else indeterminate></v-progress-circular>
          <p class="ml-2">{{ message }}</p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const otp = ref(null);
const message = ref(null);
const icon = ref(null);

watch(otp, async (value) => {
  message.value = null;
  icon.value = null;
  if (value.length === 6) {
    await verify()
  }
})

async function verify() {
  message.value = "Validation en cours...";
  icon.value = null;

  const {data, error} = await useApiFetch("/auth/2fa/verify", {
    method: "POST",
    body: {
      jwt: useUserStore().mfaToken,
      token: otp.value
    }
  });

  if (data.value?.token) {
    message.value = "Identité vérifiée"
    icon.value = "checkmark-outline"
    useUserStore().setAccessToken(data.value.token)
    await useUserStore().fetchUser()
    setTimeout(() => {
      useRouter().push("/")
    }, 1000)
  } else if (error.value?.statusCode === 400) {
    message.value = "Le code est invalide"
    icon.value = "close-outline"
  } else {
    message.value = "Une erreur est survenue"
    icon.value = "close-outline"
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 14px;
}
</style>