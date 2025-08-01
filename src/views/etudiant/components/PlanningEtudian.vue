<template>
  <div class="planning-etudiant">
    <!-- En-tête planning -->
    <div class="header-planning">
      <h2>Mon Planning de Cours</h2>
      <div class="navigation-semaine">
        <button @click="semainePrecedente" class="btn-nav">‹ Précédent</button>
        <span class="semaine-actuelle">{{ formatSemaine() }}</span>
        <button @click="semaineSuivante" class="btn-nav">Suivant ›</button>
      </div>
    </div>

    <!-- Planning hebdomadaire -->
    <div class="planning-hebdo">
      <div class="grille-planning">
        <div class="header-jour">Lundi</div>
        <div class="header-jour">Mardi</div>
        <div class="header-jour">Mercredi</div>
        <div class="header-jour">Jeudi</div>
        <div class="header-jour">Vendredi</div>
        
        <!-- Créneaux horaires -->
        <div v-for="heure in creneauxHoraires" :key="heure" class="creneau-planning">
          <div class="heure-creneau">{{ heure }}</div>
          <div v-for="jour in 5" :key="jour" class="case-planning">
            <div v-if="getCoursForSlot(jour, heure)" class="cours-planning">
              <div class="cours-nom">{{ getCoursForSlot(jour, heure).nom }}</div>
              <div class="cours-info">{{ getCoursForSlot(jour, heure).salle || 'Salle TBD' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des cours -->
    <div class="liste-cours-planning">
      <h3>Mes Cours de la Semaine</h3>
      <div class="cours-semaine">
        <div v-for="cours in courses" :key="cours.id" class="carte-cours-planning">
          <div class="cours-header">
            <h4>{{ cours.nom }}</h4>
            <span class="cours-badge">{{ getJourCours(cours) }}</span>
          </div>
          <p class="cours-description">{{ cours.description }}</p>
          <div class="cours-details">
            <span class="detail-item">
              <strong>Enseignant:</strong> {{ getEnseignantNom(cours.enseignantId) }}
            </span>
            <span class="detail-item">
              <strong>Formation:</strong> {{ cours.formation ? cours.formation.nom : 'Non définie' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Prochains cours -->
    <div class="prochains-cours">
      <h3>Prochains Cours</h3>
      <div class="timeline-cours">
        <div v-for="cours in prochainsCoursSimules" :key="cours.id" class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-time">{{ cours.heure }}</div>
            <div class="timeline-cours">{{ cours.nom }}</div>
            <div class="timeline-prof">{{ cours.enseignant }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "PlanningEtudiant",
  props: {
    courses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      semaineCourante: new Date(),
      enseignants: [],
      creneauxHoraires: [
        '08:00 - 09:30',
        '09:45 - 11:15',
        '11:30 - 13:00',
        '14:00 - 15:30',
        '15:45 - 17:15'
      ],
      baseURL: 'https://ths-group-api.onrender.com/THS-GROUP'
    }
  },
  computed: {
    prochainsCoursSimules() {
      // Simulation des prochains cours avec horaires
      return this.courses.slice(0, 4).map((cours, index) => ({
        ...cours,
        heure: ['09:00', '11:00', '14:00', '16:00'][index],
        enseignant: this.getEnseignantNom(cours.enseignantId)
      }))
    }
  },
  methods: {
    // Charger les enseignants
    async chargerEnseignants() {
      try {
        const response = await axios.get(`${this.baseURL}/enseignants`)
        this.enseignants = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants:', error)
      }
    },
    
    // Navigation semaine
    semainePrecedente() {
      this.semaineCourante.setDate(this.semaineCourante.getDate() - 7)
      this.semaineCourante = new Date(this.semaineCourante)
    },
    
    semaineSuivante() {
      this.semaineCourante.setDate(this.semaineCourante.getDate() + 7)
      this.semaineCourante = new Date(this.semaineCourante)
    },
    
    // Formater la semaine
    formatSemaine() {
      const debut = new Date(this.semaineCourante)
      debut.setDate(debut.getDate() - debut.getDay() + 1) // Lundi
      
      const fin = new Date(debut)
      fin.setDate(fin.getDate() + 4) // Vendredi
      
      return `${debut.toLocaleDateString('fr-FR')} - ${fin.toLocaleDateString('fr-FR')}`
    },
    
    // Obtenir un cours pour un créneau (simulation)
    getCoursForSlot(jour, heure) {
      // Simulation simple - distribuer les cours sur la semaine
      const index = (jour - 1) * this.creneauxHoraires.length + this.creneauxHoraires.indexOf(heure)
      return this.courses[index % this.courses.length] || null
    },
    
    // Obtenir le jour d'un cours (simulation)
    getJourCours(cours) {
      const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      const index = this.courses.indexOf(cours)
      return jours[index % jours.length]
    },
    
    // Obtenir le nom de l'enseignant
    getEnseignantNom(enseignantId) {
      const enseignant = this.enseignants.find(e => e.id === enseignantId)
      return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Non assigné'
    }
  },
  async created() {
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
.planning-etudiant {
  max-width: 1400px;
}

.header-planning {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.header-planning h2 {
  margin: 0;
  color: #003366;
  font-size: 24px;
}

.navigation-semaine {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-nav {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-nav:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.semaine-actuelle {
  font-weight: 600;
  color: #003366;
  font-size: 16px;
}

.planning-hebdo {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow-x: auto;
}

.grille-planning {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  min-width: 800px;
}

.header-jour {
  background-color: #003366;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.creneau-planning {
  display: contents;
}

.heure-creneau {
  background-color: #f8f9fa;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #003366;
  font-size: 12px;
}

.case-planning {
  background-color: white;
  padding: 10px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cours-planning {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cours-planning:hover {
  transform: scale(1.05);
}

.cours-nom {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 4px;
}

.cours-info {
  font-size: 10px;
  opacity: 0.8;
}

.liste-cours-planning {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.liste-cours-planning h3 {
  margin: 0 0 25px 0;
  color: #003366;
  font-size: 20px;
  border-bottom: 3px solid #FFD700;
  padding-bottom: 10px;
}

.cours-semaine {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.carte-cours-planning {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.carte-cours-planning:hover {
  border-color: #003366;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 51, 102, 0.15);
}

.cours-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cours-header h4 {
  margin: 0;
  color: #003366;
  font-size: 18px;
}

.cours-badge {
  background-color: #FFD700;
  color: #003366;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.cours-description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.cours-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  font-size: 13px;
  color: #666;
}

.detail-item strong {
  color: #003366;
}

.prochains-cours {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.prochains-cours h3 {
  margin: 0 0 25px 0;
  color: #003366;
  font-size: 20px;
  border-bottom: 3px solid #FFD700;
  padding-bottom: 10px;
}

.timeline-cours {
  position: relative;
  padding-left: 30px;
}

.timeline-cours::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #003366;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.timeline-marker {
  position: absolute;
  left: -23px;
  width: 12px;
  height: 12px;
  background-color: #FFD700;
  border: 3px solid #003366;
  border-radius: 50%;
}

.timeline-content {
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #003366;
  flex: 1;
}

.timeline-time {
  font-weight: 600;
  color: #003366;
  font-size: 14px;
  margin-bottom: 5px;
}

.timeline-cours {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}

.timeline-prof {
  color: #666;
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .header-planning {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .navigation-semaine {
    flex-direction: column;
    gap: 10px;
  }
  
  .grille-planning {
    grid-template-columns: 100px repeat(5, 1fr);
    min-width: 600px;
  }
  
  .cours-semaine {
    grid-template-columns: 1fr;
  }
  
  .cours-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .cours-details {
    gap: 5px;
  }
}
</style>
