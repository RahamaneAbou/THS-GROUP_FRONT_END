<template>
  <div class="note-gestion">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <button @click="ouvrirModalAjout" class="btn-ajouter">
        <span class="icon">➕</span>
        Ajouter une Note
      </button>
      <div class="filtres">
        <select v-model="filtreFormation" @change="filtrerNotes" class="select-filtre">
          <option value="">Toutes les formations</option>
          <option v-for="formation in formations" :key="formation.id" :value="formation.id">
            {{ formation.nom }}
          </option>
        </select>
        <select v-model="filtreCours" @change="filtrerNotes" class="select-filtre">
          <option value="">Tous les cours</option>
          <option v-for="cours in coursDisponibles" :key="cours.id" :value="cours.id">
            {{ cours.nom }}
          </option>
        </select>
      </div>
    </div>

    <!-- Liste des notes -->
    <div class="liste-notes">
      <div class="en-tete-liste">
        <h3>Liste des Notes ({{ notesFiltrees.length }})</h3>
      </div>
      
      <div class="tableau-container">
        <table class="tableau-notes">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Cours</th>
              <th>Formation</th>
              <th>Note</th>
              <th>Date Attribution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in notesFiltrees" :key="note.id">
              <td>{{ note.etudiant.prenom }} {{ note.etudiant.nom }}</td>
              <td>{{ note.cours.nom }}</td>
              <td>{{ note.cours.formation ? note.cours.formation.nom : 'Non définie' }}</td>
              <td>
                <span :class="['note-valeur', getNoteClass(note.valeur)]">
                  {{ note.valeur }}/20
                </span>
              </td>
              <td>{{ formaterDate(note.DateAttribution) }}</td>
              <td class="actions">
                <button @click="modifierNote(note)" class="btn-action btn-modifier">✏️</button>
                <button @click="supprimerNote(note)" class="btn-action btn-supprimer">🗑️</button>
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
          <h3>{{ modeEdition ? 'Modifier' : 'Ajouter' }} une Note</h3>
          <button @click="fermerModal" class="btn-fermer">✕</button>
        </div>
        
        <form @submit.prevent="sauvegarderNote" class="formulaire-note">
          <div class="groupe-champs">
            <div class="champ">
              <label>Formation *</label>
              <select v-model="noteForm.formationId" @change="chargerCoursFormation" required>
                <option value="">Sélectionner une formation</option>
                <option v-for="formation in formations" :key="formation.id" :value="formation.id">
                  {{ formation.nom }}
                </option>
              </select>
            </div>
            <div class="champ">
              <label>Cours *</label>
              <select v-model="noteForm.coursId" @change="chargerEtudiantsCours" required>
                <option value="">Sélectionner un cours</option>
                <option v-for="cours in coursFormation" :key="cours.id" :value="cours.id">
                  {{ cours.nom }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="groupe-champs">
            <div class="champ">
              <label>Étudiant *</label>
              <select v-model="noteForm.etudiantId" required>
                <option value="">Sélectionner un étudiant</option>
                <option v-for="etudiant in etudiantsFormation" :key="etudiant.id" :value="etudiant.id">
                  {{ etudiant.prenom }} {{ etudiant.nom }}
                </option>
              </select>
            </div>
            <div class="champ">
              <label>Note (sur 20) *</label>
              <input v-model="noteForm.valeur" type="number" min="0" max="20" step="0.5" required>
            </div>
          </div>
          
          <div class="champ">
            <label>Date d'Attribution *</label>
            <input v-model="noteForm.dateAttribution" type="date" required>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "NoteGestion",
  data() {
    return {
      notes: [],
      formations: [],
      cours: [],
      etudiants: [],
      filtreFormation: '',
      filtreCours: '',
      modalOuverte: false,
      modeEdition: false,
      baseURL: 'https://api-qrbus.onrender.com/qrbus',
      coursFormation: [],
      etudiantsFormation: [],
      noteForm: {
        formationId: '',
        coursId: '',
        etudiantId: '',
        valeur: '',
        dateAttribution: ''
      }
    }
  },
  computed: {
    notesFiltrees() {
      let notesFiltrees = this.notes
      
      if (this.filtreFormation) {
        notesFiltrees = notesFiltrees.filter(note => 
          note.cours.formation && note.cours.formation.id == this.filtreFormation
        )
      }
      
      if (this.filtreCours) {
        notesFiltrees = notesFiltrees.filter(note => note.cours.id == this.filtreCours)
      }
      
      return notesFiltrees
    },
    
    coursDisponibles() {
      if (this.filtreFormation) {
        return this.cours.filter(cours => 
          cours.formation && cours.formation.id == this.filtreFormation
        )
      }
      return this.cours
    }
  },
  methods: {
    // Charger les données
    async chargerNotes() {
      try {
        const response = await axios.get(`${this.baseURL}/notes`)
        this.notes = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error)
        alert('Erreur lors du chargement des notes')
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
    
    async chargerCours() {
      try {
        const response = await axios.get(`${this.baseURL}/cours`)
        this.cours = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
      }
    },
    
    async chargerEtudiants() {
      try {
        const response = await axios.get(`${this.baseURL}/etudiants`)
        this.etudiants = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error)
      }
    },
    
    // Charger les cours d'une formation
    async chargerCoursFormation() {
      if (this.noteForm.formationId) {
        try {
          const response = await axios.get(`${this.baseURL}/cours/formation/${this.noteForm.formationId}`)
          this.coursFormation = response.data
          
          // Charger les étudiants de cette formation
          const etudiantsResponse = await axios.get(`${this.baseURL}/etudiants/formation/${this.noteForm.formationId}`)
          this.etudiantsFormation = etudiantsResponse.data
        } catch (error) {
          console.error('Erreur lors du chargement des cours de la formation:', error)
          this.coursFormation = []
          this.etudiantsFormation = []
        }
      }
    },
    
    // Charger les étudiants d'un cours
    async chargerEtudiantsCours() {
      // Les étudiants sont déjà chargés par formation
      // Cette méthode peut être étendue si nécessaire
    },
    
    // Filtrer les notes
    filtrerNotes() {
      // La logique de filtrage est dans les computed properties
    },
    
    // Obtenir la classe CSS pour la note
    getNoteClass(valeur) {
      if (valeur >= 16) return 'excellent'
      if (valeur >= 14) return 'bien'
      if (valeur >= 12) return 'assez-bien'
      if (valeur >= 10) return 'passable'
      return 'insuffisant'
    },
    
    // Gestion des modals
    ouvrirModalAjout() {
      this.modeEdition = false
      this.noteForm = {
        formationId: '',
        coursId: '',
        etudiantId: '',
        valeur: '',
        dateAttribution: new Date().toISOString().split('T')[0]
      }
      this.coursFormation = []
      this.etudiantsFormation = []
      this.modalOuverte = true
    },
    
    fermerModal() {
      this.modalOuverte = false
    },
    
    // Actions sur les notes
    modifierNote(note) {
      this.modeEdition = true
      this.noteForm = {
        id: note.id,
        formationId: note.cours.formation ? note.cours.formation.id : '',
        coursId: note.cours.id,
        etudiantId: note.etudiant.id,
        valeur: note.valeur,
        dateAttribution: new Date(note.DateAttribution).toISOString().split('T')[0]
      }
      
      // Charger les cours et étudiants de la formation
      this.chargerCoursFormation()
      this.modalOuverte = true
    },
    
    async supprimerNote(note) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer la note de ${note.etudiant.prenom} ${note.etudiant.nom} pour le cours ${note.cours.nom} ?`)) {
        try {
          await axios.delete(`${this.baseURL}/notes/noteDelete/${note.id}`)
          await this.chargerNotes()
          alert('Note supprimée avec succès')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression de la note')
        }
      }
    },
    
    async sauvegarderNote() {
      try {
        if (this.modeEdition) {
          // Mise à jour d'une note existante
          const params = new URLSearchParams()
          params.append('valeur', this.noteForm.valeur)
          params.append('dateAttribution', new Date(this.noteForm.dateAttribution).toISOString())
          params.append('etudiantId', this.noteForm.etudiantId)
          params.append('coursId', this.noteForm.coursId)
          
          await axios.put(`${this.baseURL}/notes/update`, params)
        } else {
          // Création d'une nouvelle note
          const etudiantSelectionne = this.etudiantsFormation.find(e => e.id == this.noteForm.etudiantId)
          const coursSelectionne = this.coursFormation.find(c => c.id == this.noteForm.coursId)
          
          const noteData = {
            etudiant: etudiantSelectionne,
            cours: coursSelectionne,
            valeur: parseFloat(this.noteForm.valeur),
            DateAttribution: new Date(this.noteForm.dateAttribution)
          }
          
          await axios.post(`${this.baseURL}/notes/createNote`, noteData)
        }
        
        await this.chargerNotes()
        this.fermerModal()
        alert(this.modeEdition ? 'Note modifiée avec succès' : 'Note ajoutée avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde de la note')
      }
    },
    
    // Formater une date
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  },
  async created() {
    await this.chargerNotes()
    await this.chargerFormations()
    await this.chargerCours()
    await this.chargerEtudiants()
  }
}
</script>

<style scoped>
.note-gestion {
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

.filtres {
  display: flex;
  gap: 15px;
}

.select-filtre {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.select-filtre:focus {
  outline: none;
  border-color: #003366;
}

.liste-notes {
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

.tableau-notes {
  width: 100%;
  border-collapse: collapse;
}

.tableau-notes th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-notes td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-notes tr:hover {
  background-color: #f8f9fa;
}

.note-valeur {
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
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

.formulaire-note {
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
.champ select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.champ input:focus,
.champ select:focus {
  outline: none;
  border-color: #003366;
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

@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filtres {
    flex-direction: column;
  }
  
  .groupe-champs {
    grid-template-columns: 1fr;
  }
  
  .tableau-notes {
    font-size: 12px;
  }
  
  .tableau-notes th,
  .tableau-notes td {
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
