<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" v-html="svg">
  </svg>
</template>

<script setup>
import * as eva from 'eva-icons';

const props = defineProps({
  tag: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  fill: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false
  },
})

const svg = ref(eva.icons[props.icon].contents)
</script>