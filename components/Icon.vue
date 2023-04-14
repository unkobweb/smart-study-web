<template>
  <i :data-eva="icon" :data-eva-fill="fill"></i>
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

onMounted(() => {
  eva.replace()
})
</script>