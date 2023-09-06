<template>
  <div class="ma-8">
    <div class="d-flex flex-row align-center justify-space-between mb-4">
      <h1 class="mr-4">{{ course.title }}</h1>
      <v-btn v-if="!course.isPublished" class="btnSecondary" @click="publishCourse">Publier le cours</v-btn>
      <div v-else class="d-flex flex-row align-center">
        <v-icon fill="#2ecc71" icon="checkmark-circle-outline"></v-icon>
        <p class="mb-0 pb-0 ml-2">Cours publié</p>
      </div>
    </div>
    <v-tabs
      v-model="tab"
      class="mb-4"
    >
      <v-tab value="one">Description du cours</v-tab>
      <v-tab value="two">Contenu du cours</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="one">
        <CourseDescription :course="course"/>
      </v-window-item>
      <v-window-item value="two">
        <CourseContent :course="course"/>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

const tab = ref("one")
const route = useRoute();

const { course } = storeToRefs(useCourseStore());
const { fetchCourseDetails } = useCourseStore();

await fetchCourseDetails(route.params.uuid);

async function publishCourse() {
  await useApiFetch(`/courses/${course.value.uuid}`, {
    method: 'PATCH',
    body: {
      isPublished: true
    }
  })
}
</script>
