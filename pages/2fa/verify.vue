<template> 
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="d-flex flex-row align-center">
      <div class="d-flex flex-column">
        <h1 class="mb-4">Double authentification</h1>
        <p class="mb-4">Inscrivez dans le champs ci-dessous le code fournis par votre application de double authentification</p>
        <OTP :digit-count="6" v-model="otp" :disabled="validating"/>
        <div v-if="message" class="d-flex flex-row align-center mt-4">
          <v-icon v-if="icon">{{ icon }}</v-icon>
          <v-progress-circular v-else indeterminate></v-progress-circular>
          <p class="ml-4">{{ message }}</p>
        </div>
      </div>
      <canvas class="ml-8" id="canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "empty",
})

const otp = ref(null);
const message = ref(null);
const icon = ref(null);

watch(otp, async (value) => {
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
    }, 2000)
  } else if (error.value?.statusCode === 400) {
    message.value = "Le code est invalide"
    icon.value = "close-outline"
  } else {
    message.value = "Une erreur est survenue"
    icon.value = "close-outline"
  }
}
</script>