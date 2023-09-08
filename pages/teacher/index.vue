<template>
  <div>
    <div class="w-100 d-flex flex-column justify-center mb-4 pa-5">
      <div class="d-flex flex-row align-center justify-space-between mb-2">
        <h1>Tous vos cours</h1>
        <TeacherCreateCourse />
      </div>
      <div class="d-flex flex-row flex-wrap">
        <Course v-for="course in courses" :key="course.uuid" :course="course"/>
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
</script>