import { AsyncData } from "nuxt/app"

export default function (url: string, options: any = {}) {
  const baseURL = 'http://localhost:8080'

  const accessToken = useCookie('access_token')

  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`
      }
    }
  }

  return useFetch(baseURL+url, options).then(({data, error, refresh, pending}: any) => {
    if (error.value && error.value.statusCode === 401) {
      accessToken.value = null
      const router = useRouter()
      router.push('/login')
    }
    return {data, error, refresh, pending}
  })
}