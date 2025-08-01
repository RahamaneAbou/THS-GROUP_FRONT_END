<template>
  <div class="inscription-gestion">
    <!-- Loading spinner -->
    <div v-if="chargementEnCours" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Chargement des inscriptions...</p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Barre d'actions -->
      <div class="barre-actions">
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
        <div class="en-tete-liste">
          <h3>Gestion des Inscriptions ({{ inscriptionsFiltrees.length }})</h3>
        </div>
        
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
                    @click="supprimerInscription(inscription)" 
                    class="btn-action btn-supprimer"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "InscriptionGestion",
  data() {
    return {
      inscriptions: [],
      filtreStatut: 'tous',
      chargementEnCours: true,
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
        this.chargementEnCours = true
        const response = await axios.get(`${this.baseURL}/inscriptions/getAllInscription`)
        this.inscriptions = response.data || []
        console.log('Inscriptions chargées:', this.inscriptions)
      } catch (error) {
        console.error('Erreur lors du chargement des inscriptions:', error)
        this.inscriptions = []
        alert('Erreur lors du chargement des inscriptions')
      } finally {
        this.chargementEnCours = false
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
    
    // Supprimer une inscription
    async supprimerInscription(inscription) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${inscription.etudiant.prenom} ${inscription.etudiant.nom} ?`)) {
        try {
          await axios.delete(`${this.baseURL}/inscriptions/${inscription.id}`)
          await this.chargerInscriptions()
          alert('Inscription supprimée avec succès')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression de l\'inscription')
        }
      }
    },
    
    // Exporter en PDF
    exporterPDF() {
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
.inscription-gestion {
  max-width: 1400px;
}

/* Loading styles */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
  color: #003366;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 51, 102, 0.3);
  border-top: 4px solid #003366;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

/* Reste des styles identiques à la version précédente */
.barre-actions {
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

.liste-inscriptions {
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

.btn-supprimer {
  background-color: #dc3545;
  color: white;
}

.btn-action:hover {
  transform: scale(1.1);
}

@media screen and (max-width: 768px) {
  .barre-actions {
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
}
</style>
