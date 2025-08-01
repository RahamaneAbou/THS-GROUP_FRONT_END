<template>
  <div class="secretaire-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar-secretaire">
      <div class="logo-secretaire">
        <h2>THS-GROUP</h2>
        <p>Secrétariat</p>
      </div>
      
      <nav class="menu-secretaire">
        <ul>
          <li @click="changerPage('accueil')" :class="{ active: pageActive === 'accueil' }">
            <span class="icon">🏠</span>
            Accueil
          </li>
          <li @click="changerPage('inscriptions')" :class="{ active: pageActive === 'inscriptions' }">
            <span class="icon">📋</span>
            Inscriptions
          </li>
          <li @click="changerPage('etudiants')" :class="{ active: pageActive === 'etudiants' }">
            <span class="icon">👨‍🎓</span>
            Étudiants
          </li>
          <li @click="changerPage('notes')" :class="{ active: pageActive === 'notes' }">
            <span class="icon">📝</span>
            Gestion Notes
          </li>
          <li @click="changerPage('classes')" :class="{ active: pageActive === 'classes' }">
            <span class="icon">🏫</span>
            Classes
          </li>
          <li @click="changerPage('enseignants')" :class="{ active: pageActive === 'enseignants' }">
            <span class="icon">👨‍🏫</span>
            Enseignants
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
      <header class="header-secretaire">
        <h1>{{ titrePageActive }}</h1>
        <div class="info-secretaire">
          <span>Secrétaire: {{ nomSecretaire }}</span>
          <button @click="deconnexion" class="btn-deconnexion">Déconnexion</button>
        </div>
      </header>

      <!-- Pages dynamiques -->
      <div class="zone-contenu">
        <!-- Page d'accueil secrétaire -->
        <div v-if="pageActive === 'accueil'" class="page-accueil">
          <div class="statistiques-secretaire">
            <div class="carte-stat-sec">
              <h3>{{ inscriptionsEnAttente }}</h3>
              <p>Inscriptions en Attente</p>
              <span class="icon-stat">⏳</span>
            </div>
            <div class="carte-stat-sec">
              <h3>{{ inscriptionsConfirmees }}</h3>
              <p>Inscriptions Confirmées</p>
              <span class="icon-stat">✅</span>
            </div>
            <div class="carte-stat-sec">
              <h3>{{ totalEtudiants }}</h3>
              <p>Total Étudiants</p>
              <span class="icon-stat">👥</span>
            </div>
            <div class="carte-stat-sec">
              <h3>{{ totalEnseignants }}</h3>
              <p>Total Enseignants</p>
              <span class="icon-stat">👨‍🏫</span>
            </div>
          </div>
          
          <!-- Actions rapides -->
          <div class="actions-rapides">
            <h3>Actions Rapides</h3>
            <div class="grille-actions">
              <button @click="changerPage('inscriptions')" class="btn-action-rapide">
                <span class="icon">📋</span>
                <span>Gérer Inscriptions</span>
              </button>
              <button @click="changerPage('recherche')" class="btn-action-rapide">
                <span class="icon">🔍</span>
                <span>Rechercher Étudiant</span>
              </button>
              <button @click="changerPage('notes')" class="btn-action-rapide">
                <span class="icon">📝</span>
                <span>Saisir Notes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Gestion des inscriptions -->
        <InscriptionSecretaire v-if="pageActive === 'inscriptions'" />
        
        <!-- Liste des étudiants -->
        <EtudiantSecretaire v-if="pageActive === 'etudiants'" />
        
        <!-- Gestion des notes -->
        <NoteSecretaire v-if="pageActive === 'notes'" />
        
        <!-- Gestion des classes -->
        <ClasseSecretaire v-if="pageActive === 'classes'" />
        
        <!-- Liste des enseignants -->
        <EnseignantSecretaire v-if="pageActive === 'enseignants'" />
        
        <!-- Recherche -->
        <RechercheSecretaire v-if="pageActive === 'recherche'" />
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import EtudiantSecretaire from './components/EtudiantSecretaire.vue'
import InscriptionSecretaire from './components/InscriptionSecretaire.vue'
import NoteSecretaire from './components/NoteSecretaire.vue'
import ClasseSecretaire from './components/ClasseSecretaire.vue'
import EnseignantSecretaire from './components/EnseignantSecretaire.vue'
import RechercheSecretaire from './components/RechercheSecretaire.vue'

