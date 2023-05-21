<template>
  <v-card class="pa-8 rounded-lg">
    <h2 class="mb-6">Mise en place de la double authentification</h2>
    <v-icon class="close-icon" @click="$emit('close')">close-outline</v-icon>
    <div class="d-flex flex-row align-center">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row mb-2">
          <v-avatar color="primary" class="mr-2 mt-1" size="x-small">1</v-avatar>
          <p>Scannez le QR Code via une application de double authentification (Authy, Google Authenticator, etc.)</p>
        </div>
        <div class="d-flex flex-row mb-4">
          <v-avatar color="primary" class="mr-2 mt-1" size="x-small">2</v-avatar>
          <p>Inscrivez dans le champs ci-dessous le code fournis par votre application de double authentification</p>
        </div>
        <!-- <test /> -->
        <OTP :digit-count="6" v-model="otp" :disabled="validating"/>
        <div v-if="message" class="d-flex flex-row align-center mt-4">
          <v-icon v-if="icon">{{ icon }}</v-icon>
          <v-progress-circular v-else indeterminate></v-progress-circular>
          <p class="ml-4">{{ message }}</p>
        </div>
      </div>
      <canvas class="ml-8" id="canvas"></canvas>
    </div>
  </v-card>
</template>

<script setup>
import QRCode from "qrcode";

const otp = ref(null);
const message = ref(null);
const icon = ref(null);

watch(otp, async (value) => {
  message.value = null;
  icon.value = null;
  if (value.length === 6) {
    await validOTP()
  }
})

async function validOTP() {
  message.value = "Validation en cours...";
  icon.value = null;

  const {data, error} = await useApiFetch("/auth/2fa/setup/verify", {
    method: "POST",
    body: {
      token: otp.value
    }
  });

  if (data.value?.enabled2Fa) {
    message.value = "La double authentification a été activée"
    icon.value = "checkmark-outline"
    useUserStore().fetchUser()
    setTimeout(() => {
      useRouter().push({ path : "/profile" })
    }, 2000)
  } else if (error.value?.statusCode === 400) {
    message.value = "Le code est invalide"
    icon.value = "close-outline"
  } else {
    message.value = "Une erreur est survenue"
    icon.value = "close-outline"
  }
}

const {data, error} = await useApiFetch("/auth/2fa/setup", {
  method: "POST",
});

onMounted(() => {
  QRCode.toCanvas(document.getElementById("canvas"), data.value.qrCodeUrl, function (error) {
    if (error) console.error(error)
  })
})
</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 1rem;
  cursor: pointer;
}
</style>