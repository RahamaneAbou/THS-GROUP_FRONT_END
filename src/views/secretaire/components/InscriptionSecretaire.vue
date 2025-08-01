<template>
  <div class="inscription-secretaire">
    <!-- Filtres et actions -->
    <div class="barre-filtres">
      <div class="filtres-statut">
        <button 
          @click="filtrerParStatut('tous')" 
          :class="['btn-filtre', { active: filtreStatut === 'tous' }]"
        >
          Toutes ({{ inscriptions.length }})
        </button>
        <button 
          @click="filtrerParStatut('EN_ATTENTE')" 
          :class="['btn-filtre', { active: filtreStatut === 'EN_ATTENTE' }]"
        >
          En Attente ({{ inscriptionsEnAttente.length }})
        </button>
        <button 
          @click="filtrerParStatut('COMFIMER')" 
          :class="['btn-filtre', { active: filtreStatut === 'COMFIMER' }]"
        >
          Confirmées ({{ inscriptionsConfirmees.length }})
        </button>
        <button 
          @click="filtrerParStatut('REFUSER')" 
          :class="['btn-filtre', { active: filtreStatut === 'REFUSER' }]"
        >
          Refusées ({{ inscriptionsRefusees.length }})
        </button>
      </div>
      
      <div class="actions-export">
        <button @click="exporterPDF" class="btn-export">
          <span class="icon">📄</span>
          Exporter PDF
        </button>
      </div>
    </div>

    <!-- Liste des inscriptions -->
    <div class="liste-inscriptions">
      <div class="tableau-container">
        <table class="tableau-inscriptions">
          <thead>
            <tr>
              <th>Date Inscription</th>
              <th>Étudiant</th>
              <th>Formation</th>
              <th>Statut</th>
              <th>Date Confirmation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inscription in inscriptionsFiltrees" :key="inscription.id">
              <td>{{ formaterDate(inscription.dateCreation) }}</td>
              <td>
                <div class="info-etudiant">
                  <strong>{{ inscription.etudiant.prenom }} {{ inscription.etudiant.nom }}</strong>
                  <small>{{ inscription.etudiant.email }}</small>
                </div>
              </td>
              <td>{{ inscription.formation.nom }}</td>
              <td>
                <span :class="['statut', inscription.status.toLowerCase()]">
                  {{ inscription.status }}
                </span>
              </td>
              <td>{{ formaterDate(inscription.dateConfirmation) }}</td>
              <td class="actions">
                <button 
                  v-if="inscription.status === 'EN_ATTENTE'" 
                  @click="confirmerInscription(inscription)" 
                  class="btn-action btn-confirmer"
                  title="Confirmer"
                >
                  ✅
                </button>
                <button 
                  v-if="inscription.status === 'EN_ATTENTE'" 
                  @click="refuserInscription(inscription)" 
                  class="btn-action btn-refuser"
                  title="Refuser"
                >
                  ❌
                </button>
                <button 
                  @click="voirDetailsInscription(inscription)" 
                  class="btn-action btn-details"
                  title="Voir détails"
                >
                  👁️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="modalDetailsOuverte" class="modal-overlay" @click="fermerModalDetails">
      <div class="modal-contenu" @click.stop>
        <div class="modal-header">
          <h3>Détails de l'Inscription</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="details-inscription" v-if="inscriptionSelectionnee">
          <div class="section-details">
            <h4>Informations Étudiant</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Nom complet:</label>
                <span>{{ inscriptionSelectionnee.etudiant.prenom }} {{ inscriptionSelectionnee.etudiant.nom }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ inscriptionSelectionnee.etudiant.email }}</span>
              </div>
              <div class="info-item">
                <label>Téléphone:</label>
                <span>{{ inscriptionSelectionnee.etudiant.numeroTelephone }}</span>
              </div>
              <div class="info-item">
                <label>Âge:</label>
                <span>{{ inscriptionSelectionnee.etudiant.age }} ans</span>
              </div>
            </div>
          </div>
          
          <div class="section-details">
            <h4>Informations Inscription</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Formation:</label>
                <span>{{ inscriptionSelectionnee.formation.nom }}</span>
              </div>
              <div class="info-item">
                <label>Date d'inscription:</label>
                <span>{{ formaterDate(inscriptionSelectionnee.dateCreation) }}</span>
              </div>
              <div class="info-item">
                <label>Statut:</label>
                <span :class="['statut', inscriptionSelectionnee.status.toLowerCase()]">
                  {{ inscriptionSelectionnee.status }}
                </span>
              </div>
              <div class="info-item" v-if="inscriptionSelectionnee.dateConfirmation">
                <label>Date de confirmation:</label>
                <span>{{ formaterDate(inscriptionSelectionnee.dateConfirmation) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "InscriptionSecretaire",
  data() {
    return {
      inscriptions: [],
      filtreStatut: 'tous',
      modalDetailsOuverte: false,
      inscriptionSelectionnee: null,
      baseURL: 'https://api-qrbus.onrender.com/qrbus'
    }
  },
  computed: {
    inscriptionsFiltrees() {
      if (this.filtreStatut === 'tous') {
        return this.inscriptions
      }
      return this.inscriptions.filter(inscription => inscription.status === this.filtreStatut)
    },
    
    inscriptionsEnAttente() {
      return this.inscriptions.filter(inscription => inscription.status === 'EN_ATTENTE')
    },
    
    inscriptionsConfirmees() {
      return this.inscriptions.filter(inscription => inscription.status === 'COMFIMER')
    },
    
    inscriptionsRefusees() {
      return this.inscriptions.filter(inscription => inscription.status === 'REFUSER')
    }
  },
  methods: {
    // Charger les inscriptions
    async chargerInscriptions() {
      try {
        const response = await axios.get(`${this.baseURL}/inscriptions/getAllInscription`)
        this.inscriptions = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des inscriptions:', error)
        alert('Erreur lors du chargement des inscriptions')
      }
    },
    
    // Filtrer par statut
    filtrerParStatut(statut) {
      this.filtreStatut = statut
    },
    
    // Confirmer une inscription
    async confirmerInscription(inscription) {
      if (confirm(`Confirmer l'inscription de ${inscription.etudiant.prenom} ${inscription.etudiant.nom} ?`)) {
        try {
          await axios.put(`${this.baseURL}/inscriptions/${inscription.id}/confirmer`)
          await this.chargerInscriptions()
          alert('Inscription confirmée avec succès')
        } catch (error) {
          console.error('Erreur lors de la confirmation:', error)
          alert('Erreur lors de la confirmation de l\'inscription')
        }
      }
    },
    
    // Refuser une inscription
    async refuserInscription(inscription) {
      if (confirm(`Refuser l'inscription de ${inscription.etudiant.prenom} ${inscription.etudiant.nom} ?`)) {
        try {
          // Mettre à jour le statut vers REFUSER
          const inscriptionModifiee = {
            ...inscription,
            status: 'REFUSER',
            dateConfirmation: null
          }
          
          await axios.put(`${this.baseURL}/inscriptions/${inscription.id}`, inscriptionModifiee)
          await this.chargerInscriptions()
          alert('Inscription refusée')
        } catch (error) {
          console.error('Erreur lors du refus:', error)
          alert('Erreur lors du refus de l\'inscription')
        }
      }
    },
    
    // Voir les détails d'une inscription
    voirDetailsInscription(inscription) {
      this.inscriptionSelectionnee = inscription
      this.modalDetailsOuverte = true
    },
    
    // Fermer la modal de détails
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.inscriptionSelectionnee = null
    },
    
    // Exporter en PDF
    exporterPDF() {
      // Simulation d'export PDF
      const donnees = this.inscriptionsFiltrees.map(inscription => ({
        date: this.formaterDate(inscription.dateCreation),
        etudiant: `${inscription.etudiant.prenom} ${inscription.etudiant.nom}`,
        formation: inscription.formation.nom,
        statut: inscription.status
      }))
      
      console.log('Export PDF des inscriptions:', donnees)
      alert('Fonctionnalité d\'export PDF à implémenter')
    },
    
    // Formater une date
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  },
  async created() {
    await this.chargerInscriptions()
  }
}
</script>

