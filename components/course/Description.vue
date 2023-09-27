<template>
  <div class="pt-2 w-100">
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
        <v-autocomplete
          variant="outlined"
          density="compact"
          color="primary"
          class="ml-1"
          label="Métiers liés au cours"
          menu-icon="arrow-ios-downward-outline"
          clearable
          clear-icon="close-outline"
          no-data-text="Aucun métier trouvé"
          :items="jobs"
          item-title="name"
          item-value="uuid"
          multiple
          v-model="courseJobs"
        >
          <template v-slot:chip={item}>
            <v-chip
              class="ma-1"
              label
              outlined
              small
            >
              {{ item.title }}
              <v-icon @click.stop="() => removeJob(item.value)" class="cursor" icon="close-outline"></v-icon>
            </v-chip>
          </template>
          <template v-slot:item="{item, props}">
            <v-list-item 
              v-bind="props"
              :title="item.title"
              :prepend-icon="courseJobs.includes(item.value) ? 'checkmark-square-2-outline' : 'square-outline'"
            >
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-textarea
          variant="outlined"
          label="Description du cours"
          color="primary"
          class="mb-4 ml-1"
          v-model="description"
        ></v-textarea>
      </div>
      <div class="d-flex flex-column w-100 ml-4">
        <div class="d-flex flex-column mb-2">
          <div class="d-flex flex-row">
            <h2>Miniature</h2>
            <v-btn v-if="course.thumbnail?.url" class="btnSecondary ml-2" @click="() => course.thumbnail = null">Changer la miniature</v-btn>
          </div>
          <p>Cette image sera affiché sur la page d'accueil pour présenter votre cours</p>
        </div>
        <div v-if="course.thumbnail?.url">
          <v-img
            :width="300"
            aspect-ratio="16/9"
            :src="course.thumbnail.url"
            cover
          ></v-img>
        </div>
        <div v-else class="thumbnail-upload-container" @click="chooseImage">
          <v-icon fill="#636e72" icon="image-outline"></v-icon>
          <p>Cliquez ici pour ajouter une miniature à votre cours</p>
        </div>
        <v-file-input 
          class="d-none"
          ref="imageInput"
          accept="image/*" 
          label="Image du cours"
          prepend-icon="image-outline"  
          @update:modelValue="handleUploadThumbnail"
        ></v-file-input>
      </div>
      <div class="d-flex flex-column w-100 ml-4">
        <div class="d-flex flex-column mb-2">
          <div class="d-flex flex-row">
            <h2>Vidéo de présentation</h2>
            <v-btn v-if="course.video" class="btnSecondary ml-2" @click="() => course.video = null">Changer la vidéo</v-btn>
          </div>
          <p>Cette vidéo sera montrée sur la page de votre cours pour présenter votre cours</p>
        </div>
        <div v-if="course.video?.url">
          <video width="400" controls controlsList="nodownload" oncontextmenu="return false;">
            <source :src="course.video?.url" type="video/mp4">
            Your browser does not support HTML video.
          </video>
        </div>
        <div v-else class="thumbnail-upload-container" @click="chooseVideo">
          <v-icon fill="#636e72" icon="video-outline"></v-icon>
          <p>Cliquez ici pour ajouter une vidéo de présentation à votre cours</p>
        </div>
        <v-file-input 
          class="d-none"
          ref="videoInput"
          accept="video/*" 
          label="Image du cours"
          prepend-icon="image-outline"  
          @update:modelValue="handleUploadVideo"
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

const courseJobs = ref(props.course.courseJobs.map(cJ => cJ.job.uuid))

const {data: jobs} = await useApiFetch('/jobs')

function removeJob(uuid) {
  courseJobs.value = courseJobs.value.filter(job => job !== uuid)
}

const videoInput = ref()
const imageInput = ref()

const price = ref(props.course.price ? `${props.course.price/100}` : '0.00')
const title = ref(props.course.title)
const description = ref(props.course.description)

function updateCourse() {
  const { updateCourse } = useCourseStore()
  const newPrice = parseFloat(price.value.replace(',', '.'))
  updateCourse({uuid: props.course.uuid, title: title.value, description: description.value, price: Math.floor(newPrice*100), jobs: courseJobs.value})
}

function chooseImage() {
  imageInput.value.click()
}

function chooseVideo() {
  videoInput.value.click()
}

async function handleUploadVideo(files) {
  if (!files.length) return
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
      video: data.value.uuid
    }
  })
  props.course.video = updatedCourse.value.video
}

async function handleUploadThumbnail(files) {
  if (!files.length) return
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

<style lang="scss">
.cursor {
  cursor: pointer;
}
.thumbnail-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
}
</style>