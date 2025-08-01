<template>
  <div class="etudiant-gestion">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <button @click="ouvrirModalAjout" class="btn-ajouter">
        <span class="icon">➕</span>
        Ajouter un Étudiant
      </button>
      <div class="recherche-rapide">
        <input 
          v-model="rechercheTexte" 
          type="text" 
          placeholder="Rechercher un étudiant..."
          class="input-recherche"
        >
      </div>
    </div>

    <!-- Liste des étudiants -->
    <div class="liste-etudiants">
      <div class="en-tete-liste">
        <h3>Liste des Étudiants ({{ etudiantsFiltres.length }})</h3>
      </div>
      
      <div class="tableau-container">
        <table class="tableau-etudiants">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Formation</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="etudiant in etudiantsFiltres" :key="etudiant.id">
              <td>{{ etudiant.numMatricule || 'Non défini' }}</td>
              <td>{{ etudiant.prenom }} {{ etudiant.nom }}</td>
              <td>{{ etudiant.email }}</td>
              <td>{{ etudiant.formation ? etudiant.formation.nom : 'Non assigné' }}</td>
              <td>
                <span :class="['statut', etudiant.statusInscription.toLowerCase()]">
                  {{ etudiant.statusInscription }}
                </span>
              </td>
              <td class="actions">
                <button @click="voirDetails(etudiant)" class="btn-action btn-voir">👁️</button>
                <button @click="modifierEtudiant(etudiant)" class="btn-action btn-modifier">✏️</button>
                <button @click="supprimerEtudiant(etudiant)" class="btn-action btn-supprimer">🗑️</button>
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
          <h3>{{ modeEdition ? 'Modifier' : 'Ajouter' }} un Étudiant</h3>
          <button @click="fermerModal" class="btn-fermer">✕</button>
        </div>
        
        <form @submit.prevent="sauvegarderEtudiant" class="formulaire-etudiant">
          <div class="groupe-champs">
            <div class="champ">
              <label>Nom *</label>
              <input v-model="etudiantForm.nom" type="text" required>
            </div>
            <div class="champ">
              <label>Prénom *</label>
              <input v-model="etudiantForm.prenom" type="text" required>
            </div>
          </div>
          
          <div class="groupe-champs">
            <div class="champ">
              <label>Email *</label>
              <input v-model="etudiantForm.email" type="email" required>
            </div>
            <div class="champ">
              <label>Âge *</label>
              <input v-model="etudiantForm.age" type="number" min="16" max="100" required>
            </div>
          </div>
          
          <div class="groupe-champs">
            <div class="champ">
              <label>Numéro de Téléphone *</label>
              <input v-model="etudiantForm.numeroTelephone" type="tel" required>
            </div>
            <div class="champ">
              <label>Formation *</label>
              <select v-model="etudiantForm.formationId" required>
                <option value="">Sélectionner une formation</option>
                <option v-for="formation in formations" :key="formation.id" :value="formation.id">
                  {{ formation.nom }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="champ">
            <label>Statut d'Inscription</label>
            <select v-model="etudiantForm.statusInscription">
              <option value="EN_ATTENTE">En Attente</option>
              <option value="COMFIMER">Confirmé</option>
              <option value="REFUSER">Refusé</option>
            </select>
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
          <h3>Détails de l'Étudiant</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="details-etudiant" v-if="etudiantSelectionne">
          <div class="info-principale">
            <h4>{{ etudiantSelectionne.prenom }} {{ etudiantSelectionne.nom }}</h4>
            <p><strong>Matricule:</strong> {{ etudiantSelectionne.numMatricule || 'Non défini' }}</p>
            <p><strong>Email:</strong> {{ etudiantSelectionne.email }}</p>
            <p><strong>Téléphone:</strong> {{ etudiantSelectionne.numeroTelephone }}</p>
            <p><strong>Âge:</strong> {{ etudiantSelectionne.age }} ans</p>
            <p><strong>Formation:</strong> {{ etudiantSelectionne.formation ? etudiantSelectionne.formation.nom : 'Non assigné' }}</p>
            <p><strong>Statut:</strong> 
              <span :class="['statut', etudiantSelectionne.statusInscription.toLowerCase()]">
                {{ etudiantSelectionne.statusInscription }}
              </span>
            </p>
          </div>
          
          <div class="notes-etudiant" v-if="notesEtudiant.length > 0">
            <h4>Notes</h4>
            <table class="tableau-notes">
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in notesEtudiant" :key="note.id">
                  <td>{{ note.cours.nom }}</td>
                  <td>{{ note.valeur }}/20</td>
                  <td>{{ formaterDate(note.DateAttribution) }}</td>
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
  name: "EtudiantGestion",
  data() {
    return {
      etudiants: [],
      formations: [],
      rechercheTexte: '',
      modalOuverte: false,
      modalDetailsOuverte: false,
      modeEdition: false,
      etudiantSelectionne: null,
      notesEtudiant: [],
      baseURL: 'https://api-qrbus.onrender.com/qrbus',
      etudiantForm: {
        nom: '',
        prenom: '',
        email: '',
        age: '',
        numeroTelephone: '',
        formationId: '',
        statusInscription: 'EN_ATTENTE'
      }
    }
  },
  computed: {
    etudiantsFiltres() {
      if (!this.rechercheTexte) {
        return this.etudiants
      }
      const recherche = this.rechercheTexte.toLowerCase()
      return this.etudiants.filter(etudiant => 
        etudiant.nom.toLowerCase().includes(recherche) ||
        etudiant.prenom.toLowerCase().includes(recherche) ||
        etudiant.email.toLowerCase().includes(recherche) ||
        (etudiant.numMatricule && etudiant.numMatricule.toLowerCase().includes(recherche))
      )
    }
  },
  methods: {
    // Charger les données
    async chargerEtudiants() {
      try {
        const response = await axios.get(`${this.baseURL}/etudiants`)
        this.etudiants = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error)
        alert('Erreur lors du chargement des étudiants')
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
    
    // Gestion des modals
    ouvrirModalAjout() {
      this.modeEdition = false
      this.etudiantForm = {
        nom: '',
        prenom: '',
        email: '',
        age: '',
        numeroTelephone: '',
        formationId: '',
        statusInscription: 'EN_ATTENTE'
      }
      this.modalOuverte = true
    },
    
    fermerModal() {
      this.modalOuverte = false
    },
    
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.etudiantSelectionne = null
      this.notesEtudiant = []
    },
    
    // Actions sur les étudiants
    async voirDetails(etudiant) {
      this.etudiantSelectionne = etudiant
      
      // Charger les notes de l'étudiant
      try {
        const response = await axios.get(`${this.baseURL}/notes/etudiant/${etudiant.id}`)
        this.notesEtudiant = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error)
        this.notesEtudiant = []
      }
      
      this.modalDetailsOuverte = true
    },
    
    modifierEtudiant(etudiant) {
      this.modeEdition = true
      this.etudiantForm = {
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        age: etudiant.age,
        numeroTelephone: etudiant.numeroTelephone,
        formationId: etudiant.formation ? etudiant.formation.id : '',
        statusInscription: etudiant.statusInscription
      }
      this.modalOuverte = true
    },
    
    async supprimerEtudiant(etudiant) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${etudiant.prenom} ${etudiant.nom} ?`)) {
        try {
          await axios.delete(`${this.baseURL}/etudiants/etudiantDelete/${etudiant.id}`)
          await this.chargerEtudiants()
          alert('Étudiant supprimé avec succès')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression de l\'étudiant')
        }
      }
    },
    
    async sauvegarderEtudiant() {
      try {
        const formationSelectionnee = this.formations.find(f => f.id == this.etudiantForm.formationId)
        
        const etudiantData = {
          nom: this.etudiantForm.nom,
          prenom: this.etudiantForm.prenom,
          email: this.etudiantForm.email,
          age: parseInt(this.etudiantForm.age),
          numeroTelephone: this.etudiantForm.numeroTelephone,
          formation: formationSelectionnee,
          statusInscription: this.etudiantForm.statusInscription,
          dateInscription: new Date()
        }
        
        if (this.modeEdition) {
          etudiantData.id = this.etudiantForm.id
        }
        
        await axios.post(`${this.baseURL}/etudiants`, etudiantData)
        await this.chargerEtudiants()
        this.fermerModal()
        alert(this.modeEdition ? 'Étudiant modifié avec succès' : 'Étudiant ajouté avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde de l\'étudiant')
      }
    },
    
    // Utilitaires
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  },
  async created() {
    await this.chargerEtudiants()
    await this.chargerFormations()
  }
}
</script>

<style scoped>
.etudiant-gestion {
  max-width: 1400px;
}

/* Barre d'actions */
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

/* Liste des étudiants */
.liste-etudiants {
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

.tableau-etudiants {
  width: 100%;
  border-collapse: collapse;
}

.tableau-etudiants th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-etudiants td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-etudiants tr:hover {
  background-color: #f8f9fa;
}

.statut {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.statut.en_attente {
  background-color: #fff3cd;
  color: #856404;
}

.statut.comfimer {
  background-color: #d4edda;
  color: #155724;
}

.statut.refuser {
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

/* Modals */
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

/* Formulaire */
.formulaire-etudiant {
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

/* Détails étudiant */
.details-etudiant {
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

.notes-etudiant h4 {
  color: #003366;
  font-size: 20px;
  margin-bottom: 15px;
}

.tableau-notes {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tableau-notes th,
.tableau-notes td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.tableau-notes th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #003366;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .groupe-champs {
    grid-template-columns: 1fr;
  }
  
  .tableau-etudiants {
    font-size: 12px;
  }
  
  .tableau-etudiants th,
  .tableau-etudiants td {
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
