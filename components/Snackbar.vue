<template>
  <v-snackbar
    v-model="snackbar.show"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
    id="snackbar"
    variant="tonal"
  >
    <div class="d-flex flex-row align-center">
      <div v-if="snackbar.loading">
        <v-progress-circular :size="24" class="mr-4" indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <v-icon class="mr-4" :fill="snackbar.color" :icon="snackbar.icon"></v-icon>
      </div>
      {{ snackbar.message }}
    </div>
  </v-snackbar>
</template>

<script setup>
const {$event} = useNuxtApp()

const defaultSnackbar = () => ({
  show: false,
  loading: false,
  message: '',
  icon: 'info-outline',
  iconColor:  'white',
  color: "#54a0ff",
  timeout: 3000
})

const typeIcon = {
  success: {iconColor: '#1dd1a1', color: "#10ac84", icon: 'checkmark-outline'},
  error: {iconColor: 'red', color: "#ff6b6b", icon: 'close-outline'},
  info: {iconColor: 'white', color: "#54a0ff", icon: 'info-outline'}
}

const snackbar = ref(defaultSnackbar())

$event.$on('show-snackbar', (payload) => {
  // close snackbar
  snackbar.value = {
    ...defaultSnackbar(),
    timeout: payload.loading ? -1 : 3000,
    message: payload.message,
    loading: !!payload.loading,
    ...(payload.loading ? {} : typeIcon[payload.type]),
    show: true,
  }
})
</script>