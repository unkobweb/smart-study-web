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
        <h2>Vidéo</h2>
        <p>Ajoutez une vidéo pour ce chapitre</p>
        <v-file-input
          accept="video/*" 
          label="Vidéo du chapitre"
          prepend-icon="film-outline"
        ></v-file-input>
        <h2>Documents</h2>
        <p>Ajoutez des documents qui peuvent servir de ressource aux élèves pour ce chapitre</p>
        <v-file-input multiple prepend-icon="file-outline" label="Documents du chapitres" @update:modelValue="handleUploadDocuments"></v-file-input>
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

const title = ref()

const { createChapter, createPart, updateChapter } = useCourseStore();
const { $editor, $event } = useNuxtApp()

const selected = ref()
let editor

let partUuid

async function handleUploadDocuments(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', `${props.course.uuid}/${selected.value.uuid}/${file.name}`)
    console.log('Store at :', `${props.course.uuid}/${selected.value.uuid}/${file.name}`)
    const {data, error} = await useApiFetch('/course-chapter/upload', {
      method: 'POST',
      body: formData
    })
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
      updateChapter({uuid: selected.value, title: title.value, description: data}, partUuid)
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
</script>

<style lang="scss">
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