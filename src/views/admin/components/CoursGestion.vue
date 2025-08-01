<template>
  <div class="cours-gestion">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <button @click="ouvrirModalAjout" class="btn-ajouter">
        <span class="icon">➕</span>
        Ajouter un Cours
      </button>
      <div class="recherche-rapide">
        <input 
          v-model="rechercheTexte" 
          type="text" 
          placeholder="Rechercher un cours..."
          class="input-recherche"
        >
      </div>
    </div>

    <!-- Liste des cours -->
    <div class="liste-cours">
      <div class="en-tete-liste">
        <h3>Liste des Cours ({{ coursFiltres.length }})</h3>
      </div>
      
      <div class="tableau-container">
        <table class="tableau-cours">
          <thead>
            <tr>
              <th>Nom du Cours</th>
              <th>Formation</th>
              <th>Enseignant</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cours in coursFiltres" :key="cours.id">
              <td>{{ cours.nom }}</td>
              <td>{{ cours.formation ? cours.formation.nom : 'Non assignée' }}</td>
              <td>{{ getEnseignantNom(cours.enseignantId) }}</td>
              <td>{{ cours.description.substring(0, 50) }}...</td>
              <td class="actions">
                <button @click="voirDetails(cours)" class="btn-action btn-voir">👁️</button>
                <button @click="modifierCours(cours)" class="btn-action btn-modifier">✏️</button>
                <button @click="supprimerCours(cours)" class="btn-action btn-supprimer">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="modalOuverte" class="modal-overlay" @click="fermerModal">
      <div class="modal-contenu" @click.stop>
        <div class="modal-header">
          <h3>{{ modeEdition ? 'Modifier' : 'Ajouter' }} un Cours</h3>
          <button @click="fermerModal" class="btn-fermer">✕</button>
        </div>
        
        <form @submit.prevent="sauvegarderCours" class="formulaire-cours">
          <div class="champ">
            <label>Nom du Cours *</label>
            <input v-model="coursForm.nom" type="text" required>
          </div>
          
          <div class="groupe-champs">
            <div class="champ">
              <label>Formation *</label>
              <select v-model="coursForm.formationId" required>
                <option value="">Sélectionner une formation</option>
                <option v-for="formation in formations" :key="formation.id" :value="formation.id">
                  {{ formation.nom }}
                </option>
              </select>
            </div>
            <div class="champ">
              <label>Enseignant *</label>
              <select v-model="coursForm.enseignantId" required>
                <option value="">Sélectionner un enseignant</option>
                <option v-for="enseignant in enseignants" :key="enseignant.id" :value="enseignant.id">
                  {{ enseignant.prenom }} {{ enseignant.nom }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="champ">
            <label>Description *</label>
            <textarea v-model="coursForm.description" rows="4" required></textarea>
          </div>
          
          <div class="actions-modal">
            <button type="button" @click="fermerModal" class="btn-annuler">Annuler</button>
            <button type="submit" class="btn-sauvegarder">
              {{ modeEdition ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="modalDetailsOuverte" class="modal-overlay" @click="fermerModalDetails">
      <div class="modal-contenu modal-details" @click.stop>
        <div class="modal-header">
          <h3>Détails du Cours</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="details-cours" v-if="coursSelectionne">
          <div class="info-principale">
            <h4>{{ coursSelectionne.nom }}</h4>
            <p><strong>Formation:</strong> {{ coursSelectionne.formation ? coursSelectionne.formation.nom : 'Non assignée' }}</p>
            <p><strong>Enseignant:</strong> {{ getEnseignantNom(coursSelectionne.enseignantId) }}</p>
            <p><strong>Description:</strong> {{ coursSelectionne.description }}</p>
          </div>
          
          <div class="etudiants-cours" v-if="etudiantsCours.length > 0">
            <h4>Étudiants Inscrits</h4>
            <table class="tableau-etudiants">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in etudiantsCours" :key="note.id">
                  <td>{{ note.etudiant.prenom }} {{ note.etudiant.nom }}</td>
                  <td>{{ note.etudiant.email }}</td>
                  <td>{{ note.valeur || 'Non notée' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "CoursGestion",
  data() {
    return {
      cours: [],
      formations: [],
      enseignants: [],
      rechercheTexte: '',
      modalOuverte: false,
      modalDetailsOuverte: false,
      modeEdition: false,
      coursSelectionne: null,
      etudiantsCours: [],
      baseURL: 'https://ths-group-api.onrender.com',
      coursForm: {
        nom: '',
        description: '',
        formationId: '',
        enseignantId: ''
      }
    }
  },
  computed: {
    coursFiltres() {
      if (!this.rechercheTexte) {
        return this.cours
      }
      const recherche = this.rechercheTexte.toLowerCase()
      return this.cours.filter(cours => 
        cours.nom.toLowerCase().includes(recherche) ||
        cours.description.toLowerCase().includes(recherche) ||
        (cours.formation && cours.formation.nom.toLowerCase().includes(recherche))
      )
    }
  },
  methods: {
    // Charger les données
    async chargerCours() {
      try {
        const response = await axios.get(`${this.baseURL}/cours`)
        this.cours = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
        alert('Erreur lors du chargement des cours')
      }
    },
    
    async chargerFormations() {
      try {
        const response = await axios.get(`${this.baseURL}/formations`)
        this.formations = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error)
      }
    },
    
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
    
    // Gestion des modals
    ouvrirModalAjout() {
      this.modeEdition = false
      this.coursForm = {
        nom: '',
        description: '',
        formationId: '',
        enseignantId: ''
      }
      this.modalOuverte = true
    },
    
    fermerModal() {
      this.modalOuverte = false
    },
    
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.coursSelectionne = null
      this.etudiantsCours = []
    },
    
    // Actions sur les cours
    async voirDetails(cours) {
      this.coursSelectionne = cours
      
      // Charger les étudiants du cours
      try {
        const response = await axios.get(`${this.baseURL}/notes/cours/${cours.id}`)
        this.etudiantsCours = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error)
        this.etudiantsCours = []
      }
      
      this.modalDetailsOuverte = true
    },
    
    modifierCours(cours) {
      this.modeEdition = true
      this.coursForm = {
        id: cours.id,
        nom: cours.nom,
        description: cours.description,
        formationId: cours.formation ? cours.formation.id : '',
        enseignantId: cours.enseignantId
      }
      this.modalOuverte = true
    },
    
    async supprimerCours(cours) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${cours.nom}" ?`)) {
        try {
          await axios.delete(`${this.baseURL}/cours/courDelete/${cours.id}`)
          await this.chargerCours()
          alert('Cours supprimé avec succès')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression du cours')
        }
      }
    },
    
    async sauvegarderCours() {
      try {
        const formationSelectionnee = this.formations.find(f => f.id == this.coursForm.formationId)
        
        const coursData = {
          nom: this.coursForm.nom,
          description: this.coursForm.description,
          formation: formationSelectionnee,
          enseignantId: parseInt(this.coursForm.enseignantId)
        }
        
        if (this.modeEdition) {
          await axios.put(`${this.baseURL}/cours/CoursUpdate/${this.coursForm.id}`, coursData)
        } else {
          await axios.post(`${this.baseURL}/cours/createCour`, coursData)
        }
        
        await this.chargerCours()
        this.fermerModal()
        alert(this.modeEdition ? 'Cours modifié avec succès' : 'Cours ajouté avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde du cours')
      }
    }
  },
  async created() {
    await this.chargerCours()
    await this.chargerFormations()
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
/* Mêmes styles de base que les autres composants */
.cours-gestion {
  max-width: 1400px;
}

.barre-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.btn-ajouter {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-ajouter:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.recherche-rapide {
  flex: 1;
  max-width: 400px;
}

.input-recherche {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-recherche:focus {
  outline: none;
  border-color: #003366;
}

.liste-cours {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.en-tete-liste {
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e0e0;
}

.en-tete-liste h3 {
  margin: 0;
  color: #003366;
  font-size: 20px;
}

.tableau-container {
  overflow-x: auto;
}

.tableau-cours {
  width: 100%;
  border-collapse: collapse;
}

.tableau-cours th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-cours td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-cours tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-voir {
  background-color: #17a2b8;
  color: white;
}

.btn-modifier {
  background-color: #ffc107;
  color: #212529;
}

.btn-supprimer {
  background-color: #dc3545;
  color: white;
}

.btn-action:hover {
  transform: scale(1.1);
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-details {
  max-width: 800px;
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

.formulaire-cours {
  padding: 25px;
}

.groupe-champs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.champ {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.champ label {
  font-weight: 600;
  color: #003366;
  font-size: 14px;
}

.champ input,
.champ select,
.champ textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.champ input:focus,
.champ select:focus,
.champ textarea:focus {
  outline: none;
  border-color: #003366;
}

.champ textarea {
  resize: vertical;
  min-height: 100px;
}

.actions-modal {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-annuler {
  padding: 12px 25px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-annuler:hover {
  background-color: #5a6268;
}

.btn-sauvegarder {
  padding: 12px 25px;
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-sauvegarder:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.details-cours {
  padding: 25px;
}

.info-principale {
  margin-bottom: 30px;
}

.info-principale h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 20px;
}

.info-principale p {
  margin: 10px 0;
  font-size: 16px;
}

.etudiants-cours h4 {
  color: #003366;
  font-size: 20px;
  margin-bottom: 15px;
}

.tableau-etudiants {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tableau-etudiants th,
.tableau-etudiants td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.tableau-etudiants th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #003366;
}

@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .groupe-champs {
    grid-template-columns: 1fr;
  }
  
  .tableau-cours {
    font-size: 12px;
  }
  
  .tableau-cours th,
  .tableau-cours td {
    padding: 8px 6px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .modal-contenu {
    width: 95%;
    margin: 10px;
  }
}
</style>
