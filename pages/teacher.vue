<template>
  <div>
    <div class="w-100 d-flex flex-column justify-center mb-4">
      <v-form v-model="valid">
        <v-text-field
          id="course-title-input"
          variant="outlined"
          label="Titre"
          v-model="courseTitle"
          :rules="[titleRules.required]"
          hide-details="auto"
          density="compact"
          color="primary"
          class="mb-4"
        ></v-text-field>
        <v-btn class="w-100 btnPrimary" @click="addCourse"
          >Ajouter un cours</v-btn
        >
      </v-form>
    </div>
    <div class="w-100 d-flex flex-column justify-center mb-4">
      <h1>Tous vos cours</h1>
      <ul>
        <li v-for="course in courses" :key="course.id">{{ course.title }}</li>
      </ul>
      <button @click="getCourses">Actualiser</button>
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
const courseTitle = ref("");
let courses = ref([]);

const titleRules = ref({
  required: (value) => !!value || "Le titre est requis",
});

async function addCourse() {
  const { data, pending, error } = await useApiFetch("/courses", {
    method: "POST",
    body: {
      title: courseTitle.value,
    },
  });
  courseTitle.value = ""
}

async function getCourses() {
  console.log("inside");
  await useApiFetch("/courses", {
    method: "GET",
  }).then((res) => (courses.value = res.data.value));
}
</script>