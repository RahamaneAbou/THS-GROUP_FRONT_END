<template>
  <div class="cours-etudiant">
    <!-- En-tête avec informations formation -->
    <div class="header-cours">
      <div class="info-formation">
        <h2>{{ studentFormation.nom || 'Formation non définie' }}</h2>
        <p>{{ studentFormation.description || 'Description non disponible' }}</p>
        <div class="formation-details">
          <span class="duree">Durée: {{ studentFormation.duree || 'Non définie' }}</span>
          <span class="places">Places: {{ studentFormation.placesDisponibles || 'Non défini' }}</span>
        </div>
      </div>
    </div>

    <!-- Liste des cours -->
    <div class="liste-cours">
      <div class="en-tete-cours">
        <h3>Mes Cours ({{ courses.length }})</h3>
      </div>
      
      <div v-if="courses.length > 0" class="grille-cours">
        <div v-for="cours in courses" :key="cours.id" class="carte-cours">
          <div class="header-carte">
            <h4>{{ cours.nom }}</h4>
            <span class="cours-badge">Cours</span>
          </div>
          
          <div class="contenu-carte">
            <p class="description">{{ cours.description }}</p>
            
            <div class="info-cours">
              <div class="info-item">
                <span class="label">Enseignant:</span>
                <span class="valeur">{{ getEnseignantNom(cours.enseignantId) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Formation:</span>
                <span class="valeur">{{ cours.formation ? cours.formation.nom : 'Non définie' }}</span>
              </div>
            </div>
          </div>
          
          <div class="actions-cours">
            <button @click="voirDetailsCours(cours)" class="btn-details">
              Voir Détails
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="aucun-cours">
        <div class="icon-aucun-cours">📚</div>
        <h4>Aucun cours disponible</h4>
        <p>Votre formation n'a pas encore de cours définis ou vous n'êtes pas encore inscrit à une formation.</p>
      </div>
    </div>

    <!-- Modal détails cours -->
    <div v-if="modalDetailsOuverte" class="modal-overlay" @click="fermerModalDetails">
      <div class="modal-contenu" @click.stop>
        <div class="modal-header">
          <h3>{{ coursSelectionne ? coursSelectionne.nom : '' }}</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="modal-body" v-if="coursSelectionne">
          <div class="section-details">
            <h4>Description du Cours</h4>
            <p>{{ coursSelectionne.description }}</p>
          </div>
          
          <div class="section-details">
            <h4>Informations</h4>
            <div class="info-grid">
              <div class="info-detail">
                <label>Enseignant:</label>
                <span>{{ getEnseignantNom(coursSelectionne.enseignantId) }}</span>
              </div>
              <div class="info-detail">
                <label>Formation:</label>
                <span>{{ coursSelectionne.formation ? coursSelectionne.formation.nom : 'Non définie' }}</span>
              </div>
            </div>
          </div>
          
          <div class="section-details" v-if="notesCours.length > 0">
            <h4>Mes Notes pour ce Cours</h4>
            <div class="notes-cours">
              <div v-for="note in notesCours" :key="note.id" class="note-cours-item">
                <span :class="['note-valeur', getNoteClass(note.valeur)]">
                  {{ note.valeur }}/20
                </span>
                <span class="note-date">{{ formaterDate(note.DateAttribution) }}</span>
                <span :class="['note-appreciation', getNoteClass(note.valeur)]">
                  {{ getAppreciation(note.valeur) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="section-details" v-else>
            <h4>Mes Notes pour ce Cours</h4>
            <p class="aucune-note-cours">Aucune note disponible pour ce cours</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "CoursEtudiant",
  props: {
    courses: {
      type: Array,
      default: () => []
    },
    studentFormation: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      enseignants: [],
      modalDetailsOuverte: false,
      coursSelectionne: null,
      notesCours: [],
      baseURL: 'https://ths-group-api.onrender.com'
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
    
    // Obtenir le nom de l'enseignant
    getEnseignantNom(enseignantId) {
      const enseignant = this.enseignants.find(e => e.id === enseignantId)
      return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Non assigné'
    },
    
    // Voir les détails d'un cours
    async voirDetailsCours(cours) {
      this.coursSelectionne = cours
      
      // Charger les notes pour ce cours (si l'étudiant en a)
      try {
        const userId = this.$cookies.get('userId')
        const response = await axios.get(`${this.baseURL}/notes/etudiant/${userId}`)
        this.notesCours = response.data.filter(note => note.cours.id === cours.id)
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error)
        this.notesCours = []
      }
      
      this.modalDetailsOuverte = true
    },
    
    // Fermer la modal
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.coursSelectionne = null
      this.notesCours = []
    },
    
    // Utilitaires
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    getNoteClass(valeur) {
      if (valeur >= 16) return 'excellent'
      if (valeur >= 14) return 'bien'
      if (valeur >= 12) return 'assez-bien'
      if (valeur >= 10) return 'passable'
      return 'insuffisant'
    },
    
    getAppreciation(valeur) {
      if (valeur >= 16) return 'Excellent'
      if (valeur >= 14) return 'Bien'
      if (valeur >= 12) return 'Assez Bien'
      if (valeur >= 10) return 'Passable'
      return 'Insuffisant'
    }
  },
  async created() {
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
.cours-etudiant {
  max-width: 1200px;
}

.header-cours {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
}

.info-formation h2 {
  margin: 0 0 15px 0;
  font-size: 28px;
  font-weight: bold;
}

.info-formation p {
  margin: 0 0 20px 0;
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

.formation-details {
  display: flex;
  gap: 30px;
}

.formation-details span {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.liste-cours {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.en-tete-cours {
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e0e0;
}

.en-tete-cours h3 {
  margin: 0;
  color: #003366;
  font-size: 20px;
}

.grille-cours {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  padding: 25px;
}

.carte-cours {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.carte-cours:hover {
  border-color: #003366;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 51, 102, 0.15);
}

.header-carte {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-carte h4 {
  margin: 0;
  color: #003366;
  font-size: 20px;
  font-weight: bold;
}

.cours-badge {
  background-color: #003366;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.contenu-carte {
  margin-bottom: 20px;
}

.description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.info-cours {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid #FFD700;
}

.info-item .label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item .valeur {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.actions-cours {
  text-align: center;
}

.btn-details {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.aucun-cours {
  text-align: center;
  padding: 60px 20px;
}

.icon-aucun-cours {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucun-cours h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucun-cours p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenu {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.btn-fermer {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.btn-fermer:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 25px;
}

.section-details {
  margin-bottom: 25px;
}

.section-details h4 {
  color: #003366;
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 5px;
}

.section-details p {
  color: #555;
  line-height: 1.5;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.info-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #003366;
}

.info-detail label {
  font-weight: 600;
  color: #666;
}

.info-detail span {
  font-weight: 500;
  color: #333;
}

.notes-cours {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.note-cours-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.note-valeur {
  padding: 8px 12px;
  border-radius: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.note-valeur.excellent {
  background-color: #d4edda;
  color: #155724;
}

.note-valeur.bien {
  background-color: #cce5ff;
  color: #004085;
}

.note-valeur.assez-bien {
  background-color: #fff3cd;
  color: #856404;
}

.note-valeur.passable {
  background-color: #ffeaa7;
  color: #6c5ce7;
}

.note-valeur.insuffisant {
  background-color: #f8d7da;
  color: #721c24;
}

.note-date {
  color: #666;
  font-size: 14px;
  text-align: center;
}

.note-appreciation {
  padding: 6px 12px;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
}

.note-appreciation.excellent {
  background-color: #d4edda;
  color: #155724;
}

.note-appreciation.bien {
  background-color: #cce5ff;
  color: #004085;
}

.note-appreciation.assez-bien {
  background-color: #fff3cd;
  color: #856404;
}

.note-appreciation.passable {
  background-color: #ffeaa7;
  color: #6c5ce7;
}

.note-appreciation.insuffisant {
  background-color: #f8d7da;
  color: #721c24;
}

.aucune-note-cours {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .formation-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .grille-cours {
    grid-template-columns: 1fr;
    padding: 15px;
  }
  
  .header-carte {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .modal-contenu {
    width: 95%;
    margin: 10px;
  }
  
  .note-cours-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
