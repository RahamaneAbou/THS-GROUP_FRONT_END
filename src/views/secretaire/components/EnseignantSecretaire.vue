<template>
  <div class="enseignant-secretaire">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <div class="filtres-enseignant">
        <input 
          v-model="rechercheTexte" 
          type="text" 
          placeholder="Rechercher un enseignant..."
          class="input-recherche"
        >
      </div>
      
      <div class="actions-export">
        <button @click="exporterListeEnseignants" class="btn-export">
          <span class="icon">📄</span>
          Exporter Liste PDF
        </button>
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
              <td>{{ getNombreCours(enseignant.id) }}</td>
              <td class="actions">
                <button @click="voirProfil(enseignant)" class="btn-action btn-profil">👤</button>
                <button @click="voirCours(enseignant)" class="btn-action btn-cours">📚</button>
                <button @click="exporterProfilPDF(enseignant)" class="btn-action btn-pdf">📄</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de profil enseignant -->
    <div v-if="modalProfilOuverte" class="modal-overlay" @click="fermerModalProfil">
      <div class="modal-contenu modal-profil" @click.stop>
        <div class="modal-header">
          <h3>Profil de l'Enseignant</h3>
          <button @click="fermerModalProfil" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-profil" v-if="enseignantSelectionne">
          <div class="section-info">
            <h4>Informations Personnelles</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Nom complet:</label>
                <span>{{ enseignantSelectionne.prenom }} {{ enseignantSelectionne.nom }}</span>
              </div>
              <div class="info-item">
                <label>Matricule:</label>
                <span>{{ enseignantSelectionne.numMatricule || 'Non défini' }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ enseignantSelectionne.email }}</span>
              </div>
              <div class="info-item">
                <label>Téléphone:</label>
                <span>{{ enseignantSelectionne.numeroTelephone }}</span>
              </div>
            </div>
          </div>
          
          <div class="section-info" v-if="coursEnseignant.length > 0">
            <h4>Cours Enseignés</h4>
            <div class="liste-cours">
              <div v-for="cours in coursEnseignant" :key="cours.id" class="cours-item">
                <div class="cours-details">
                  <span class="nom-cours">{{ cours.nom }}</span>
                  <span class="formation-cours">{{ cours.formation ? cours.formation.nom : 'Formation non définie' }}</span>
                </div>
                <span class="description-cours">{{ cours.description }}</span>
              </div>
            </div>
          </div>
          
          <div class="section-info" v-else>
            <h4>Cours Enseignés</h4>
            <p class="aucun-cours">Aucun cours assigné à cet enseignant</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal des cours -->
    <div v-if="modalCoursOuverte" class="modal-overlay" @click="fermerModalCours">
      <div class="modal-contenu modal-cours" @click.stop>
        <div class="modal-header">
          <h3>Cours de {{ enseignantSelectionne ? enseignantSelectionne.prenom + ' ' + enseignantSelectionne.nom : '' }}</h3>
          <button @click="fermerModalCours" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-cours">
          <div class="actions-cours">
            <button @click="exporterCoursPDF" class="btn-export-cours">
              <span class="icon">📄</span>
              Exporter Cours PDF
            </button>
          </div>
          
          <div v-if="coursEnseignant.length > 0" class="grille-cours">
            <div v-for="cours in coursEnseignant" :key="cours.id" class="carte-cours">
              <div class="header-cours">
                <h4>{{ cours.nom }}</h4>
                <span class="formation-badge">{{ cours.formation ? cours.formation.nom : 'Non définie' }}</span>
              </div>
              <div class="description-cours">
                <p>{{ cours.description }}</p>
              </div>
              <div class="stats-cours">
                <div class="stat-item">
                  <label>Étudiants inscrits:</label>
                  <span>{{ getNombreEtudiants(cours.formation ? cours.formation.id : null) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="aucun-cours-modal">
            <div class="icon-aucun-cours">📚</div>
            <h4>Aucun cours assigné</h4>
            <p>Cet enseignant n'a pas encore de cours assigné</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "EnseignantSecretaire",
  data() {
    return {
      enseignants: [],
      cours: [],
      formations: [],
      rechercheTexte: '',
      modalProfilOuverte: false,
      modalCoursOuverte: false,
      enseignantSelectionne: null,
      coursEnseignant: [],
      baseURL: 'https://api-qrbus.onrender.com/qrbus'
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
    // Charger les données
    async chargerEnseignants() {
      try {
        const response = await axios.get(`${this.baseURL}/enseignants`)
        this.enseignants = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants:', error)
        alert('Erreur lors du chargement des enseignants')
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
    
    async chargerFormations() {
      try {
        const response = await axios.get(`${this.baseURL}/formations`)
        this.formations = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error)
      }
    },
    
    // Obtenir le nombre de cours d'un enseignant
    getNombreCours(enseignantId) {
      return this.cours.filter(cours => cours.enseignantId === enseignantId).length
    },
    
    // Obtenir le nombre d'étudiants d'une formation
    getNombreEtudiants(formationId) {
      if (!formationId) return 0
      const formation = this.formations.find(f => f.id === formationId)
      return formation && formation.etudiants ? formation.etudiants.length : 0
    },
    
    // Voir le profil d'un enseignant
    async voirProfil(enseignant) {
      this.enseignantSelectionne = enseignant
      
      // Charger les cours de l'enseignant
      try {
        const response = await axios.get(`${this.baseURL}/cours/getByEnseignantId/${enseignant.id}`)
        this.coursEnseignant = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
        this.coursEnseignant = []
      }
      
      this.modalProfilOuverte = true
    },
    
    // Voir les cours d'un enseignant
    async voirCours(enseignant) {
      this.enseignantSelectionne = enseignant
      
      // Charger les cours de l'enseignant
      try {
        const response = await axios.get(`${this.baseURL}/cours/getByEnseignantId/${enseignant.id}`)
        this.coursEnseignant = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
        this.coursEnseignant = []
      }
      
      this.modalCoursOuverte = true
    },
    
    // Fermer les modals
    fermerModalProfil() {
      this.modalProfilOuverte = false
      this.enseignantSelectionne = null
      this.coursEnseignant = []
    },
    
    fermerModalCours() {
      this.modalCoursOuverte = false
      this.enseignantSelectionne = null
      this.coursEnseignant = []
    },
    
    // Fonctions d'export
    exporterListeEnseignants() {
      const donnees = this.enseignantsFiltres.map(enseignant => ({
        matricule: enseignant.numMatricule || 'Non défini',
        nom: `${enseignant.prenom} ${enseignant.nom}`,
        email: enseignant.email,
        telephone: enseignant.numeroTelephone,
        nombreCours: this.getNombreCours(enseignant.id)
      }))
      
      console.log('Export liste enseignants PDF:', donnees)
      alert('Fonctionnalité d\'export PDF à implémenter')
    },
    
    exporterProfilPDF(enseignant) {
      console.log('Export profil enseignant PDF:', enseignant)
      alert('Fonctionnalité d\'export profil PDF à implémenter')
    },
    
    exporterCoursPDF() {
      if (this.enseignantSelectionne) {
        console.log('Export cours PDF pour:', this.enseignantSelectionne.nom, this.coursEnseignant)
        alert('Fonctionnalité d\'export cours PDF à implémenter')
      }
    }
  },
  async created() {
    await this.chargerEnseignants()
    await this.chargerCours()
    await this.chargerFormations()
  }
}
</script>

<style scoped>
.enseignant-secretaire {
  max-width: 1400px;
}

.barre-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.filtres-enseignant {
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

.btn-profil {
  background-color: #17a2b8;
  color: white;
}

.btn-cours {
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
.modal-cours {
  max-width: 900px;
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
.contenu-cours {
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

.liste-cours {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cours-item {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #003366;
}

.cours-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.nom-cours {
  font-weight: 600;
  color: #003366;
  font-size: 16px;
}

.formation-cours {
  color: #666;
  font-size: 14px;
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 12px;
}

.description-cours {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.aucun-cours {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.actions-cours {
  margin-bottom: 20px;
  text-align: right;
}

.btn-export-cours {
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

.btn-export-cours:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.grille-cours {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.carte-cours {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.carte-cours:hover {
  border-color: #003366;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 51, 102, 0.15);
}

.header-cours {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-cours h4 {
  margin: 0;
  color: #003366;
  font-size: 18px;
}

.formation-badge {
  background-color: #003366;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.description-cours p {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.stats-cours {
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.stat-item span {
  font-weight: bold;
  color: #003366;
}

.aucun-cours-modal {
  text-align: center;
  padding: 60px 20px;
}

.icon-aucun-cours {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucun-cours-modal h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucun-cours-modal p {
  color: #666;
  font-size: 16px;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .cours-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .grille-cours {
    grid-template-columns: 1fr;
  }
  
  .header-cours {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
