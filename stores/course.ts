  export const useCourseStore = defineStore('course', () => {
    
    const course = ref()
  
    async function fetchCourseDetails(uuid: string) {
      console.log(uuid)
      const { data, pending, error } = await useApiFetch(`/courses/${uuid}`);
      console.log(data.value)
      console.log(error.value)
      course.value = data.value
    }

    return { course, fetchCourseDetails }
  }, {
    persist: true
  })
  