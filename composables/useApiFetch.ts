export default function (url: string, options: any) {
  const baseURL = 'http://localhost:8080'

  const accessToken = localStorage.getItem('access_token')

  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
      }
    }
  }

  return useFetch(baseURL+url, options)
}