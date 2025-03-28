<template>
    <div class="admin-dashboard">
      <!-- Sidebar (Menu fixe) -->
      <aside class="sidebar">
        <h2 class="dashboard-title">Tableau de bord</h2>
        <nav class="menu">
          <!-- Boutons au lieu de router-link -->
          <button @click="selectComponent('Dashboard')" class="menu-item">Dashboard</button>
          <button @click="selectComponent('UsersManagement')" class="menu-item">Gestion des utilisateurs</button>
          <button @click="selectComponent('StudentsManagement')" class="menu-item">Gestion des étudiants</button>
          <button @click="selectComponent('TeachersManagement')" class="menu-item">Gestion des professeurs</button>
          <button @click="selectComponent('CoursesManagement')" class="menu-item">Gestion des cours</button>
          <button @click="selectComponent('PromotionsManagement')" class="menu-item">Gestion des promotions/filières</button>
          <button @click="selectComponent('ExamsManagement')" class="menu-item">Gestion des examens</button>
          <button @click="selectComponent('FinancialManagement')" class="menu-item">Gestion financière</button>
          <button @click="selectComponent('SystemSettings')" class="menu-item">Paramètres du système</button>
          <button @click="selectComponent('Reports')" class="menu-item">Rapports et exports</button>
          <button @click="selectComponent('Support')" class="menu-item">Support et assistance</button>
          <button @click="selectComponent('Customization')" class="menu-item">ersonnalisation</button>
        </nav>
      </aside>
  
      <!-- Main Content (Partie blanche où les composants s'affichent) -->
      <main class="content">
        <!-- Affichage conditionnel avec v-if -->
        <Dashboard v-if="currentComponent === 'Dashboard'" />
        <UsersManagement v-if="currentComponent === 'UsersManagement'" />
        <StudentsManagement v-if="currentComponent === 'StudentsManagement'" />
        <TeachersManagement v-if="currentComponent === 'TeachersManagement'" />
        <CoursesManagement v-if="currentComponent === 'CoursesManagement'" />
        <PromotionsManagement v-if="currentComponent === 'PromotionsManagement'" />
        <ExamsManagement v-if="currentComponent === 'ExamsManagement'" />
        <FinancialManagement v-if="currentComponent === 'FinancialManagement'" />
        <SystemSettings v-if="currentComponent === 'SystemSettings'" />
        <Reports v-if="currentComponent === 'Reports'" />
        <Support v-if="currentComponent === 'Support'" />
        <Customization v-if="currentComponent === 'Customization'" />
      </main>
    </div>
  </template>
  
  <script>
  // Importez tous les composants nécessaires
  import Dashboard from "../components/Administrateur/Dashboard.vue";
  import UsersManagement from "../components/Administrateur/Users-Management.vue";
  import StudentsManagement from "../components/Administrateur/StudentsManagement.vue";
  import TeachersManagement from "../components/Administrateur/TeachersManagement.vue";
  import CoursesManagement from "../components/Administrateur/CoursesManagement.vue";
  import PromotionsManagement from "../components/Administrateur/PromotionsManagement.vue";
  import ExamsManagement from "../components/Administrateur/ExamsManagement.vue";
  import FinancialManagement from "../components/Administrateur/FinancialManagement.vue";
  import SystemSettings from "../components/Administrateur/SystemSettings.vue";
  import Reports from "../components/Administrateur/Reports.vue";
  //import Support from "../components/Administrateur/Support.vue";
  import Customization from "../components/Administrateur/Customization.vue";
  
  export default {
    name: "AdminDashboard",
    data() {
      return {
        currentComponent: "Dashboard", // Composant initial
      };
    },
    methods: {
      selectComponent(componentName) {
        this.currentComponent = componentName; // Mettre à jour le composant affiché
      },
    },
    components: {
      Dashboard,
      UsersManagement,
      StudentsManagement,
      TeachersManagement,
      CoursesManagement,
      PromotionsManagement,
      ExamsManagement,
      FinancialManagement,
      SystemSettings,
      Reports,
    
      Customization,
    },
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar (Menu fixe) */
  .sidebar {
    width: 250px;
    background-color: #003366; /* Bleu foncé */
    color: white;
    padding: 20px;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .menu {
    list-style: none;
    padding: 0;
  }
  
  .menu-item {
    display: block;
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background-color: #ffcc00; /* Jaune */
  }
  
  /* Main Content (Partie blanche) */
  .content {
    flex-grow: 1;
    padding: 20px;
    background-color: #f4f4f4;
    overflow-y: auto; /* Ajoute une barre de défilement si nécessaire */
  }
  </style>