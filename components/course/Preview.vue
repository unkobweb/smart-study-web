<template>
  <div class="course-container">
    <div class="mb-4 d-flex flex-row align-center justify-space-between">
      <h1>{{ course.title }} - {{ course.price/100 }}€</h1>
      <v-btn class="btnPrimary ml-4" @click="buyCourse">Acheter le cours</v-btn>
    </div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column">
        <video width="800" controls controlsList="nodownload" oncontextmenu="return false;">
          <source :src="course.video?.url" type="video/mp4">
          Your browser does not support HTML video.
        </video>
        <div class="d-flex flex-row mt-4">
          <NuxtLink class="cursor" v-for="courseJob in course.courseJobs" :key="courseJob.uuid" :to="`/job/${courseJob.job.uuid}`">
            <v-chip color="primary" class="mr-2 cursor" >
              {{ courseJob.job.name }}
            </v-chip>
          </NuxtLink>
        </div>
        <h2 class="mt-2">A propos de ce cours</h2>
        <p>{{ course.description }}</p>
      </div>
      <div class="ml-8">
        <h2>Plan du cours</h2>
        <v-expansion-panels multiple readonly v-model="expansion">
          <v-expansion-panel 
            v-for="part in course.courseParts" 
            :key="part.uuid" 
            :title="part.title"
            :value="part.uuid"
            expand-icon="none"
            collapse-icon="none"
          >
            <v-expansion-panel-text class="pa-0">
              <div class="chapter" v-for="chapter in part.courseChapters" :key="chapter.uuid">
                {{ chapter.title }}
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </div>  
</template>

<script setup>
const route = useRoute();

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})
const expansion = props.course.courseParts.map(cP => cP.uuid)

async function buyCourse() {
  const {data} = await useApiFetch(`/purchase/create-checkout-session`, {
    method: 'POST',
    body: {
      course: props.course.uuid
    }
  })
  // redirect to checkout page
  window.location.href = data.value
}
</script>