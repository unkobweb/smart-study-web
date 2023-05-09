export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  async function fetchUser() {
    const {data} = await useApiFetch('/profile')
    user.value = data.value
  }

  return { user, fetchUser }
})
