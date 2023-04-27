<template>
  <div>
    <h1>Bonjour {{ user }}</h1>
    <!-- <v-text-field label="Label" append-inner-icon="alert-triangle-outline"></v-text-field>
      <v-btn
        class="ma-2"
        color="primary"
      >
        Accept
        <v-icon
          end
          icon="alert-circle"
          fill="white"
        ></v-icon>
      </v-btn> -->
    <Counter :startAt="10" />
    <Counter :startAt="5" />
    <Counter />
    <Test :monProps="10" />
    <v-text-field label="Label" prepend-icon="activity-outline"></v-text-field>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const test = ref('bonjour')
const {user} = useUserStore()

</script>