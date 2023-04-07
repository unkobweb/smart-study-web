<template>
  <i :data-eva="icon" :key="key"></i>
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
  disabled: {
    type: Boolean,
    required: false
  },
})

onMounted(() => {
  eva.replace()
})
</script>