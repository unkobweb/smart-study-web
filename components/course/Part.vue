<template>
  <v-expansion-panel
    :title="part.title"
    expand-icon="arrow-ios-forward-outline"
    collapse-icon="arrow-ios-downward-outline"
  >
    <v-expansion-panel-text class="pa-4">
      <div v-if="part.courseChapters.length === 0" class="d-flex flex-column align-center justify-center">
        <h2>Aucun chapitre</h2>
        <v-btn class="btnPrimary" @click="() => createChapter(`Chapitre ${part.courseChapters.length+1}`, part.uuid)">Créer mon premier chapitre</v-btn>
      </div>
      <div v-else>
        <v-btn class="btnPrimary">Ajouter un chapitre</v-btn>
        <v-expansion-panels>
          <CourseChapter v-for="chapter in part.courseChapters" :key="chapter.uuid" :chapter="chapter" :partUuid="part.uuid" />
        </v-expansion-panels>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
const props = defineProps({
  part: {
    type: Object
  }
})

</script>