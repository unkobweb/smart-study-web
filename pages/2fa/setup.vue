<template>
  <div class="w-100 h-screen d-flex flex-column align-center justify-center">
    <div class="d-flex flex-row align-center">
      <div class="d-flex flex-column">
        <h1 class="mb-4">Mise en place de la double authentification</h1>
        <p class="mb-2">1 - Scannez le QR Code via une application de double authentification (Authy, Google Authenticator, etc.)</p>
        <p class="mb-4">2 - Inscrivez dans le champs ci-dessous le code fournis par votre application de double authentification</p>
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
  </div>
</template>

<script setup>
import QRCode from "qrcode";

definePageMeta({
  middleware: ["auth"]
})

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
    console.log('success!');
  })
})
</script>