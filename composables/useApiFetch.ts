export default async function (url: string, options: any = {}) {
  options.baseURL = 'http://localhost:8080'

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
  
  if (error.value && error.value.statusCode === 401) {
    accessToken.value = null
    router.push('/login')
  }
  
  return {data, error, refresh, pending}
}