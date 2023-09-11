  export const useCourseStore = defineStore('course', () => {
    
    const course = ref()
  
    async function fetchCourseDetails(uuid: string) {
      const { data, pending, error } = await useApiFetch(`/courses/${uuid}`);
      course.value = data.value
    }

    async function updateCourse(payload: any) {
      const { data, pending, error } = await useApiFetch(`/courses/${payload.uuid}`, {
        method: 'PATCH',
        body: payload
      });
      // @ts-ignore
      course.value = {...course.value, ...data.value}
    }

    async function createPart(title: string, courseUuid: string) {
      const { data, pending, error } = await useApiFetch(`/course-part`, {
        method: 'POST',
        body: {
          title,
          course: courseUuid
        }
      });
      if (course.value.uuid === courseUuid) {
        course.value.courseParts.push(data.value)
      }
    }

    async function createChapter(title: string, coursePartUuid: string) {
      const { data, pending, error } = await useApiFetch(`/course-chapter`, {
        method: 'POST',
        body: {
          title,
          coursePart: coursePartUuid
        }
      });
      // if one coursePart is in this course, add the chapter to it
      const coursePart = course.value.courseParts.find((part: any) => part.uuid === coursePartUuid)
      if (coursePart) {
        if (!coursePart.courseChapters) {
          coursePart.courseChapters = []
        }
        course.value.courseParts.find((part: any) => part.uuid === coursePartUuid).courseChapters.push(data.value)
      }
    }

    async function updateChapter(chapter: any, partUuid: string) {
      const { data, pending, error } = await useApiFetch(`/course-chapter/${chapter.uuid}`, {
        method: 'PATCH',
        body: chapter
      });

      // if PartUuid is the same as the one in the course, update the chapter
      const coursePart = course.value.courseParts.find((part: any) => part.uuid === partUuid)
      if (coursePart) {
        // @ts-ignore
        const chapterIndex = coursePart.courseChapters.findIndex((chapter: any) => chapter.uuid === data.value.uuid)
        coursePart.courseChapters[chapterIndex] = data.value
      }
    }

    return { course, fetchCourseDetails, createPart, createChapter, updateChapter, updateCourse }
  }, {
    persist: true
  })
  