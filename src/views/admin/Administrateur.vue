<template>
  <div class="admin-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar-admin">
      <div class="logo-admin">
        <h2>THS-GROUP</h2>
        <p>Administration</p>
      </div>
      
      <nav class="menu-admin">
        <ul>
          <li @click="changerPage('accueil')" :class="{ active: pageActive === 'accueil' }">
            <span class="icon">🏠</span>
            Accueil
          </li>
          <li @click="changerPage('etudiants')" :class="{ active: pageActive === 'etudiants' }">
            <span class="icon">👨‍🎓</span>
            Étudiants
          </li>
          <li @click="changerPage('enseignants')" :class="{ active: pageActive === 'enseignants' }">
            <span class="icon">👨‍🏫</span>
            Enseignants
          </li>
          <li @click="changerPage('cours')" :class="{ active: pageActive === 'cours' }">
            <span class="icon">📚</span>
            Cours
          </li>
          <li @click="changerPage('notes')" :class="{ active: pageActive === 'notes' }">
            <span class="icon">📝</span>
            Notes
          </li>
          <li @click="changerPage('inscriptions')" :class="{ active: pageActive === 'inscriptions' }">
            <span class="icon">📋</span>
            Inscriptions
          </li>
          <li @click="changerPage('recherche')" :class="{ active: pageActive === 'recherche' }">
            <span class="icon">🔍</span>
            Recherche
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Contenu principal -->
    <main class="contenu-principal">
      <header class="header-admin">
        <h1>{{ titrePageActive }}</h1>
        <div class="info-admin">
          <span>Administrateur: {{ nomAdmin }}</span>
          <button @click="deconnexion" class="btn-deconnexion">Déconnexion</button>
        </div>
      </header>

      <!-- Pages dynamiques -->
      <div class="zone-contenu">
        <!-- Page d'accueil admin -->
        <div v-if="pageActive === 'accueil'" class="page-accueil">
          <div class="statistiques">
            <div class="carte-stat">
              <h3>{{ totalEtudiants }}</h3>
              <p>Étudiants</p>
            </div>
            <div class="carte-stat">
              <h3>{{ totalEnseignants }}</h3>
              <p>Enseignants</p>
            </div>
            <div class="carte-stat">
              <h3>{{ totalCours }}</h3>
              <p>Cours</p>
            </div>
            <div class="carte-stat">
              <h3>{{ totalFormations }}</h3>
              <p>Formations</p>
            </div>
          </div>
        </div>

        <!-- Gestion des étudiants -->
        <EtudiantGestion v-if="pageActive === 'etudiants'" />
        
        <!-- Gestion des enseignants -->
        <EnseignantGestion v-if="pageActive === 'enseignants'" />
        
        <!-- Gestion des cours -->
        <CoursGestion v-if="pageActive === 'cours'" />
        
        <!-- Gestion des notes -->
        <NoteGestion v-if="pageActive === 'notes'" />
        
        <!-- Gestion des inscriptions -->
        <InscriptionGestion v-if="pageActive === 'inscriptions'" />
        
        <!-- Recherche -->
        <RechercheEtudiant v-if="pageActive === 'recherche'" />
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import EtudiantGestion from './components/EtudiantGestion.vue'
import EnseignantGestion from './components/EnseignantGestion.vue'
import CoursGestion from './components/CoursGestion.vue'
import NoteGestion from './components/NoteGestion.vue'
import InscriptionGestion from './components/InscriptionGestion.vue'
import RechercheEtudiant from './components/RechercheEtudiant.vue'

export default {
  name: "AdminDashboard",
  components: {
    EtudiantGestion,
    EnseignantGestion,
    CoursGestion,
    NoteGestion,
    InscriptionGestion,
    RechercheEtudiant
  },
  data() {
    return {
      pageActive: 'accueil',
      nomAdmin: 'Administrateur',
      baseURL: 'https://api-qrbus.onrender.com/qrbus',
      // Statistiques
      totalEtudiants: 0,
      totalEnseignants: 0,
      totalCours: 0,
      totalFormations: 0
    }
  },
  computed: {
    titrePageActive() {
      const titres = {
        'accueil': 'Tableau de Bord',
        'etudiants': 'Gestion des Étudiants',
        'enseignants': 'Gestion des Enseignants',
        'cours': 'Gestion des Cours',
        'notes': 'Gestion des Notes',
        'inscriptions': 'Gestion des Inscriptions',
        'recherche': 'Recherche d\'Étudiants'
      }
      return titres[this.pageActive] || 'Administration'
    }
  },
  methods: {
    // Changer de page dans l'admin
    changerPage(page) {
      this.pageActive = page
    },
    
    // Déconnexion
    deconnexion() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.$router.push('/connexion')
      }
    },
    
    // Charger les statistiques
    async chargerStatistiques() {
      try {
        // Charger le nombre d'étudiants
        const etudiantsResponse = await axios.get(`${this.baseURL}/etudiants`)
        this.totalEtudiants = etudiantsResponse.data.length
        
        // Charger le nombre d'enseignants
        const enseignantsResponse = await axios.get(`${this.baseURL}/enseignants`)
        this.totalEnseignants = enseignantsResponse.data.length
        
        // Charger le nombre de cours
        const coursResponse = await axios.get(`${this.baseURL}/cours`)
        this.totalCours = coursResponse.data.length
        
        // Charger le nombre de formations
        const formationsResponse = await axios.get(`${this.baseURL}/formations`)
        this.totalFormations = formationsResponse.data.length
        
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    }
  },
  async created() {
    await this.chargerStatistiques()
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

/* Sidebar */
.sidebar-admin {
  width: 280px;
  background: linear-gradient(180deg, #003366 0%, #004080 100%);
  color: white;
  padding: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.logo-admin {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-admin h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #FFD700;
}

.logo-admin p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.menu-admin ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.menu-admin li {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

.menu-admin li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 35px;
}

.menu-admin li.active {
  background-color: #FFD700;
  color: #003366;
  font-weight: bold;
  border-right: 4px solid #003366;
}

.menu-admin .icon {
  font-size: 18px;
  width: 20px;
}

/* Contenu principal */
.contenu-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-admin {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-admin h1 {
  margin: 0;
  color: #003366;
  font-size: 28px;
}

.info-admin {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-admin span {
  color: #666;
  font-weight: 500;
}

.btn-deconnexion {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-deconnexion:hover {
  background-color: #c82333;
}

/* Zone de contenu */
.zone-contenu {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Page d'accueil admin */
.page-accueil {
  max-width: 1200px;
}

.statistiques {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.carte-stat {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
  transition: transform 0.3s ease;
}

.carte-stat:hover {
  transform: translateY(-5px);
}

.carte-stat h3 {
  margin: 0 0 10px 0;
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
}

.carte-stat p {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .sidebar-admin {
    width: 100%;
    height: auto;
  }
  
  .menu-admin ul {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .menu-admin li {
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
  }
  
  .header-admin {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .zone-contenu {
    padding: 15px;
  }
  
  .statistiques {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
}
</style>
