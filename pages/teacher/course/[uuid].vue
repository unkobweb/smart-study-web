<template>
  <div class="wysiwyg">
    <h1>{{ course }}</h1>
    <p>{{ course.description }}</p>
    <div ref="editorContainer"></div>
    <button @click="save">Sauvegarder</button>
  </div>
</template>
<script setup>
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import CodeBox from "@bomdi/codebox";
import NestedList from "@editorjs/nested-list";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

const route = useRoute();
const editorContainer = ref(null);

const { course } = storeToRefs(useCourseStore());

const { fetchCourseDetails } = useCourseStore();

function save() {
  editor
    .save()
    .then((outputData) => {
      console.log("Article data: ", outputData);
    })
    .catch((error) => {
      console.log("Saving failed: ", error);
    });
}

await fetchCourseDetails(route.params.uuid);

let editor;

onMounted(async () => {
  editor = new EditorJS({
    holder: editorContainer.value,
    placeholder: "Commencez à écrire...",
    tools: {
      header: {
        class: Header,
        inlineToolbar: ["link"],
        config: {
          placeholder: "Ajouter un titre",
          levels: [1, 2, 3, 4],
          defaultLevel: 2,
        },
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "http://localhost:8080/course-chapter/upload", // Your backend file uploader endpoint
          },
          field: "file",
          additionalRequestData: {},
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      orderedList: {
        class: NestedList,
        inlineToolbar: true,
        config: {
          defaultStyle: "ordered",
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      codeBox: {
        class: CodeBox,
        config: {
          themeURL:
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css", // Optional
          themeName: "atom-one-dark", // Optional
          useDefaultTheme: "light", // Optional. This also determines the background color of the language select drop-down
        },
      },
    },
  });
});
</script>