export default {
  name: "SecretaireDashboard",
  components: {
    InscriptionSecretaire,
    EtudiantSecretaire,
    NoteSecretaire,
    
    EnseignantSecretaire,
    RechercheSecretaire
  },
  data() {
    return {
      pageActive: 'accueil',
      nomSecretaire: 'Secrétaire',
      baseURL: 'https://ths-group-api.onrender.com',
      // Statistiques
      inscriptionsEnAttente: 0,
      inscriptionsConfirmees: 0,
      totalEtudiants: 0,
      totalEnseignants: 0
    }
  },
  computed: {
    titrePageActive() {
      const titres = {
        'accueil': 'Tableau de Bord Secrétariat',
        'inscriptions': 'Gestion des Inscriptions',
        'etudiants': 'Liste des Étudiants',
        'notes': 'Gestion des Notes',
        'classes': 'Gestion des Classes',
        'enseignants': 'Liste des Enseignants',
        'recherche': 'Recherche d\'Étudiants'
      }
      return titres[this.pageActive] || 'Secrétariat'
    }
  },
  methods: {
    // Changer de page
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
        // Inscriptions en attente
        const inscriptionsEnAttenteResponse = await axios.get(`${this.baseURL}/inscriptions/en-attente`)
        this.inscriptionsEnAttente = inscriptionsEnAttenteResponse.data.length
        
        // Inscriptions confirmées
        const inscriptionsConfirmeesResponse = await axios.get(`${this.baseURL}/inscriptions/confirmes`)
        this.inscriptionsConfirmees = inscriptionsConfirmeesResponse.data.length
        
        // Total étudiants
        const etudiantsResponse = await axios.get(`${this.baseURL}/etudiants`)
        this.totalEtudiants = etudiantsResponse.data.length
        
        // Total enseignants
        const enseignantsResponse = await axios.get(`${this.baseURL}/enseignants`)
        this.totalEnseignants = enseignantsResponse.data.length
        
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
.secretaire-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

/* Sidebar */
.sidebar-secretaire {
  width: 280px;
  background: linear-gradient(180deg, #003366 0%, #004080 100%);
  color: white;
  padding: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.logo-secretaire {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-secretaire h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #FFD700;
}

.logo-secretaire p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.menu-secretaire ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.menu-secretaire li {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

.menu-secretaire li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 35px;
}

.menu-secretaire li.active {
  background-color: #FFD700;
  color: #003366;
  font-weight: bold;
  border-right: 4px solid #003366;
}

.menu-secretaire .icon {
  font-size: 18px;
  width: 20px;
}

/* Contenu principal */
.contenu-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-secretaire {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-secretaire h1 {
  margin: 0;
  color: #003366;
  font-size: 28px;
}

.info-secretaire {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-secretaire span {
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

/* Page d'accueil secrétaire */
.page-accueil {
  max-width: 1200px;
}

.statistiques-secretaire {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.carte-stat-sec {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.carte-stat-sec:hover {
  transform: translateY(-5px);
}

.carte-stat-sec h3 {
  margin: 0 0 10px 0;
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
}

.carte-stat-sec p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.icon-stat {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  opacity: 0.3;
}

/* Actions rapides */
.actions-rapides {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.actions-rapides h3 {
  margin: 0 0 25px 0;
  color: #003366;
  font-size: 24px;
}

.grille-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.btn-action-rapide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  color: #003366;
}

.btn-action-rapide:hover {
  border-color: #003366;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 51, 102, 0.2);
}

.btn-action-rapide .icon {
  font-size: 32px;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .secretaire-container {
    flex-direction: column;
  }
  
  .sidebar-secretaire {
    width: 100%;
    height: auto;
  }
  
  .menu-secretaire ul {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .menu-secretaire li {
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
  }
  
  .header-secretaire {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .zone-contenu {
    padding: 15px;
  }
  
  .statistiques-secretaire {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .grille-actions {
    grid-template-columns: 1fr;
  }
}
</style>
