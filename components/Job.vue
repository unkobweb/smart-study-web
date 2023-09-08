<template>
  <v-card
    @click="goToJob(job.uuid)"
    class="mr-4 mb-4"
    width="400"
    elevation="4"
  >
    <v-img
      height="200"
      :src="imgUrl"
      class="text-white"
      cover
    ></v-img>
    <v-card-title class="d-flex flex-row justify-space-between w-100">
      <h4>{{ job.name }}</h4>
    </v-card-title>
  </v-card>  
</template>

<script setup>
const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const imgUrl = computed(() => {
  // remove accent, lowercase and replace spaces by _ from the title and add .jpg
  const img = props.job.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, "_") + '.jpg'
  return '/jobs/' + img
})

function goToJob(jobUuid) {
  const router = useRouter();
  router.push(`/job/${jobUuid}`);
}
</script>