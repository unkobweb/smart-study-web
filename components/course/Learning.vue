<template>
  <div class="d-flex flex-row">
    <div class="course-sidebar elevation-6">
      <v-expansion-panels multiple v-model="opened">
        <v-expansion-panel 
          v-for="part in course.courseParts" 
          :key="part.uuid" 
          :value="part.uuid"
          elevation="0"
          class="pa-0"
        >
          <v-expansion-panel-title
          expand-icon="none"
          collapse-icon="none"
          >
            <div class="d-flex flex-row align-center">
              <v-progress-circular
                v-if="getPartCompletionPercent(part.uuid) < 100 && getPartCompletionPercent(part.uuid) > 0"
                :rotate="360"
                :size="30"
                width="5"
                :model-value="getPartCompletionPercent(part.uuid)"
                color="green"
              ></v-progress-circular>
              <v-icon v-if="getPartCompletionPercent(part.uuid) === 100" fill="#2ecc71" icon="checkmark-outline"></v-icon>
              <h3 class="ml-4">{{ part.title }}</h3>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <div class="chapter" :class="chapter.uuid === selectedChapter ? 'active' : ''" v-for="chapter in part.courseChapters" :key="chapter.uuid" @click="() => setSelectedChapter(part.uuid, chapter.uuid)">
              <v-icon v-if="isChapterCompleted(part.uuid, chapter.uuid)" fill="#2ecc71" icon="checkmark-outline"></v-icon>
              {{ chapter.title }}
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="pa-8 w-100" v-if="chapter">
      <div class="d-flex flex-row align-center justify-space-between">
        <h1>{{ chapter.title }}</h1>
        <v-btn color="primary" @click="() => completeChapter(!completed)">{{ completed ? "Ne pas marquer comme terminé" : "Marquer comme terminé" }}</v-btn>
      </div>
      <div>
        <video v-if="chapter.video" :key="chapter.uuid" width="800" controls controlsList="nodownload" oncontextmenu="return false;">
          <source :src="chapter.video.url" type="video/mp4">
          Your browser does not support HTML video.
        </video>
        <div :id="`editor${chapter.uuid}`" :key="chapter.uuid"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const opened = ref([])

onMounted(() => {
  opened.value = props.course.courseParts.map(cP => cP.uuid)
})

const selectedPart = ref(null)
const selectedChapter = ref(null)

const chapter = computed(() => {
  if (!selectedPart.value || !selectedChapter.value) return null
  return props.course.courseParts.find(cP => cP.uuid === selectedPart.value).courseChapters.find(cC => cC.uuid === selectedChapter.value)
})
const completed = computed(() => {
  if (!chapter.value) return false
  return chapter.value.userChapterCompletions.length > 0
})

function getPartCompletionPercent(partUuid) {
  const part = props.course.courseParts.find(cP => cP.uuid === partUuid)
  const completedChapters = part.courseChapters.filter(cC => cC.userChapterCompletions.length > 0)
  return Math.round((completedChapters.length / part.courseChapters.length) * 100)
}

function setSelectedChapter(partUuid, chapterUuid) {
  selectedPart.value = partUuid
  selectedChapter.value = chapterUuid
}

function isChapterCompleted(partUuid, chapterUuid) {
  return props.course.courseParts.find(cP => cP.uuid === partUuid).courseChapters.find(cC => cC.uuid === chapterUuid).userChapterCompletions.length > 0
}

async function completeChapter(completed) {
  const {data} = await useApiFetch(`/course-chapter/${chapter.value.uuid}/complete`, {
    method: 'PATCH',
    body: {
      completed
    }
  })
  if (completed) {
    props.course.courseParts.find(cP => cP.uuid === selectedPart.value).courseChapters.find(cC => cC.uuid === selectedChapter.value).userChapterCompletions.push(data.value)
  } else {
    props.course.courseParts.find(cP => cP.uuid === selectedPart.value).courseChapters.find(cC => cC.uuid === selectedChapter.value).userChapterCompletions = []
  }
}

const { $editor } = useNuxtApp()

watch(() => chapter.value, async (newChapter) => {
  if (!newChapter || !newChapter.description.blocks || newChapter.description.blocks.length === 0) return
  await $editor({id: `editor${newChapter.uuid}`, readOnly: true, data: newChapter.description})
})
</script>

<style lang="scss">
.course-sidebar {
  height: calc(100vh - 60px) !important;
  width: 25vw;
  min-width: 300px;
  max-width: 400px;
}
.chapter {
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  &.active {
    background-color: #f5f5f5;
  }
}
.v-expansion-panel-text.pa-0 .v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
.v-expansion-panel--active + .v-expansion-panel {
  margin-top: 0 !important;
}
.v-expansion-panel-title {
  background-color: #fff !important;
  opacity: 1 !important;
}
</style>