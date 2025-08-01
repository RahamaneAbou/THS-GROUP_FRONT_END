<template>
  <div class="classe-secretaire">
    <!-- Barre d'actions -->
    <div class="barre-actions">
      <div class="filtres-classe">
        <select v-model="filtreFormation" @change="filtrerClasses" class="select-filtre">
          <option value="">Toutes les formations</option>
          <option v-for="formation in formations" :key="formation.id" :value="formation.id">
            {{ formation.nom }}
          </option>
        </select>
      </div>
      
      <div class="actions-export">
        <button @click="exporterListeClasses" class="btn-export">
          <span class="icon">📄</span>
          Exporter Classes PDF
        </button>
      </div>
    </div>

    <!-- Liste des classes/formations -->
    <div class="liste-classes">
      <div class="en-tete-liste">
        <h3>Gestion des Classes ({{ classesFiltrees.length }})</h3>
      </div>
      
      <div class="grille-classes">
        <div v-for="formation in classesFiltrees" :key="formation.id" class="carte-classe">
          <div class="header-classe">
            <h4>{{ formation.nom }}</h4>
            <span class="duree-badge">{{ formation.duree }}</span>
          </div>
          
          <div class="info-classe">
            <p class="description">{{ formation.description }}</p>
            
            <div class="stats-classe">
              <div class="stat-item">
                <span class="stat-label">Étudiants inscrits:</span>
                <span class="stat-valeur">{{ getNombreEtudiants(formation.id) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Places disponibles:</span>
                <span class="stat-valeur">{{ formation.placesDisponibles }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Nombre de cours:</span>
                <span class="stat-valeur">{{ getNombreCours(formation.id) }}</span>
              </div>
              <div class="stat-item" v-if="formation.responsable">
                <span class="stat-label">Responsable:</span>
                <span class="stat-valeur">{{ formation.responsable.prenom }} {{ formation.responsable.nom }}</span>
              </div>
            </div>
          </div>
          
          <div class="actions-classe">
            <button @click="voirEtudiants(formation)" class="btn-action btn-etudiants">
              <span class="icon">👥</span>
              Étudiants
            </button>
            <button @click="voirCours(formation)" class="btn-action btn-cours">
              <span class="icon">📚</span>
              Cours
            </button>
            <button @click="voirStatistiques(formation)" class="btn-action btn-stats">
              <span class="icon">📊</span>
              Statistiques
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal des étudiants -->
    <div v-if="modalEtudiantsOuverte" class="modal-overlay" @click="fermerModalEtudiants">
      <div class="modal-contenu modal-etudiants" @click.stop>
        <div class="modal-header">
          <h3>Étudiants - {{ formationSelectionnee ? formationSelectionnee.nom : '' }}</h3>
          <button @click="fermerModalEtudiants" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-etudiants">
          <div class="actions-etudiants">
            <button @click="exporterEtudiantsPDF" class="btn-export-modal">
              <span class="icon">📄</span>
              Exporter Liste PDF
            </button>
          </div>
          
          <div v-if="etudiantsFormation.length > 0" class="tableau-etudiants-modal">
            <table>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom Complet</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="etudiant in etudiantsFormation" :key="etudiant.id">
                  <td>{{ etudiant.numMatricule || 'Non défini' }}</td>
                  <td>{{ etudiant.prenom }} {{ etudiant.nom }}</td>
                  <td>{{ etudiant.email }}</td>
                  <td>
                    <span :class="['statut', etudiant.statusInscription.toLowerCase()]">
                      {{ etudiant.statusInscription }}
                    </span>
                  </td>
                  <td>
                    <button @click="voirProfilEtudiant(etudiant)" class="btn-mini">👁️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="aucun-etudiant">
            <div class="icon-aucun">👥</div>
            <h4>Aucun étudiant inscrit</h4>
            <p>Cette formation n'a pas encore d'étudiants inscrits</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal des cours -->
    <div v-if="modalCoursOuverte" class="modal-overlay" @click="fermerModalCours">
      <div class="modal-contenu modal-cours" @click.stop>
        <div class="modal-header">
          <h3>Cours - {{ formationSelectionnee ? formationSelectionnee.nom : '' }}</h3>
          <button @click="fermerModalCours" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-cours">
          <div class="actions-cours">
            <button @click="exporterCoursPDF" class="btn-export-modal">
              <span class="icon">📄</span>
              Exporter Cours PDF
            </button>
          </div>
          
          <div v-if="coursFormation.length > 0" class="grille-cours-modal">
            <div v-for="cours in coursFormation" :key="cours.id" class="carte-cours-modal">
              <h4>{{ cours.nom }}</h4>
              <p class="description-cours">{{ cours.description }}</p>
              <div class="enseignant-cours">
                <strong>Enseignant:</strong> {{ getEnseignantNom(cours.enseignantId) }}
              </div>
            </div>
          </div>
          
          <div v-else class="aucun-cours">
            <div class="icon-aucun">📚</div>
            <h4>Aucun cours disponible</h4>
            <p>Cette formation n'a pas encore de cours définis</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal des statistiques -->
    <div v-if="modalStatsOuverte" class="modal-overlay" @click="fermerModalStats">
      <div class="modal-contenu modal-stats" @click.stop>
        <div class="modal-header">
          <h3>Statistiques - {{ formationSelectionnee ? formationSelectionnee.nom : '' }}</h3>
          <button @click="fermerModalStats" class="btn-fermer">✕</button>
        </div>
        
        <div class="contenu-stats" v-if="formationSelectionnee">
          <div class="grille-stats">
            <div class="carte-stat">
              <div class="stat-numero">{{ getNombreEtudiants(formationSelectionnee.id) }}</div>
              <div class="stat-titre">Étudiants Inscrits</div>
            </div>
            
            <div class="carte-stat">
              <div class="stat-numero">{{ formationSelectionnee.placesDisponibles }}</div>
              <div class="stat-titre">Places Disponibles</div>
            </div>
            
            <div class="carte-stat">
              <div class="stat-numero">{{ getNombreCours(formationSelectionnee.id) }}</div>
              <div class="stat-titre">Cours Disponibles</div>
            </div>
            
            <div class="carte-stat">
              <div class="stat-numero">{{ getTauxOccupation(formationSelectionnee.id) }}%</div>
              <div class="stat-titre">Taux d'Occupation</div>
            </div>
          </div>
          
          <div class="repartition-statuts">
            <h4>Répartition par Statut</h4>
            <div class="stats-statuts">
              <div class="stat-statut en-attente">
                <span class="nombre">{{ getEtudiantsParStatut(formationSelectionnee.id, 'EN_ATTENTE') }}</span>
                <span class="label">En Attente</span>
              </div>
              <div class="stat-statut confirme">
                <span class="nombre">{{ getEtudiantsParStatut(formationSelectionnee.id, 'COMFIMER') }}</span>
                <span class="label">Confirmés</span>
              </div>
              <div class="stat-statut refuse">
                <span class="nombre">{{ getEtudiantsParStatut(formationSelectionnee.id, 'REFUSER') }}</span>
                <span class="label">Refusés</span>
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
  name: "ClasseSecretaire",
  data() {
    return {
      formations: [],
      etudiants: [],
      cours: [],
      enseignants: [],
      filtreFormation: '',
      modalEtudiantsOuverte: false,
      modalCoursOuverte: false,
      modalStatsOuverte: false,
      formationSelectionnee: null,
      etudiantsFormation: [],
      coursFormation: [],
      baseURL: 'https://ths-group-api.onrender.com/THS-GROUP'
    }
  },
  computed: {
    classesFiltrees() {
      if (!this.filtreFormation) {
        return this.formations
      }
      return this.formations.filter(formation => formation.id == this.filtreFormation)
    }
  },
  methods: {
    // Charger les données
    async chargerFormations() {
      try {
        const response = await axios.get(`${this.baseURL}/formations`)
        this.formations = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error)
        alert('Erreur lors du chargement des formations')
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
    
    async chargerCours() {
      try {
        const response = await axios.get(`${this.baseURL}/cours`)
        this.cours = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
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
    
    // Filtrer les classes
    filtrerClasses() {
      // La logique de filtrage est dans les computed properties
    },
    
    // Calculer les statistiques
    getNombreEtudiants(formationId) {
      return this.etudiants.filter(etudiant => 
        etudiant.formation && etudiant.formation.id === formationId
      ).length
    },
    
    getNombreCours(formationId) {
      return this.cours.filter(cours => 
        cours.formation && cours.formation.id === formationId
      ).length
    },
    
    getTauxOccupation(formationId) {
      const formation = this.formations.find(f => f.id === formationId)
      if (!formation || formation.placesDisponibles === 0) return 0
      
      const nombreEtudiants = this.getNombreEtudiants(formationId)
      return Math.round((nombreEtudiants / formation.placesDisponibles) * 100)
    },
    
    getEtudiantsParStatut(formationId, statut) {
      return this.etudiants.filter(etudiant => 
        etudiant.formation && 
        etudiant.formation.id === formationId && 
        etudiant.statusInscription === statut
      ).length
    },
    
    getEnseignantNom(enseignantId) {
      const enseignant = this.enseignants.find(e => e.id === enseignantId)
      return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Non assigné'
    },
    
    // Actions sur les formations
    async voirEtudiants(formation) {
      this.formationSelectionnee = formation
      
      // Charger les étudiants de cette formation
      try {
        const response = await axios.get(`${this.baseURL}/etudiants/formation/${formation.id}`)
        this.etudiantsFormation = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error)
        this.etudiantsFormation = this.etudiants.filter(e => 
          e.formation && e.formation.id === formation.id
        )
      }
      
      this.modalEtudiantsOuverte = true
    },
    
    async voirCours(formation) {
      this.formationSelectionnee = formation
      
      // Charger les cours de cette formation
      try {
        const response = await axios.get(`${this.baseURL}/cours/formation/${formation.id}`)
        this.coursFormation = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
        this.coursFormation = this.cours.filter(c => 
          c.formation && c.formation.id === formation.id
        )
      }
      
      this.modalCoursOuverte = true
    },
    
    voirStatistiques(formation) {
      this.formationSelectionnee = formation
      this.modalStatsOuverte = true
    },
    
    voirProfilEtudiant(etudiant) {
      // Émettre un événement pour ouvrir le profil de l'étudiant
      console.log('Voir profil étudiant:', etudiant)
      alert('Fonctionnalité de profil étudiant à implémenter')
    },
    
    // Fermer les modals
    fermerModalEtudiants() {
      this.modalEtudiantsOuverte = false
      this.formationSelectionnee = null
      this.etudiantsFormation = []
    },
    
    fermerModalCours() {
      this.modalCoursOuverte = false
      this.formationSelectionnee = null
      this.coursFormation = []
    },
    
    fermerModalStats() {
      this.modalStatsOuverte = false
      this.formationSelectionnee = null
    },
    
    // Fonctions d'export
    exporterListeClasses() {
      const donnees = this.classesFiltrees.map(formation => ({
        nom: formation.nom,
        duree: formation.duree,
        etudiants: this.getNombreEtudiants(formation.id),
        cours: this.getNombreCours(formation.id),
        placesDisponibles: formation.placesDisponibles,
        responsable: formation.responsable ? `${formation.responsable.prenom} ${formation.responsable.nom}` : 'Non défini'
      }))
      
      console.log('Export classes PDF:', donnees)
      alert('Fonctionnalité d\'export PDF à implémenter')
    },
    
    exporterEtudiantsPDF() {
      if (this.formationSelectionnee) {
        console.log('Export étudiants PDF pour:', this.formationSelectionnee.nom, this.etudiantsFormation)
        alert('Fonctionnalité d\'export étudiants PDF à implémenter')
      }
    },
    
    exporterCoursPDF() {
      if (this.formationSelectionnee) {
        console.log('Export cours PDF pour:', this.formationSelectionnee.nom, this.coursFormation)
        alert('Fonctionnalité d\'export cours PDF à implémenter')
      }
    }
  },
  async created() {
    await this.chargerFormations()
    await this.chargerEtudiants()
    await this.chargerCours()
    await this.chargerEnseignants()
  }
}
</script>

<style scoped>
.classe-secretaire {
  max-width: 1400px;
}

.barre-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.filtres-classe {
  flex: 1;
  max-width: 300px;
}

.select-filtre {
  width: 100%;
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

.liste-classes {
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

.grille-classes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
  padding: 25px;
}

.carte-classe {
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 25px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.carte-classe:hover {
  border-color: #003366;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 51, 102, 0.15);
}

.header-classe {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-classe h4 {
  margin: 0;
  color: #003366;
  font-size: 20px;
  font-weight: bold;
}

.duree-badge {
  background-color: #003366;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.info-classe {
  margin-bottom: 20px;
}

.description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.stats-classe {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid #FFD700;
}

.stat-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.stat-valeur {
  font-weight: bold;
  color: #003366;
  font-size: 14px;
}

.actions-classe {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-etudiants {
  background-color: #17a2b8;
  color: white;
}

.btn-cours {
  background-color: #28a745;
  color: white;
}

.btn-stats {
  background-color: #ffc107;
  color: #212529;
}

.btn-action:hover {
  transform: translateY(-2px);
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-etudiants,
.modal-cours,
.modal-stats {
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

.contenu-etudiants,
.contenu-cours,
.contenu-stats {
  padding: 25px;
}

.actions-etudiants,
.actions-cours {
  margin-bottom: 20px;
  text-align: right;
}

.btn-export-modal {
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

.btn-export-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.tableau-etudiants-modal table {
  width: 100%;
  border-collapse: collapse;
}

.tableau-etudiants-modal th,
.tableau-etudiants-modal td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.tableau-etudiants-modal th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #003366;
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

.btn-mini {
  padding: 6px;
  border: none;
  border-radius: 4px;
  background-color: #17a2b8;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.grille-cours-modal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.carte-cours-modal {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background-color: #fafafa;
}

.carte-cours-modal h4 {
  margin: 0 0 15px 0;
  color: #003366;
  font-size: 18px;
}

.description-cours {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.enseignant-cours {
  font-size: 14px;
  color: #666;
}

.aucun-etudiant,
.aucun-cours {
  text-align: center;
  padding: 60px 20px;
}

.icon-aucun {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucun-etudiant h4,
.aucun-cours h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucun-etudiant p,
.aucun-cours p {
  color: #666;
  font-size: 16px;
}

.grille-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.carte-stat {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
}

.stat-numero {
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 10px;
}

.stat-titre {
  font-size: 14px;
  opacity: 0.9;
}

.repartition-statuts {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.repartition-statuts h4 {
  color: #003366;
  font-size: 18px;
  margin-bottom: 20px;
}

.stats-statuts {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.stat-statut {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  flex: 1;
}

.stat-statut.en-attente {
  background-color: #fff3cd;
  color: #856404;
}

.stat-statut.confirme {
  background-color: #d4edda;
  color: #155724;
}

.stat-statut.refuse {
  background-color: #f8d7da;
  color: #721c24;
}

.stat-statut .nombre {
  display: block;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-statut .label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .barre-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .grille-classes {
    grid-template-columns: 1fr;
    padding: 15px;
  }
  
  .stats-classe {
    grid-template-columns: 1fr;
  }
  
  .actions-classe {
    flex-direction: column;
  }
  
  .modal-contenu {
    width: 95%;
    margin: 10px;
  }
  
  .grille-cours-modal {
    grid-template-columns: 1fr;
  }
  
  .grille-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .stats-statuts {
    flex-direction: column;
  }
}
</style>
