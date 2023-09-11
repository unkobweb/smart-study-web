export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  async function fetchUser() {
    const {data} = await useApiFetch('/auth/profile')
    user.value = data.value
  }

  const accessToken = ref('')
  function setAccessToken(token: string) {
    useCookie('access_token').value = token
    accessToken.value = token
  }

  const mfaToken = ref('')
  function setMfaToken(token: string) {
    mfaToken.value = token
  }

  // if accessToken deleted, delete user
  watch(accessToken, (token) => {
    if (!token) {
      user.value = null
    }
  })

  return { user, accessToken, setAccessToken, mfaToken, setMfaToken, fetchUser }
}, {
  persist: true
})
