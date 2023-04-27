<template>
  <div></div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
import jwt_decode from 'jwt-decode'

const route = useRoute()
const router = useRouter()

const {setUser} = useUserStore()

const accessToken = route.query.token

onMounted(() => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
    const decoded = jwt_decode(accessToken)
    setUser(decoded)
    router.push('/')
  } else {
    router.push('/login')
  }
})
</script>