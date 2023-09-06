<template>
  <div class="jo">
    <h1>{{ jobData.name }}</h1>
    <div class="nb-offers">
      <p>Nombre d'offres mois précédent : 1254</p>
      <p>Variation mois précédent <span class="variation">-15</span></p>
      <p>{{ jobData.description }}</p>
    </div>
    <div class="graph" style="position: relative; height:40vh; width:80vw">
      <Bar :data="data" :options="options" />

      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Doughnut } from "vue-chartjs";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  components: {
    Bar,
    Doughnut,
  },
  async setup() {
    const {data: jobData} = await useApiFetch(`/jobs/${useRoute().params.uuid}`)
    return {jobData}
  },
  data() {
    return {
      jobName: 'Développeur',
      chartData: {
        labels: ["Autres", "Actual"],
        datasets: [
          {
            backgroundColor: ["#74C5A4", "#A7C7E6"],
            data: [86, 14],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      data: {
        labels: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Aout",
          "Septembre",
          "Octobre",
          "Novembre",
          "Decembre",
        ],
        datasets: [
          {
            label: "Salaire annuel moyen",
            data: [40, 20, 12, 40, 20, 12, 40, 20, 12, 40, 20, 12],
            backgroundColor: ["#90C6C9"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    };
  },
};
</script>