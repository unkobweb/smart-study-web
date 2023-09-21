<template>
  <svg :fill="fill" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" v-html="svgContent"></svg>
</template>

<script setup>
import * as eva from 'eva-icons';
console.log({eva, icons: eva.icons, default: eva.default});

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  fill: {
    type: String,
    required: false
  },
});

const icons = {
  googleColored: {
    viewBox: "0 0 48 48",
    content: `<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>`
  },
  linkedinColored: {
    viewBox: "0 0 48 48",
    content: `<path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"/><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"/>`
  },
  key: {
    viewBox: "0 0 24 24",
    content: `<path d="M 7 5 C 3.134 5 0 8.134 0 12 C 0 15.866 3.134 19 7 19 C 10.170669 19 12.846171 16.890989 13.707031 14 L 18 14 L 18 17 L 22 17 L 22 14 L 24 14 L 24 10 L 13.707031 10 C 12.846171 7.1090112 10.170669 5 7 5 z M 7 9 C 8.657 9 10 10.343 10 12 C 10 13.657 8.657 15 7 15 C 5.343 15 4 13.657 4 12 C 4 10.343 5.343 9 7 9 z">`
  }
}

const viewBox = ref("0 0 24 24");
const svgContent = ref(null);

watch(() => props.icon, async () => {
  if (props.icon === 'none') {
    viewBox.value = "0 0 24 24";
    svgContent.value = null;
    return;
  }
  if (eva.icons[props.icon]?.contents) {
    viewBox.value = "0 0 24 24";
    svgContent.value = eva.icons[props.icon].contents;
  } else if (icons[props.icon]) {
    const icon = icons[props.icon];
    viewBox.value = icon.viewBox;
    svgContent.value = icon.content
  } else {
    viewBox.value = "0 0 24 24";
    svgContent.value = eva.icons["alert-triangle"].contents;
    // console.error(`Icon ${props.icon} not found`);
  }
}, {immediate: true});
</script>