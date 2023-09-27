<template>
  <div class="w-100 h-75">
    <div class="d-flex flex-row pa-6 w-100 align-center">
      <v-card class="w-33 elevation-4 mr-8 h-75">
        <v-img height="150" :src="imgUrl" class="text-white" cover></v-img>
        <div class="pa-4">
          <h1 class="mb-4">{{ jobData.name }}</h1>
          <p class="mb-4">{{ jobData.description }}</p>
          <!-- <p>Mois : {{ lastMonthFormat }}</p> -->
          <h2 class="mb-4">Informations clés :</h2>
          <h3>Nombre d'offres d'emploi relevées : {{ filteredData.totalOffers }}</h3>
          <h3>
            Salaire moyen relevé : {{ parseInt(filteredData.averageSalary) }} M €
            Annuel
          </h3>
        </div>
      </v-card>
      <!-- <div class="nb-offers"></div> -->
      <div class="graph d-flex flex-column w-50 mt-n16" style="position: relative; height: 40vh; width: 80vw">
        <!-- Le barchart représente l'évolution du salaire proposé pour le poste sur les douzes derniers mois -->
        <h2>Salaires moyens</h2>
        <Bar :data="data" :options="options" />
        <!-- Le donut doit représenter le pourcentage d'offres liées au métier qu'on regarde sur la totalité des offres -->
        <h2>Répartition des offres</h2>
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
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
    const months = jobSalaryData.map((item: any) => {
      const date = new Date(item.month.split('T')[0])
      const labeldate = date.toLocaleString('default', { month: 'long', year: 'numeric' })
      // return capitalized 
      return labeldate.charAt(0).toUpperCase() + labeldate.slice(1)
    });
    
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
        maintainAspectRatio: false,
      },
    };
  },
};
</script>