<template>
  <div>
    <!-- {{ purchases }}
    {{ course }} -->
    <CoursePreview v-if="purchases.length === 0" :course="course" />
    <CourseLearning v-else :course="course" />
  </div>
</template>

<script setup>
const route = useRoute();

const { data: course, error: courseError } = await useApiFetch(`/courses/${route.params.uuid}`);

const {data: purchases, error: purchaseError} = await useApiFetch(`/purchase/${route.params.uuid}`)

console.log("purchase :",purchases.value)
console.log("course :",course.value)
console.log("courseError :",courseError.value)
console.log("purchaseError :",purchaseError.value)

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