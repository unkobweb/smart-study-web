import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, custom } from '../iconsets/custom'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'custom',
      aliases,
      sets: {
        custom,
      },
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1976D2',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})