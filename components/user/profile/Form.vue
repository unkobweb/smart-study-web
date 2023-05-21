<template>
  <div>
    <div class="d-flex justify-center mb-2">
      <UserProfilePictureUpload :editable="true" />
    </div>
    <h3 class="mb-5">Informations personnelles</h3>
    <v-row class="ml-1 mr-5">
      <v-text-field
        variant="outlined"
        hide-details="auto"
        class="mb-4 mr-1"
        prepend-inner-icon="person-outline"
        label="Prénom"
        density="compact"
        color="primary"
        v-model="firstName"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        hide-details="auto"
        class="mb-4 ml-1"
        prepend-inner-icon="person-outline"
        label="Nom"
        density="compact"
        color="primary"
        v-model="lastName"
      ></v-text-field>
    </v-row>
    <v-text-field
      variant="outlined"
      hide-details="auto"
      class="mb-4 ml-1 mr-5 mt-2"
      prepend-inner-icon="at-outline"
      label="Email"
      density="compact"
      color="primary"
      disabled
      v-model="email"
    ></v-text-field>
    <h3 class="mb-5">Date de naissance</h3>
    <v-row class="ml-1 mr-5 d-flex flex-row align-center">
      <v-text-field
        variant="outlined"
        hide-details="auto"
        prepend-inner-icon="calendar-outline"
        label="Jour"
        class="mb-4 mr-1"
        density="compact"
        color="primary"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        hide-details="auto"
        prepend-inner-icon="calendar-outline"
        label="Mois"
        class="mb-4 mr-1"
        density="compact"
        color="primary"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        hide-details="auto"
        class="mb-4 mr-1"
        prepend-inner-icon="calendar-outline"
        label="Année"
        density="compact"
        color="primary"
      ></v-text-field>
    </v-row>
    <h3 class="mb-2 mt-2">Localisation</h3>
    <v-autocomplete
      variant="outlined"
      hide-details="auto"
      class="mb-4 ml-1 mr-6"
      prepend-inner-icon="pin-outline"
      label="Code postal"
      density="compact"
      :items="cities"
      color="primary"
      v-model="city"
      v-model:search="citySearch"
      :hide-no-data="city"
      :no-data-text="citySearch ? `Aucune ville trouvée correspondant au code postal '${citySearch}'` : 'Entrez un code postal'"
      :append-inner-icon="null"
    >
    </v-autocomplete>
    <v-btn class="btnPrimary ml-1">
      Appliquer
    </v-btn>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import codesPostaux from 'codes-postaux'; 

const city = ref(null);
const cities = ref([]);
const citySearch = ref(null);

watch(() => citySearch.value, () => {
  const findCities = codesPostaux.find(citySearch.value)
  cities.value = findCities.map(city => city.codePostal + ', ' + city.libelleAcheminement)
})

const { user } = storeToRefs(useUserStore());

const email = ref(user.value?.email);
const firstName = ref(user.value?.firstName);
const lastName = ref(user.value?.lastName);
</script>