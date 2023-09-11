<template>
  <v-expansion-panel
    :title="chapter.title"
    expand-icon="arrow-ios-forward-outline"
    collapse-icon="arrow-ios-downward-outline"
    @group:selected="opened"
  >
    <v-expansion-panel-text class="pa-4">
      <div id="editorContainer"></div>
      <v-btn class="btnPrimary" @click="save">Sauvegarder</v-btn>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
const props = defineProps({
  chapter: {
    type: Object
  },
  partUuid: {
    type: String
  }
})

const { updateChapter } = useCourseStore()

let editor

function save() {
  editor.save().then(data => {
    updateChapter({...props.chapter, description: data}, props.partUuid)
  }).catch(err => {
    console.log(err)
  })
}

async function opened(opened) {
  const { $editor } = useNuxtApp()
  editor = await $editor({id: "editorContainer", data: props.chapter.description ?? {}, onChange: () => {}})
}
</script>