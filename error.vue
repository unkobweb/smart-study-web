<template>
  <div class="w-100 h-screen d-flex align-center justify-center">
    <div class="error w-50 pa-4 rounded-lg">
      <div class="d-flex flex-row align-center"><h1>Une erreur est survenue</h1><v-spacer></v-spacer><h1>{{ error.statusCode }}</h1></div>
      {{ error }}
      <button @click="handleError">Clear errors</button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  error: Object
})
const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="scss">
.error {
  background-color: #dfe6e9;
}
</style>