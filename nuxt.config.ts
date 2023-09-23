// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '~/assets/style/main.scss',
  ],

  build: {
    transpile: [
      'vuetify',
      'meilisearch',
      ({ isDev }) => {
        console.log('isDev', isDev)
        return !isDev && 'eva-icons'
      },
    ],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://localhost:8080',
      MEILISEARCH_HOST: process.env.MEILISEARCH_HOST || 'http://localhost:7700'
    }
  },


  imports: {
    dirs: [
      './stores'
    ]
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },

  devtools: {
    enabled: false
  }
})
