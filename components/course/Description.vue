<template>
  <div class="pt-2">
    <v-text-field
      variant="outlined"
      hide-details="auto"
      class="mb-4 ml-1"
      label="Titre du cours"
      density="compact"
      color="primary"
      v-model="title"
    ></v-text-field>
    <v-textarea
      variant="outlined"
      label="Description du cours"
      color="primary"
      class="mb-4 ml-1"
      v-model="description"
    ></v-textarea>
    <v-btn class="btnPrimary " @click="updateCourse">Sauvegarder</v-btn>
  </div>  
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const title = ref(props.course.title)
const description = ref(props.course.description)

function updateCourse() {
  const { updateCourse } = useCourseStore()
  updateCourse({uuid: props.course.uuid, title: title.value, description: description.value})
}

</script>