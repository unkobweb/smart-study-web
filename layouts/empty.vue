<template>
  <v-app>
    <slot />
    <Snackbar />
  </v-app>
</template>

<script setup>
useSeoMeta({
  title: "Smart Study",
  description: "Smart Study"
})
</script>