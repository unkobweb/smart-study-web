<template>
  <div class="w-100 h-screen d-flex align-center justify-center">
    <div class="error w-50 pa-4 rounded-lg">
      <img src="/error.jpg" alt="">
      <div class="d-flex flex-row align-center">
        <h1>{{ error.statusCode === 404 ? "Désolé, cette page n'existe pas.." : "Aïe, une erreur est survenue" }}</h1>
      </div>
      <v-btn class="btnPrimary mt-4" @click="handleError">Retourner à l'accueil</v-btn>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  error: Object
})

console.log(props.error)

const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="scss">
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10vh;

  img {
    max-height: 40vh;
    width: auto;
    height: auto;
  }
}
</style>