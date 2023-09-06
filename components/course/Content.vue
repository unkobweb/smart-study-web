<template>
  <div class="d-flex flex-row justify-space-between">
    <div class="fit-content">
      <v-expansion-panels>
        <v-expansion-panel 
          v-for="part in course.courseParts" 
          :key="part.uuid" 
          :title="part.title"
          expand-icon="arrow-ios-forward-outline"
          collapse-icon="arrow-ios-downward-outline"
          @group:selected="clear"
        >
          <v-expansion-panel-text class="pa-0">
            <div class="chapter" :class="selected === chapter.uuid ? 'selected' : ''" @click="() => {select('chapter', chapter); partUuid = part.uuid}" v-for="chapter in part.courseChapters" :key="chapter.uuid">
              {{ chapter.title }}
            </div>
            <div class="chapter" @click="() => createChapter(`Chapitre ${(part.courseChapters?.length ?? 0)+1}`, part.uuid)">
              <v-icon icon="plus-outline" />
              Créer un chapitre
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-btn class="btnSecondary mt-4" @click="() => createPart(`Partie ${course.courseParts.length+1}`,course.uuid)">
          <v-icon icon="plus-outline" />
          Créer une partie
        </v-btn>

        <!-- <CoursePart v-for="part in course.courseParts" :key="part.uuid" :part="part" /> -->
      </v-expansion-panels>
    </div>
    <div class="d-flex flex-row side-container ml-8" v-if="selected">
      <div class="d-flex flex-column doc-container">
        <div class="d-flex flex-row align-center">
          <h2>Vidéo</h2>
          <v-btn v-if="selectedChapter.video" class="btnSecondary ml-2" @click="chooseVideo">Changer la vidéo</v-btn>
        </div>
        <p v-if="!selectedChapter.video">Ajoutez une vidéo pour ce chapitre</p>
        <div v-if="!selectedChapter.video" class="video-upload-container" @click="chooseVideo">
          <v-icon icon="video-outline"></v-icon>
          <p>Cliquez ici pour ajouter une vidéo</p>
        </div>
        <div class="mt-2" v-else>
          <video width="400" controls controlsList="nodownload" oncontextmenu="return false;">
            <source :src="selectedChapter.video.url" type="video/mp4">
            Your browser does not support HTML video.
          </video>
        </div>
        <v-file-input
          class="d-none"
          ref="videoInput"
          accept="video/*" 
          label="Vidéo du chapitre"
          prepend-icon="film-outline"
          @update:modelValue="handleUploadVideo"
        ></v-file-input>
        <h2 class="mt-4">Documents</h2>
        <p>Ajoutez des documents qui peuvent servir de ressource aux élèves pour ce chapitre</p>
        <div class="document-grid">
          <div class="document-container" v-for="doc in selectedChapter.documents" :key="doc.uuid">
            <v-icon fill="#636e72" icon="file-text-outline"></v-icon>
            <p>{{ doc.name }}</p>
            <div class="d-flex flex-row align-center">
              <v-tooltip location="bottom" text="Voir le document">
                <template v-slot:activator="{ props }">
                  <v-icon fill="#636e72" class="delete-doc mt-3" v-bind="props" icon="external-link-outline" @click="() => openDocument(doc)"></v-icon>
                </template>
              </v-tooltip>
              <v-tooltip location="bottom" text="Supprimer le document">
                <template v-slot:activator="{ props }">
                  <v-icon fill="#ff7675" class="delete-doc mt-2 ml-2" v-bind="props" icon="trash-2-outline" @click="() => deleteDocument(doc)"></v-icon>
                </template>
              </v-tooltip>
            </div>
          </div> 
          <div class="document-upload-container" @click="chooseDocument">
            <v-icon icon="plus-circle-outline"></v-icon>
            <p>Ajouter un ou plusieurs documents</p>
          </div>
          <v-file-input ref="documentInput" class="d-none" multiple prepend-icon="file-outline" label="Documents du chapitres" @update:modelValue="handleUploadDocuments"></v-file-input>
        </div>
      </div>
      <div class="text-container ml-8">
        <v-text-field
          variant="outlined"
          hide-details="auto"
          class="mb-4"
          label="Titre du chaptire"
          density="compact"
          color="primary"
          v-model="title"
          @update:modelValue="handleUploadDocuments"
        ></v-text-field>
        <div id="editorContainer"></div>
        <v-btn class="btnPrimary" @click="updateItem">Sauvegarder</v-btn>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object
  }
})

const videoInput = ref()
const documentInput = ref()

