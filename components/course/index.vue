<template>
  <v-card
    @click="goToCourse(course.uuid)"
    class="mr-4 mb-4"
    width="400"
    elevation="4"
  >
    <v-img
      height="200"
      :src="course.thumbnail?.url ?? course.thumbnail ?? '/default-course.png'"
      class="text-white"
      cover
    ></v-img>
    <v-card-title class="d-flex flex-row justify-space-between w-100">
      <h4>{{ course.title }}</h4>
      <p>{{ course.price/100 }}€</p>
    </v-card-title>
  </v-card>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  isTeacher: {
    type: Boolean,
    default: false,
  },
});

function goToCourse(courseUuid) {
  const router = useRouter();
  if (props.isTeacher) router.push(`/teacher/course/${courseUuid}`);
  else router.push(`/course/${courseUuid}`);
}
</script>