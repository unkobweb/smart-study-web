<template>
  <div>
    <div class="d-flex flex-row align-center my-8 ml-5">
      <p class="mr-2">Compteur composable: {{ counter }}</p>
      <v-btn @click="increment">Incrémenter</v-btn>
      <v-btn @click="decrement">Décrémenter</v-btn>
    </div>
    <div class="d-flex flex-row align-center my-8 ml-5">
      <p class="mr-10">Compteur du store: {{ counterStore.count }}</p>
      <v-btn @click="counterStore.increment">Incrémenter</v-btn>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from '~/stores/counter'
const props = defineProps(['startAt'])

const { counter, increment, decrement } = useCounter(props.startAt)
const counterStore = useCounterStore()
</script>
