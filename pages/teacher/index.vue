<template>
  <div>
    <div class="w-100 d-flex flex-column justify-center mb-4 pa-5">
      <div class="d-flex flex-row align-center justify-space-between mb-2">
        <h1>Tous vos cours</h1>
        <TeacherCreateCourse />
      </div>
      <div class="d-flex flex-row flex-wrap">
        <v-card
          @click="goToCourse(course.uuid)"
          class="mr-4 mb-4"
          width="400"
          v-for="course in courses"
          :key="course.id"
          elevation="4"
        >
          <v-img
            height="200"
            src="/default-course.png"
            class="text-white"
          ></v-img>
          <v-card-title class="d-flex flex-row justify-space-between w-100">
            <h4>{{ course.title }}</h4>
          </v-card-title>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

// permet de s'assurer que l'utilisateur est bien connecté quant il arrive sur cette page
definePageMeta({
  middleware: ["auth"],
});

// permet de récupérer les données de l'utilisateur qui sont stockées dans le store
const { user } = storeToRefs(useUserStore());
const { courses } = storeToRefs(useTeacherStore());

const { fetchUserCourses } = useTeacherStore();
await fetchUserCourses();

function goToCourse(courseUuid) {
  const router = useRouter();
  router.push(`/teacher/course/${courseUuid}`);
}
</script>