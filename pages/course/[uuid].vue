<template>
  <div>
    <CoursePreview v-if="purchases.length === 0" :course="course" />
    <CourseLearning v-else :course="course" />
  </div>
</template>

<script setup>
const route = useRoute();

const { data: course } = await useApiFetch(`/courses/${route.params.uuid}`);

const {data: purchases} = await useApiFetch(`/purchase/${route.params.uuid}`)
</script>

<style lang="scss">
.course-container {
  max-width: 1200px;
  margin: 20px auto;
}
.cursor:hover {
  cursor: pointer !important;
}
</style>