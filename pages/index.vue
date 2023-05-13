<template>
  <div>
    <h1>Bonjour {{ user }}</h1>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const user = ref('bonjour')

// const {user, fetchUser} = useUserStore()

// await fetchUser()
</script>