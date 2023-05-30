<template>
  <div>
    <h1>Tout est à faire</h1>
  </div>  
</template>

<script setup>
import { storeToRefs } from "pinia";

// permet de s'assurer que l'utilisateur est bien connecté quant il arrive sur cette page
definePageMeta({
  middleware: ["auth"]
})

// permet de récupérer les données de l'utilisateur qui sont stockées dans le store
const { user } = storeToRefs(useUserStore());

</script>