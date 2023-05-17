<template>
  <div>
    {{ user || "pas user" }}
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "empty",
})

const { user } = storeToRefs(useUserStore());
</script>