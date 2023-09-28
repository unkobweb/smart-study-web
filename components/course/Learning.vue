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
    <div class="pa-8 w-100 course-content" v-if="chapter">
      <div class="d-flex flex-row align-center justify-space-between mb-4">
        <h1>{{ chapter.title }}</h1>
        <v-btn color="primary" @click="() => completeChapter(!completed)">{{ completed ? "Marquer comme en cours" : "Marquer comme terminé" }}</v-btn>
      </div>
      <div class="d-flex flex-row w-100">
        <div class="d-flex flex-column align-center w-75 main-container">
          <video v-if="chapter.video" :key="chapter.uuid" controls controlsList="nodownload" oncontextmenu="return false;">
            <source :src="chapter.video.url" type="video/mp4">
            Your browser does not support HTML video.
          </video>
          <div v-else class="d-flex flex-column align-center mt-8">
            <v-icon icon="video-off-outline"></v-icon>
            <p>Aucune vidéo pour ce chapitre</p>
          </div>
          <div class="w-100 mt-8" :id="`editor${chapter.uuid}`" :key="chapter.uuid"></div>
          <div class="d-flex flex-column align-center" v-if="!chapter.description.blocks || chapter.description.blocks.length === 0">
            <v-icon icon="file-text-outline"></v-icon>
            <p>Aucune description pour ce chapitre</p>
          </div>
        </div>
        <div class="w-25 docs-container">
          <h2 class="mb-4">Documents</h2>
          <div class="d-flex flex-row flex-wrap" v-if="chapter.documents.length">
            <div class="document-container" v-for="doc in chapter.documents" :key="doc.uuid">
              <v-icon fill="#636e72" icon="file-text-outline"></v-icon>
              <p>{{ doc.name }}</p>
              <div class="d-flex flex-row align-center">
                <v-tooltip location="bottom" text="Voir le document">
                  <template v-slot:activator="{ props }">
                    <v-icon fill="#636e72" class="delete-doc mt-3" v-bind="props" icon="external-link-outline" @click="() => openDocument(doc)"></v-icon>
                  </template>
                </v-tooltip>
              </div>
            </div> 
          </div>
          <div class="d-flex flex-column align-center" v-else>
            <v-icon icon="file-remove-outline"></v-icon>
            <p>Aucun document pour ce chapitre</p>
          </div>
        </div>
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

function getFirstUncompletedChapter() {
  for (const part of props.course.courseParts) {
    for (const chapter of part.courseChapters) {
      if (chapter.userChapterCompletions.length === 0) {
        selectedPart.value = part.uuid
        selectedChapter.value = chapter.uuid
        return
      }
    }
  }
}

getFirstUncompletedChapter()

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

function openDocument(doc) {
  window.open(doc.url, '_blank')
}

const { $editor } = useNuxtApp()

onMounted(() => {
  watch(() => chapter.value, async (newChapter) => {
    if (!newChapter || !newChapter.description.blocks || newChapter.description.blocks.length === 0) return
    await $editor({id: `editor${newChapter.uuid}`, readOnly: true, data: newChapter.description})
  }, {immediate: true})
})
</script>

<style lang="scss">
.docs-container {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  height: fit-content;
  gap: 5px;
  .document-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    text-align: center;
    overflow-wrap: break-word;
    padding: 10px;
    aspect-ratio: 1/1;
    background-color: #fff;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      .delete-doc {
        opacity: 1;
      }
    }
    p {
      overflow-wrap: break-word;
      width: 100%;
    }
  }
}
.course-content {
  overflow: auto;
  height: calc(100vh - 60px) !important;
  max-height: calc(100vh - 60px) !important;
}
.main-container {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  margin-right: 10px;
  video {
    width: 100%;
    border-radius: 5px;
  }
}
.course-sidebar {
  overflow: auto;
  height: calc(100vh - 60px) !important;
  max-height: calc(100vh - 60px) !important;
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