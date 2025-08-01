<template>
  <div class="etudiant-secretaire">
    <!-- Barre de filtres et actions -->
    <div class="barre-actions">
      <div class="filtres-etudiant">
        <select v-model="filtreFormation" @change="filtrerEtudiants" class="select-filtre">
          <option value="">Toutes les formations</option>
          <option v-for="formation in formations" :key="formation.id" :value="formation.id">
            {{ formation.nom }}
          </option>
        </select>
        
        <select v-model="filtreStatut" @change="filtrerEtudiants" class="select-filtre">
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En Attente</option>
          <option value="COMFIMER">Confirmé</option>
          <option value="REFUSER">Refusé</option>
        </select>
      </div>
      
      <div class="actions-export">
        <button @click="exporterListeEtudiants" class="btn-export">
          <span class="icon">📄</span>
          Exporter Liste PDF
        </button>
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
              <th>Formation</th>
              <th>Statut</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="etudiant in etudiantsFiltres" :key="etudiant.id">
              <td>{{ etudiant.numMatricule || 'Non défini' }}</td>
              <td>{{ etudiant.prenom }} {{ etudiant.nom }}</td>
              <td>{{ etudiant.formation ? etudiant.formation.nom : 'Non assignée' }}</td>
              <td>
                <span :class="['statut', etudiant.statusInscription.toLowerCase()]">
                  {{ etudiant.statusInscription }}
                </span>
              </td>
              <td>{{ etudiant.email }}</td>
              <td class="actions">
                <button @click="voirProfil(etudiant)" class="btn-action btn-profil">👤</button>
                <button @click="voirNotes(etudiant)" class="btn-action btn-notes">📝</button>
                <button @click="exporterProfilPDF(etudiant)" class="btn-action btn-pdf">📄</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de profil étudiant -->
    <div v-if="modalProfilOuverte" class="modal-overlay" @click="fermerModalProfil">
      <div class="modal-contenu modal-profil" @click.stop>
        <div class="modal-header">
          <h3>Profil de l'Étudiant</h3>
          <button @click="fermerModalProfil" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-profil" v-if="etudiantSelectionne">
          <div class="section-info">
            <h4>Informations Personnelles</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Nom complet:</label>
                <span>{{ etudiantSelectionne.prenom }} {{ etudiantSelectionne.nom }}</span>
              </div>
              <div class="info-item">
                <label>Matricule:</label>
                <span>{{ etudiantSelectionne.numMatricule || 'Non défini' }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ etudiantSelectionne.email }}</span>
              </div>
              <div class="info-item">
                <label>Téléphone:</label>
                <span>{{ etudiantSelectionne.numeroTelephone }}</span>
              </div>
              <div class="info-item">
                <label>Âge:</label>
                <span>{{ etudiantSelectionne.age }} ans</span>
              </div>
              <div class="info-item">
                <label>Statut:</label>
                <span :class="['statut', etudiantSelectionne.statusInscription.toLowerCase()]">
                  {{ etudiantSelectionne.statusInscription }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="section-info">
            <h4>Formation</h4>
            <div class="formation-details">
              <p><strong>{{ etudiantSelectionne.formation ? etudiantSelectionne.formation.nom : 'Non assignée' }}</strong></p>
              <p v-if="etudiantSelectionne.formation">{{ etudiantSelectionne.formation.description }}</p>
            </div>
          </div>
          
          <div class="section-info" v-if="coursEtudiant.length > 0">
            <h4>Cours Suivis</h4>
            <div class="liste-cours">
              <div v-for="cours in coursEtudiant" :key="cours.id" class="cours-item">
                <span class="nom-cours">{{ cours.nom }}</span>
                <span class="enseignant-cours">{{ getEnseignantNom(cours.enseignantId) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal des notes -->
    <div v-if="modalNotesOuverte" class="modal-overlay" @click="fermerModalNotes">
      <div class="modal-contenu modal-notes" @click.stop>
        <div class="modal-header">
          <h3>Notes de {{ etudiantSelectionne ? etudiantSelectionne.prenom + ' ' + etudiantSelectionne.nom : '' }}</h3>
          <button @click="fermerModalNotes" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-notes">
          <div class="actions-notes">
            <button @click="exporterNotesPDF" class="btn-export-notes">
              <span class="icon">📄</span>
              Exporter Notes PDF
            </button>
          </div>
          
          <div v-if="notesEtudiant.length > 0" class="tableau-notes">
            <table>
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Note</th>
                  <th>Date</th>
                  <th>Appréciation</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in notesEtudiant" :key="note.id">
                  <td>{{ note.cours.nom }}</td>
                  <td>
                    <span :class="['note-valeur', getNoteClass(note.valeur)]">
                      {{ note.valeur }}/20
                    </span>
                  </td>
                  <td>{{ formaterDate(note.DateAttribution) }}</td>
                  <td>{{ getAppreciation(note.valeur) }}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="resume-notes">
              <div class="stat-note">
                <label>Moyenne générale:</label>
                <span class="moyenne">{{ calculerMoyenne() }}/20</span>
              </div>
              <div class="stat-note">
                <label>Nombre de matières:</label>
                <span>{{ notesEtudiant.length }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="aucune-note">
            <p>Aucune note disponible pour cet étudiant</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "EtudiantSecretaire",
  data() {
    return {
      etudiants: [],
      formations: [],
      enseignants: [],
      filtreFormation: '',
      filtreStatut: '',
      modalProfilOuverte: false,
      modalNotesOuverte: false,
      etudiantSelectionne: null,
      coursEtudiant: [],
      notesEtudiant: [],
      baseURL: 'https://ths-group-api.onrender.com/THS-GROUP'
    }
  },
  computed: {
    etudiantsFiltres() {
      let etudiants = this.etudiants
      
      if (this.filtreFormation) {
        etudiants = etudiants.filter(etudiant => 
          etudiant.formation && etudiant.formation.id == this.filtreFormation
        )
      }
      
      if (this.filtreStatut) {
        etudiants = etudiants.filter(etudiant => 
          etudiant.statusInscription === this.filtreStatut
        )
      }
      
      return etudiants
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
    
    async chargerEnseignants() {
      try {
        const response = await axios.get(`${this.baseURL}/enseignants`)
        this.enseignants = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants:', error)
      }
    },
    
    // Filtrer les étudiants
    filtrerEtudiants() {
      // La logique de filtrage est dans les computed properties
    },
    
    // Obtenir le nom de l'enseignant
    getEnseignantNom(enseignantId) {
      const enseignant = this.enseignants.find(e => e.id === enseignantId)
      return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Non assigné'
    },
    
    // Voir le profil d'un étudiant
    async voirProfil(etudiant) {
      this.etudiantSelectionne = etudiant
      
      // Charger les cours de la formation de l'étudiant
      if (etudiant.formation) {
        try {
          const response = await axios.get(`${this.baseURL}/cours/formation/${etudiant.formation.id}`)
          this.coursEtudiant = response.data
        } catch (error) {
          console.error('Erreur lors du chargement des cours:', error)
          this.coursEtudiant = []
        }
      }
      
      this.modalProfilOuverte = true
    },
    
    // Voir les notes d'un étudiant
    async voirNotes(etudiant) {
      this.etudiantSelectionne = etudiant
      
      // Charger les notes de l'étudiant
      try {
        const response = await axios.get(`${this.baseURL}/notes/etudiant/${etudiant.id}`)
        this.notesEtudiant = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error)
        this.notesEtudiant = []
      }
      
      this.modalNotesOuverte = true
    },
    
    // Fermer les modals
    fermerModalProfil() {
      this.modalProfilOuverte = false
      this.etudiantSelectionne = null
      this.coursEtudiant = []
    },
    
    fermerModalNotes() {
      this.modalNotesOuverte = false
      this.etudiantSelectionne = null
      this.notesEtudiant = []
    },
    
    // Fonctions d'export
    exporterListeEtudiants() {
      const donnees = this.etudiantsFiltres.map(etudiant => ({
        matricule: etudiant.numMatricule || 'Non défini',
        nom: `${etudiant.prenom} ${etudiant.nom}`,
        formation: etudiant.formation ? etudiant.formation.nom : 'Non assignée',
        statut: etudiant.statusInscription,
        email: etudiant.email
      }))
      
      console.log('Export liste étudiants PDF:', donnees)
      alert('Fonctionnalité d\'export PDF à implémenter')
    },
    
    exporterProfilPDF(etudiant) {
      console.log('Export profil étudiant PDF:', etudiant)
      alert('Fonctionnalité d\'export profil PDF à implémenter')
    },
    
    exporterNotesPDF() {
      if (this.etudiantSelectionne) {
        console.log('Export notes PDF pour:', this.etudiantSelectionne.nom, this.notesEtudiant)
        alert('Fonctionnalité d\'export notes PDF à implémenter')
      }
    },
    
    // Utilitaires pour les notes
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
    },
    
    calculerMoyenne() {
      if (this.notesEtudiant.length === 0) return '0.00'
      const somme = this.notesEtudiant.reduce((acc, note) => acc + note.valeur, 0)
      return (somme / this.notesEtudiant.length).toFixed(2)
    },
    
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  },
  async created() {
    await this.chargerEtudiants()
    await this.chargerFormations()
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
/* Styles similaires aux autres composants avec adaptations pour le secrétaire */
.etudiant-secretaire {
  max-width: 1400px;
}

.barre-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.filtres-etudiant {
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

.btn-profil {
  background-color: #17a2b8;
  color: white;
}

.btn-notes {
  background-color: #28a745;
  color: white;
}

.btn-pdf {
  background-color: #ffc107;
  color: #212529;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-profil,
.modal-notes {
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

.contenu-profil,
.contenu-notes {
  padding: 25px;
}

.section-info {
  margin-bottom: 30px;
}

.section-info h4 {
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

.formation-details p {
  margin: 10px 0;
  font-size: 16px;
}

.liste-cours {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #003366;
}

.nom-cours {
  font-weight: 600;
  color: #003366;
}

.enseignant-cours {
  color: #666;
  font-size: 14px;
}

.actions-notes {
  margin-bottom: 20px;
  text-align: right;
}

.btn-export-notes {
  display: inline-flex;
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

.btn-export-notes:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.tableau-notes table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
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

.resume-notes {
  display: flex;
  gap: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-note {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-note label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.moyenne {
  font-size: 18px;
  font-weight: bold;
  color: #003366;
}

.aucune-note {
  text-align: center;
  padding: 40px;
  color: #666;
}

.aucune-note p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filtres-etudiant {
    flex-direction: column;
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .cours-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .resume-notes {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
