<template>
  <div>
    <div @click="openFileInput" class="edit-overlay d-flex align-center justify-center" :class="!editable ? 'd-none' : ''">
      <v-icon fill="#c8d6e5">edit-outline</v-icon>
    </div>
    <img class="profile-picture" v-if="imgUrl" :src="user.profilePicture?.url ?? '/default.jpg'" alt="">
    <v-file-input class="fileinput" ref="inputfile" @update:modelValue="handleUpload"></v-file-input>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
})

const { user } = storeToRefs(useUserStore());

const imgUrl = ref('default.jpg')

const inputfile = ref(null)
const openFileInput = () => {
  if (props.editable) {
    inputfile.value.click()
  }
}

const handleUpload = async (e) => {
  if (e.length === 0) return
  const formData = new FormData()
  formData.append('file', e[0])
  formData.append('key', user.value.uuid)
  const {data, error} = await useApiFetch('/media/upload', {
    method: 'POST',
    body: formData
  })
  if (error.value) {
    console.log(error)
    useSnackbar('Une erreur est survenue', {type: 'error'})
  } else {
    try {
      await useApiFetch('/user/'+user.value.uuid, {
        method: 'PATCH',
        body: {
          profilePicture: data.value.uuid
        }
      })
      await useUserStore().fetchUser()
      useSnackbar('Votre photo de profil a été mise à jour', {type: 'success'})
    } catch (error) {
      useSnackbar('Une erreur est survenue', {type: 'error'})
    }
  }
}
</script>

<style lang="scss" scoped>
.d-none {
  display: none !important;
}
.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.edit-overlay {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.5);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
}

.fileinput {
  display: none;
}
</style>