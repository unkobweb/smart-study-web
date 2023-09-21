<template>
  <div class="pa-5">
    <div class="d-flex w-50 ma-auto justify-center">
      <v-text-field
        variant="outlined"
        color="primary"
        append-inner-icon="search-outline"
        label="Rechercher un cours ou un métier"
        v-model="search"
        @input="() => debounceResarch(search)"
      >
      </v-text-field>
    </div>
    <h1 v-if="researched">Résultat pour la recherche : "{{ researched }}"</h1>
    <h1 class="mb-4">{{ courseTitle }}</h1>
    <div class="d-flex flex-row">
      <Course v-for="course in courses" :key="course.uuid" :course="course" />
    </div>
    <h1 class="my-4">{{ jobTitle }}</h1>
    <div class="d-flex flex-row">
      <Job v-for="job in jobs" :key="job.uuid" :job="job" />
    </div>
  </div>
</template>

<script setup>
import Meili from "meilisearch";

let Meilisearch;

if (Meili.default) {
  Meilisearch = Meili.default
} else {
  Meilisearch = Meili
}

const { MEILISEARCH_HOST } = useRuntimeConfig().public
const {data: MEILISEARCH_API_KEY} = await useApiFetch('/meilisearch-key')

const client = new Meilisearch({
  host: MEILISEARCH_HOST || process.env.MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY.value,
});

const courseTitle = computed(() => {
  if (researched.value) {
    return `Cours`
  }
  return "Les cours du moment"
})

const jobTitle = computed(() => {
  if (researched.value) {
    return `Métiers`
  }
  return "Les métiers tendances"
})

const researchedTimeout = ref(null)
const researched = ref("")
const search = ref("")
const courses = ref([])
const jobs = ref([])

async function fetchCourses(search) {
  const courseData = await client.index("course").search(search, {filter: 'isPublished=true'})
  courses.value = courseData.hits
}

async function fetchJobs(search) {
  const jobData = await client.index("job").search(search)
  jobs.value = jobData.hits
}

await fetchCourses("")
await fetchJobs("")

async function debounceResarch(search) {
  // if function is called again before 500ms, cancel the previous call
  clearTimeout(researchedTimeout.value)
  // set a new timeout
  researchedTimeout.value = setTimeout(() => {
    fetchCourses(search)
    fetchJobs(search)
    researched.value = search
  }, 500)
}
</script>