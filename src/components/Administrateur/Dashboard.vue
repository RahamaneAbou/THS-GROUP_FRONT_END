<template>
    <div class="dashboard">
      <h1>Tableau de bord</h1>
      <div class="stats">
        <div class="stat-box">
          <h3>Nombre d'étudiants</h3>
          <p>{{ studentsCount }}</p>
        </div>
        <div class="stat-box">
          <h3>Nombre de professeurs</h3>
          <p>{{ teachersCount }}</p>
        </div>
        <div class="stat-box">
          <h3>Nombre de cours</h3>
          <p>{{ coursesCount }}</p>
        </div>
      </div>
      <div class="charts">
        <h2>Graphiques</h2>
        <canvas id="studentsChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from "chart.js/auto";
  
  export default {
    name: "Dashboard",
    data() {
      return {
        studentsCount: 500,
        teachersCount: 50,
        coursesCount: 100,
      };
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = document.getElementById("studentsChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Filière A", "Filière B", "Filière C"],
            datasets: [
              {
                label: "Nombre d'étudiants",
                data: [150, 200, 150],
                backgroundColor: "#ffcc00", // Jaune
              },
            ],
          },
          options: {
            responsive: true,
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .stat-box {
    background-color: #003366; /* Bleu foncé */
    color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  
  .charts {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
  }
  </style>