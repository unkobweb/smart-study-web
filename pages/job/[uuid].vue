<template>
  <div class="jo">
    <v-img height="200" :src="imgUrl" class="text-white" cover></v-img>

    <h1 class="text-center">{{ jobData.name }}</h1>
    <div class="d-flex justify-space-around">
      <v-card width="600px">
        <p>Mois : {{ lastMonthFormat }}</p>
        <p>
          Nombre d'offres d'emploi relevées : {{ filteredData.totalOffers }}
        </p>
        <p>
          Salaire moyen relevé : {{ parseInt(filteredData.averageSalary) }} M €
          Annuel
        </p>
      </v-card>
      <v-card width="600px">
        <p>{{ jobData.description }}</p>
      </v-card>
    </div>

    <div class="nb-offers"></div>
    <div class="graph" style="position: relative; height: 40vh; width: 80vw">
      <!-- Le barchart représente l'évolution du salaire proposé pour le poste sur les douzes derniers mois -->
      <Bar :data="data" :options="options" />
      <!-- Le donut doit représenter le pourcentage d'offres liées au métier qu'on regarde sur la totalité des offres -->
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
    const jobUuid = useRoute().params.uuid;
    const { data: jobData } = await useApiFetch(`/jobs/${jobUuid}`);
    const { data: jobSalariesData } = await useApiFetch(
      `/job-salaries/${jobUuid}`
    );
    
    // @ts-ignore
    const [jobSalaryData, otherJobs] = jobSalariesData.value

    let lastMonth = new Date().setMonth(new Date().getMonth() - 1);
    let year = new Date(lastMonth).getFullYear();
    let month = new Date(lastMonth).getMonth() + 1;
    let lastMonthFormat = year + "-" + month.toString().padStart(2, "0");
    
    const filteredData = jobSalaryData.find((item: any) =>
      item.month.startsWith(lastMonthFormat)
    );
    
    const averageSalaries = jobSalaryData.map((item: any) => parseInt(item.averageSalary));
    const months = jobSalaryData.map((item: any) => parseInt(item.month));
    
    
    const donutData = [otherJobs.totalOffers, filteredData.totalOffers]

    const imgUrl =
      "/jobs/" +
      // @ts-ignore
      jobData.value.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/ /g, "_") +
      ".jpg";

    return { jobData, jobSalaryData, donutData, imgUrl, lastMonthFormat, filteredData, averageSalaries, months};
  },
  data() {
    return {
      jobName: "Développeur",
      chartData: {
        labels: ["Autres", this.jobData.name],
        datasets: [
          {
            backgroundColor: ["#74C5A4", "#A7C7E6"],
            data: this.donutData,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Salaire annuel moyen",
            data: this.averageSalaries,
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