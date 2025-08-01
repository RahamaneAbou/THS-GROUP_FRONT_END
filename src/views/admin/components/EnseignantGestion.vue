<template>
  <div class="enseignant-gestion">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <button @click="ouvrirModalAjout" class="btn-ajouter">
        <span class="icon">➕</span>
        Ajouter un Enseignant
      </button>
      <div class="recherche-rapide">
        <input 
          v-model="rechercheTexte" 
          type="text" 
          placeholder="Rechercher un enseignant..."
          class="input-recherche"
        >
      </div>
    </div>

    <!-- Liste des enseignants -->
    <div class="liste-enseignants">
      <div class="en-tete-liste">
        <h3>Liste des Enseignants ({{ enseignantsFiltres.length }})</h3>
      </div>
      
      <div class="tableau-container">
        <table class="tableau-enseignants">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Nombre de Cours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="enseignant in enseignantsFiltres" :key="enseignant.id">
              <td>{{ enseignant.numMatricule || 'Non défini' }}</td>
              <td>{{ enseignant.prenom }} {{ enseignant.nom }}</td>
              <td>{{ enseignant.email }}</td>
              <td>{{ enseignant.numeroTelephone }}</td>
              <td>{{ enseignant.cours ? enseignant.cours.length : 0 }}</td>
              <td class="actions">
                <button @click="voirDetails(enseignant)" class="btn-action btn-voir">👁️</button>
                <button @click="modifierEnseignant(enseignant)" class="btn-action btn-modifier">✏️</button>
                <button @click="supprimerEnseignant(enseignant)" class="btn-action btn-supprimer">🗑️</button>
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
          <h3>{{ modeEdition ? 'Modifier' : 'Ajouter' }} un Enseignant</h3>
          <button @click="fermerModal" class="btn-fermer">✕</button>
        </div>
        
        <form @submit.prevent="sauvegarderEnseignant" class="formulaire-enseignant">
          <div class="groupe-champs">
            <div class="champ">
              <label>Nom *</label>
              <input v-model="enseignantForm.nom" type="text" required>
            </div>
            <div class="champ">
              <label>Prénom *</label>
              <input v-model="enseignantForm.prenom" type="text" required>
            </div>
          </div>
          
          <div class="groupe-champs">
            <div class="champ">
              <label>Email *</label>
              <input v-model="enseignantForm.email" type="email" required>
            </div>
            <div class="champ">
              <label>Numéro de Téléphone *</label>
              <input v-model="enseignantForm.numeroTelephone" type="tel" required>
            </div>
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
          <h3>Détails de l'Enseignant</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="details-enseignant" v-if="enseignantSelectionne">
          <div class="info-principale">
            <h4>{{ enseignantSelectionne.prenom }} {{ enseignantSelectionne.nom }}</h4>
            <p><strong>Matricule:</strong> {{ enseignantSelectionne.numMatricule || 'Non défini' }}</p>
            <p><strong>Email:</strong> {{ enseignantSelectionne.email }}</p>
            <p><strong>Téléphone:</strong> {{ enseignantSelectionne.numeroTelephone }}</p>
          </div>
          
          <div class="cours-enseignant" v-if="coursEnseignant.length > 0">
            <h4>Cours Enseignés</h4>
            <table class="tableau-cours">
              <thead>
                <tr>
                  <th>Nom du Cours</th>
                  <th>Formation</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cours in coursEnseignant" :key="cours.id">
                  <td>{{ cours.nom }}</td>
                  <td>{{ cours.formation ? cours.formation.nom : 'Non définie' }}</td>
                  <td>{{ cours.description }}</td>
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
  name: "EnseignantGestion",
  data() {
    return {
      enseignants: [],
      rechercheTexte: '',
      modalOuverte: false,
      modalDetailsOuverte: false,
      modeEdition: false,
      enseignantSelectionne: null,
      coursEnseignant: [],
      baseURL: 'https://ths-group-api.onrender.com',
      enseignantForm: {
        nom: '',
        prenom: '',
        email: '',
        numeroTelephone: ''
      }
    }
  },
  computed: {
    enseignantsFiltres() {
      if (!this.rechercheTexte) {
        return this.enseignants
      }
      const recherche = this.rechercheTexte.toLowerCase()
      return this.enseignants.filter(enseignant => 
        enseignant.nom.toLowerCase().includes(recherche) ||
        enseignant.prenom.toLowerCase().includes(recherche) ||
        enseignant.email.toLowerCase().includes(recherche) ||
        (enseignant.numMatricule && enseignant.numMatricule.toLowerCase().includes(recherche))
      )
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
        alert('Erreur lors du chargement des enseignants')
      }
    },
    
    // Gestion des modals
    ouvrirModalAjout() {
      this.modeEdition = false
      this.enseignantForm = {
        nom: '',
        prenom: '',
        email: '',
        numeroTelephone: ''
      }
      this.modalOuverte = true
    },
    
    fermerModal() {
      this.modalOuverte = false
    },
    
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.enseignantSelectionne = null
      this.coursEnseignant = []
    },
    
    // Actions sur les enseignants
    async voirDetails(enseignant) {
      this.enseignantSelectionne = enseignant
      
      // Charger les cours de l'enseignant
      try {
        const response = await axios.get(`${this.baseURL}/cours/getByEnseignantId/${enseignant.id}`)
        this.coursEnseignant = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
        this.coursEnseignant = []
      }
      
      this.modalDetailsOuverte = true
    },
    
    modifierEnseignant(enseignant) {
      this.modeEdition = true
      this.enseignantForm = {
        id: enseignant.id,
        nom: enseignant.nom,
        prenom: enseignant.prenom,
        email: enseignant.email,
        numeroTelephone: enseignant.numeroTelephone
      }
      this.modalOuverte = true
    },
    
    async supprimerEnseignant(enseignant) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'enseignant ${enseignant.prenom} ${enseignant.nom} ?`)) {
        try {
          await axios.delete(`${this.baseURL}/enseignants/enseignantDelete/${enseignant.id}`)
          await this.chargerEnseignants()
          alert('Enseignant supprimé avec succès')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression de l\'enseignant')
        }
      }
    },
    
    async sauvegarderEnseignant() {
      try {
        const enseignantData = {
          nom: this.enseignantForm.nom,
          prenom: this.enseignantForm.prenom,
          email: this.enseignantForm.email,
          numeroTelephone: this.enseignantForm.numeroTelephone
        }
        
        if (this.modeEdition) {
          await axios.put(`${this.baseURL}/enseignants/UpdateEnseignant/${this.enseignantForm.id}`, enseignantData)
        } else {
          await axios.post(`${this.baseURL}/enseignants/createEnseignant`, enseignantData)
        }
        
        await this.chargerEnseignants()
        this.fermerModal()
        alert(this.modeEdition ? 'Enseignant modifié avec succès' : 'Enseignant ajouté avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde de l\'enseignant')
      }
    }
  },
  async created() {
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
/* Réutilisation des mêmes styles que EtudiantGestion */
.enseignant-gestion {
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

.liste-enseignants {
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

.tableau-enseignants {
  width: 100%;
  border-collapse: collapse;
}

.tableau-enseignants th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-enseignants td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-enseignants tr:hover {
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

/* Modal styles - mêmes que EtudiantGestion */
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

.formulaire-enseignant {
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

.champ input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.champ input:focus {
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

.details-enseignant {
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

.cours-enseignant h4 {
  color: #003366;
  font-size: 20px;
  margin-bottom: 15px;
}

.tableau-cours {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tableau-cours th,
.tableau-cours td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.tableau-cours th {
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
  
  .tableau-enseignants {
    font-size: 12px;
  }
  
  .tableau-enseignants th,
  .tableau-enseignants td {
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
