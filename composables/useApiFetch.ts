import { storeToRefs } from "pinia"

export default async function (url: string, options: any = {}) {
  const config = useRuntimeConfig()

  options.baseURL = config.API_URL

  const accessToken = useCookie('access_token')

  if (accessToken.value) {
    options = {
      ...options,
      
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`
      }
    }
  }

  const router = useRouter()

  const {data, error, refresh, pending} = await useFetch(url, options)
  
  if (error.value) {
    if (error.value.statusCode === 401) {
      router.push('/login')
    } else {
      createError(error.value)
    }
  }
  
  return {data, error, refresh, pending}
}