<style scoped>
.inscription-secretaire {
  max-width: 1400px;
}

/* Barre de filtres */
.barre-filtres {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.filtres-statut {
  display: flex;
  gap: 10px;
}

.btn-filtre {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background-color: white;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-filtre:hover {
  border-color: #003366;
  color: #003366;
}

.btn-filtre.active {
  background-color: #003366;
  color: white;
  border-color: #003366;
}

.actions-export {
  display: flex;
  gap: 10px;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
  color: #003366;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Liste des inscriptions */
.liste-inscriptions {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tableau-container {
  overflow-x: auto;
}

.tableau-inscriptions {
  width: 100%;
  border-collapse: collapse;
}

.tableau-inscriptions th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-inscriptions td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-inscriptions tr:hover {
  background-color: #f8f9fa;
}

.info-etudiant {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-etudiant strong {
  color: #003366;
}

.info-etudiant small {
  color: #666;
  font-size: 12px;
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

.btn-confirmer {
  background-color: #28a745;
  color: white;
}

.btn-refuser {
  background-color: #dc3545;
  color: white;
}

.btn-details {
  background-color: #17a2b8;
  color: white;
}

.btn-action:hover {
  transform: scale(1.1);
}

/* Modal */
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

/* Détails inscription */
.details-inscription {
  padding: 25px;
}

.section-details {
  margin-bottom: 30px;
}

.section-details h4 {
  color: #003366;
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item span {
  font-size: 16px;
  color: #333;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .barre-filtres {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filtres-statut {
    flex-wrap: wrap;
  }
  
  .tableau-inscriptions {
    font-size: 12px;
  }
  
  .tableau-inscriptions th,
  .tableau-inscriptions td {
    padding: 8px 6px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .modal-contenu {
    width: 95%;
    margin: 10px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
