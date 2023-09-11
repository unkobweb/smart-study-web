export const useTeacherStore = defineStore('teacher', () => {
  const courses = ref([])

  async function fetchUserCourses() {
    const { data } = await useApiFetch("/courses/me")
    courses.value = data.value
  }

  async function createCourse(title: string) {
    const { data, pending, error } = await useApiFetch("/courses", {
      method: "POST",
      body: {
        title: title,
      },
    });
    courses.value.push(data.value)
  }

  return { courses, fetchUserCourses, createCourse }
}, {
  persist: true
})
