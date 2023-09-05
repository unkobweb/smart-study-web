<template>
  <div class="pt-2 w-75">
    <div class="d-flex flex-row w-max w-100">
      <div class="d-flex flex-column w-100">
        <v-text-field
          variant="outlined"
          hide-details="auto"
          class="mb-4 ml-1"
          label="Titre du cours"
          density="compact"
          color="primary"
          v-model="title"
        ></v-text-field>
        <v-textarea
          variant="outlined"
          label="Description du cours"
          color="primary"
          class="mb-4 ml-1"
          v-model="description"
        ></v-textarea>
      </div>
      <div class="d-flex flex-column w-100 ml-4">
        <v-text-field
          variant="outlined"
          hide-details="auto"
          class="mb-4 ml-1"
          label="Prix du cours"
          density="compact"
          color="primary"
          type="number"
          v-model="price"
        ></v-text-field>
        <div class="d-flex flex-row mb-2">
          <h2>Miniature</h2>
          <v-btn v-if="course.thumbnail?.url" class="btnSecondary ml-2" @click="() => course.thumbnail = null">Changer la miniature</v-btn>
        </div>
        <div v-if="course.thumbnail?.url">
          <v-img
            :width="300"
            aspect-ratio="16/9"
            :src="course.thumbnail.url"
            cover
          ></v-img>
        </div>
        <v-file-input 
          v-else
          accept="image/*" 
          label="Image du cours"
          prepend-icon="image-outline"  
          @update:modelValue="handleUploadThumbnail"
        ></v-file-input>
      </div>
    </div>
    <v-btn class="btnPrimary " @click="updateCourse">Sauvegarder</v-btn>
  </div>  
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const price = ref(`${props.course.price}` ?? '0.00')
const title = ref(props.course.title)
const description = ref(props.course.description)

function updateCourse() {
  const { updateCourse } = useCourseStore()
  const newPrice = parseFloat(price.value.replace(',', '.'))
  updateCourse({uuid: props.course.uuid, title: title.value, description: description.value, price: newPrice})
}

async function handleUploadThumbnail(files) {
  const file = files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', `${props.course.uuid}/${file.name}`)
  const {data, error} = await useApiFetch('/media/upload', {
    method: 'POST',
    body: formData
  })
  const {data: updatedCourse} = await useApiFetch(`/courses/${props.course.uuid}`, {
    method: 'PATCH',
    body: {
      thumbnail: data.value.uuid
    }
  })
  props.course.thumbnail = updatedCourse.value.thumbnail
}

</script>