<template>
  <div class="wysiwyg">
    <h1>WYSIWYG</h1>
    <div ref="editorContainer"></div>
    {{ course }}
  </div>
</template>
<script setup>
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

const route = useRoute()
const editorContainer = ref(null);

const { course } = storeToRefs(useCourseStore());

onMounted(async() => {
  

const { fetchCourseDetails } = useCourseStore();
await fetchCourseDetails(route.params.uuid);
//   const editor = new EditorJS({
//     holder: editorContainer.value,
//     placeholder: "Commencez à écrire...",
//     tools: {
//       header: {
//         class: Header,
//         inlineToolbar: ["link"],
//         config: {
//           placeholder: "Ajouter un titre",
//           levels: [1, 2, 3, 4],
//           defaultLevel: 2,
//         },
//       },
//     },
//   }); // <div>
});
</script>
