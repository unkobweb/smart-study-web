import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import CodeBox from "@bomdi/codebox";
import NestedList from "@editorjs/nested-list";


export default defineNuxtPlugin((nuxtApp) => {
  const defaultOptions = {
    id: '',
    data: {},
    onChange: () => {},
  }

  const editor = (options = defaultOptions) => {
    return new EditorJS({
      holder: options.id,
      data: options.data || {},
      onChange(data) {
        // pass in function from component to run on change
        options.onChange(data)
      },
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
  };

  nuxtApp.provide('editor', options => editor(options));
})