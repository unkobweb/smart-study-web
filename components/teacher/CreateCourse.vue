<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
      transition="dialog-bottom-transition"
      @update:modelValue="handleEvent"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="btnPrimary"
          v-bind="props"
        >
          <template v-slot:prepend>
            <v-icon fill="white">plus</v-icon>
          </template>
          Créer un cours
        </v-btn>
      </template>

      <v-card class="pa-5">
        <h2 class="mb-4">Créer un nouveau cours</h2>
        <v-form v-model="valid">
          <v-text-field
            id="course-title-input"
            variant="outlined"
            label="Titre du cours"
            v-model="courseTitle"
            :rules="[titleRules.required]"
            hide-details="auto"
            density="compact"
            color="primary"
            class="mb-4"
          ></v-text-field>

        </v-form>
        <v-card-actions class="d-flex flex-row justify-end pr-0">
          <v-btn @click="dialog = false">Annuler</v-btn>
          <v-btn class="btnPrimary" @click="addCourse">Créer le cours</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const dialog = ref(false);
const courseTitle = ref("");

const titleRules = ref({
  required: (value) => !!value || "Le titre est requis",
});

function handleEvent(value) {
  if (value === false) {
    courseTitle.value = "";
  }
}

const { createCourse } = useTeacherStore();

async function addCourse() {
  await createCourse(courseTitle.value)
  courseTitle.value = ""
}
</script>