const selectedChapter = computed(() => {
  if (selected.value) {
    return props.course.courseParts.find(cP => cP.uuid === partUuid.value).courseChapters.find(cC => cC.uuid === selected.value)
  }
  return null
})

const title = ref()

const { createChapter, createPart, updateChapter } = useCourseStore();
const { $editor, $event } = useNuxtApp()

const selected = ref()
let editor

const partUuid = ref()

async function chooseVideo() {
  videoInput.value.click()
}

async function chooseDocument() {
  documentInput.value.click()
}

async function openDocument(doc) {
  window.open(doc.url, '_blank')
}

async function deleteDocument(doc) {
  $event.$emit("show-snackbar", {
    message: "Suppression du document en cours...",
    loading: true
  });
  const {data, error} = await useApiFetch(`/media/${doc.uuid}`, {
    method: 'DELETE'
  })
  if (error.value) {
    $event.$emit("show-snackbar", {
      message: "Problème lors de la suppression du document",
      type: "error",
    });
  } else {
    $event.$emit("show-snackbar", {
      message: "Document supprimé !",
      type: "success",
    });
    const chapter = props.course.courseParts.find(cP => cP.uuid === partUuid.value).courseChapters.find(cC => cC.uuid === selected.value)
    chapter.documents = chapter.documents.filter(d => d.uuid !== doc.uuid)
  }
}

async function handleUploadDocuments(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    formData.append('courseChapter', selected.value)
    const {data, error} = await useApiFetch('/course-chapter/upload', {
      method: 'POST',
      body: formData
    })
    // add document to chapter
    if (data) {
      const chapter = props.course.courseParts.find(cP => cP.uuid === partUuid.value).courseChapters.find(cC => cC.uuid === selected.value)
      if (!chapter.documents) {
       chapter.documents = [] 
      }
      chapter.documents.push(data.value)
    }
    console.log(data, error)
  }
}

async function handleUploadVideo(files) {
  $event.$emit("show-snackbar", {
    message: "Téléversement de la vidéo en cours...",
    // type: "success",
    loading: true
  });
  const file = files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('filename', file.name)
  formData.append('courseChapter', selected.value)
  formData.append('isVideo', true)
  const {data, error} = await useApiFetch('/course-chapter/upload', {
    method: 'POST',
    body: formData
  })
  if (error.value) {
    $event.$emit("show-snackbar", {
      message: "Problème lors du téléversement de la vidéo",
      type: "error",
    });
  } else {
    $event.$emit("show-snackbar", {
      message: "Vidéo téléversée !",
      type: "success",
    });
    const chapter = props.course.courseParts.find(cP => cP.uuid === partUuid.value).courseChapters.find(cC => cC.uuid === selected.value)
    chapter.video = data.value
  }
}

function clear(val) {
  if (!val.value) {
    selected.value = null
    title.value = null
    if (editor && editor.destroy) {
      editor.destroy()
    }
  }
}

async function updateItem() {
  if (selected.value) {
    editor.save().then(data => {
      updateChapter({uuid: selected.value, title: title.value, description: data}, partUuid.value)
      $event.$emit("show-snackbar", {
        message: "Chapitre mis à jour !",
        type: "success",
      });
    }).catch(err => {
      console.log(err)
      $event.$emit("show-snackbar", {
        message: "Impossible de sauvegarder le chapitre",
        type: "error",
      });
    })
  }
}

async function select(type, object) {
  selected.value = object.uuid
  title.value = object.title
  if (editor && editor.destroy) {
    editor.destroy()
  }
  if (type === 'chapter') {
    editor = await $editor({id: "editorContainer", data: object.description ?? {}, onChange: () => {}})
  }
}

// watch selected
watch(() => selected.value, async () => {
  console.log(selected.value)
})
</script>

<style lang="scss">
.document-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.delete-doc {
  opacity: 0;
  outline: none;
  cursor: pointer;
}
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
  background-color: #f5f5f5;
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
.video-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
}
.document-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  text-align: center;
  padding: 10px;
  aspect-ratio: 1/1;
  background-color: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
}
.fit-content {
  width: fit-content;
  min-width: 10vw;
  max-width: 400px;
}
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
.chapter {
  padding: 12px 50px;
  &:hover, &.selected {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}
.side-container {
  margin-right: 20%;
  margin: auto;
}
.text-container {
  min-width: 40vw;
  background-color: #f5f5f5;
  padding: 50px;
  border-radius: 20px;
}
.doc-container {
  min-width: 20vw;
}
</style>