import { createRouter, createWebHistory } from 'vue-router'
import Inscription from '../views/Inscription.vue'  // Assurez-vous que ce composant existe
import AdminDashboard from "../views/admin/Administrateur.vue";
import Dashboard from "../components/Administrateur/Dashboard.vue"
import UsersManagement from "../components/Administrateur/Users-Management.vue";
import PageAccueil from '../views/PageAccueil.vue';
import StudentsManagement from '../components/Administrateur/StudentsManagement.vue';
import TeachersManagement from '../components/Administrateur/TeachersManagement.vue';
import CoursesManagement from '../components/Administrateur/CoursesManagement.vue';
import PromotionsManagement from '../components/Administrateur/PromotionsManagement.vue';
import ExamsManagement from '../components/Administrateur/ExamsManagement.vue';
import FinancialManagement from '../components/Administrateur/FinancialManagement.vue';
import SystemSettings from '../components/Administrateur/SystemSettings.vue';
import Reports from '../components/Administrateur/Reports.vue';
import Customization from '../components/Administrateur/Customization.vue';

import EtudiantDashboard from '../views/etudiant/EtudiantDashboard.vue';
import SecretaireDashboard from '../views/secretaire/SecretaireDashboard.vue';
import Login from '../views/Connexion.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import EnseignantDashboard from '../views/EnseignantDashboard.vue';
import AgentDashboard from '../views/AgentDashboard.vue';
import Text from '../components/text.vue';
//import StudentsManagement from '../components/Administrateur/Students-Management.vue'; // Nouveau composant
//import TeachersManagement from '../components/Administrateur/Teachers-Management.vue'; 

const routes = [
  {
    path:'/connexion',
    name: 'Login',
    component: Login
  },
    {
    path:'/',
    name: 'PageAccueil',
    component: PageAccueil
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription
  },
   {
    path: '/secretaire',
    name: 'SecretaireDashboard',
    component: SecretaireDashboard
  },
  {
    path: '/etudiant',
    name: 'EtudiantDashboard',
    component: EtudiantDashboard
  },
  {
    path: "/admin",
    component: AdminDashboard,
    name:"AdminDashboard"

      // Ajoutez ici les autres routes pour les autres sections
      //{ path: 'students', component: StudentsManagement }, // Ajout de la route pour les étudiants
      //{ path: 'teachers', component: TeachersManagement }, // Ajout de la route pour les professeurs
   
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },

  // Gestion des utilisateurs
  {
    path: '/admin/users',
    name: 'UsersManagement',
    component: UsersManagement,
  },      // Gestion des étudiants
  {
    path: '/admin/students',
    name: 'StudentsManagement',
    component: StudentsManagement,
  },

  // Gestion des professeurs
  {
    path: '/admin/teachers',
    name: 'TeachersManagement',
    component: TeachersManagement,
  },

  // Gestion des cours
  {
    path: '/admin/courses',
    name: 'CoursesManagement',
    component: CoursesManagement,
  },

  // Gestion des promotions/filieres
  {
    path: '/admin/promotions',
    name: 'PromotionsManagement',
    component: PromotionsManagement,
  },

  // Gestion des examens
  {
    path: '/admin/exams',
    name: 'ExamsManagement',
    component: ExamsManagement,
  },
  //gestion financier
  {
    path: '/admin/financial',
    name: 'FinancialManagement',
    component: FinancialManagement,
  },

  // Paramètres du système
  {
    path: '/admin/settings',
    name: 'SystemSettings',
    component: SystemSettings,
  },

  // Rapports et exports
  {
    path: '/admin/reports',
    name: 'Reports',
    component: Reports,
  },
/*
  // Support et assistance
  {
    path: '/admin/support',
    name: 'Support',
    component: Support,
  },*/

  // Personnalisation
  {
    path: '/AgentDashboard',
    name: 'AgentDashboard',
    component: AgentDashboard,
  },
  {
    path: '/etudiant',
    name: 'StudentDashboard',
    component: StudentDashboard
  },
  {
    path: '/enseignant',
    name: 'EnseignantDashboard',
    component: EnseignantDashboard
  }
  
];


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router