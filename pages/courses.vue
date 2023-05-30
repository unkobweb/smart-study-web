<template>
  <div class="d-flex flex-column align-center justify-center">
    <img src="/no-courses.jpg" alt="">
    <h1>Vous n'avez acheté aucun cours</h1>
    <NuxtLink to="/">
      <v-btn class="btnPrimary mt-4">Allez sur la place de marché</v-btn>
    </NuxtLink>
  </div>
</template>

<script setup>

const courses = ref([])

</script>

<style lang="scss" scoped>
img {
  max-height: 40vh;
  width: auto;
  height: auto;
}
</style>