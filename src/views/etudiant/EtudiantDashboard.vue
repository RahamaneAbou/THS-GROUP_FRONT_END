<template>
  <div class="etudiant-dashboard">
    <!-- Sidebar Navigation -->
    <aside class="sidebar-etudiant">
      <div class="logo-etudiant">
        <div class="avatar-etudiant">
          <span>{{ getInitiales() }}</span>
        </div>
        <div class="info-etudiant">
          <h3>{{ studentName }}</h3>
          <p>{{ studentMatricule }}</p>
        </div>
      </div>
      
      <nav class="menu-etudiant">
        <ul>
          <li @click="changerPage('accueil')" :class="{ active: pageActive === 'accueil' }">
            <span class="icon">🏠</span>
            Accueil
          </li>
          <li @click="changerPage('notes')" :class="{ active: pageActive === 'notes' }">
            <span class="icon">📝</span>
            Mes Notes
          </li>
          <li @click="changerPage('cours')" :class="{ active: pageActive === 'cours' }">
            <span class="icon">📚</span>
            Mes Cours
          </li>
          <li @click="changerPage('profil')" :class="{ active: pageActive === 'profil' }">
            <span class="icon">👤</span>
            Mon Profil
          </li>
          <li @click="changerPage('planning')" :class="{ active: pageActive === 'planning' }">
            <span class="icon">📅</span>
            Planning
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Contenu principal -->
    <main class="contenu-principal">
      <header class="header-etudiant">
        <h1>{{ titrePageActive }}</h1>
        <div class="info-header">
          <span class="formation-badge">{{ studentFormation.nom || 'Formation non définie' }}</span>
          <button @click="deconnexion" class="btn-deconnexion">Déconnexion</button>
        </div>
      </header>

      <!-- Zone de contenu -->
      <div class="zone-contenu">
        <!-- Page d'accueil -->
        <AccueilEtudiant v-if="pageActive === 'accueil'" 
          :student-data="studentData" 
          :courses="courses" 
          :notes="notes" 
        />
        
        <!-- Mes Notes -->
        <NotesEtudiant v-if="pageActive === 'notes'" 
          :notes="notes" 
          :courses="courses" 
        />
        
        <!-- Mes Cours -->
        <CoursEtudiant v-if="pageActive === 'cours'" 
          :courses="courses" 
          :student-formation="studentFormation" 
        />
        
        <!-- Mon Profil -->
        <ProfilEtudiant v-if="pageActive === 'profil'" 
          :student-data="studentData" 
          :student-formation="studentFormation" 
        />
        
        <!-- Planning -->
        <PlanningEtudiant v-if="pageActive === 'planning'" 
          :courses="courses" 
        />
      </div>
    </main>

    <!-- Loading overlay -->
    <div v-if="!isDataLoaded" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Chargement de vos données...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import AccueilEtudiant from './components/AccueilEtudiant.vue'
import NotesEtudiant from './components/NotesEtudiant.vue'
import CoursEtudiant from './components/CoursEtudiant.vue'
import ProfilEtudiant from './components/ProfilEtudiant.vue'
import PlanningEtudiant from './components/PlanningEtudian.vue'

export default {
  name: "EtudiantDashboard",
  components: {
    AccueilEtudiant,
    NotesEtudiant,
    CoursEtudiant,
    ProfilEtudiant,
    PlanningEtudiant
  },
  data() {
    return {
      pageActive: 'accueil',
      studentId: '',
      studentMatricule: '',
      studentName: '',
      studentFormation: {},
      studentData: {},
      courses: [],
      notes: [],
      isDataLoaded: false,
      baseURL: 'https://ths-group-api.onrender.com'
    }
  },
  computed: {
    titrePageActive() {
      const titres = {
        'accueil': 'Tableau de Bord',
        'notes': 'Mes Notes',
        'cours': 'Mes Cours',
        'profil': 'Mon Profil',
        'planning': 'Mon Planning'
      }
      return titres[this.pageActive] || 'Espace Étudiant'
    }
  },
  methods: {
    // Changer de page
    changerPage(page) {
      this.pageActive = page
    },
    
    // Obtenir les initiales
    getInitiales() {
      if (!this.studentName) return 'ET'
      const noms = this.studentName.split(' ')
      return noms.map(nom => nom.charAt(0)).join('').toUpperCase()
    },
    
    // Déconnexion
    deconnexion() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        Cookies.remove('userId')
        Cookies.remove('userMatricule')
        this.$router.push('/connexion')
      }
    },
    
    // Charger les données de l'étudiant
    async chargerDonnees() {
      try {
        const userId = Cookies.get('userId')
        this.studentMatricule = Cookies.get('userMatricule')
        
        if (!userId) {
          throw new Error('Données utilisateur non trouvées.')
        }

        // Récupérer les informations de l'étudiant
        const studentResponse = await axios.get(`${this.baseURL}/etudiants/${userId}`)
        this.studentData = studentResponse.data
        this.studentName = `${studentResponse.data.prenom} ${studentResponse.data.nom}`
        this.studentFormation = studentResponse.data.formation || {}

        // Récupérer les cours de la formation
        if (this.studentFormation.id) {
          const coursesResponse = await axios.get(`${this.baseURL}/cours/formation/${this.studentFormation.id}`)
          this.courses = coursesResponse.data
        }

        // Récupérer les notes de l'étudiant
        const notesResponse = await axios.get(`${this.baseURL}/notes/etudiant/${userId}`)
        this.notes = notesResponse.data

        this.isDataLoaded = true
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        alert('Impossible de charger les données. Veuillez vous reconnecter.')
        this.$router.push('/connexion')
      }
    }
  },
  async created() {
    await this.chargerDonnees()
  }
}
</script>

<style scoped>
.etudiant-dashboard {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Sidebar */
.sidebar-etudiant {
  width: 280px;
  background: linear-gradient(180deg, #003366 0%, #004080 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.logo-etudiant {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-etudiant {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 24px;
  font-weight: bold;
  color: #003366;
}

.info-etudiant h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.info-etudiant p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.menu-etudiant {
  flex: 1;
  padding: 20px 0;
}

.menu-etudiant ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-etudiant li {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

.menu-etudiant li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 35px;
}

.menu-etudiant li.active {
  background-color: #FFD700;
  color: #003366;
  font-weight: bold;
  border-right: 4px solid #003366;
}

.menu-etudiant .icon {
  font-size: 18px;
  width: 20px;
}

/* Contenu principal */
.contenu-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-etudiant {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-etudiant h1 {
  margin: 0;
  color: #003366;
  font-size: 28px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.formation-badge {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
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

.zone-contenu {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 18px;
  margin: 0;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .etudiant-dashboard {
    flex-direction: column;
  }
  
  .sidebar-etudiant {
    width: 100%;
    height: auto;
  }
  
  .menu-etudiant ul {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .menu-etudiant li {
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
  }
  
  .header-etudiant {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .zone-contenu {
    padding: 15px;
  }
}
</style>
