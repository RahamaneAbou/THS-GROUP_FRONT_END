<template>
  <div class="recherche-etudiant">
    <!-- Barre de recherche -->
    <div class="barre-recherche">
      <div class="champ-recherche">
        <input 
          v-model="termeRecherche" 
          @input="rechercherEtudiants"
          type="text" 
          placeholder="Rechercher par nom, prénom, email ou matricule..."
          class="input-recherche-principal"
        >
        <button @click="rechercherEtudiants" class="btn-rechercher">
          <span class="icon">🔍</span>
          Rechercher
        </button>
      </div>
      
      <div class="filtres-avances">
        <select v-model="filtreFormation" @change="rechercherEtudiants" class="select-filtre">
          <option value="">Toutes les formations</option>
          <option v-for="formation in formations" :key="formation.id" :value="formation.id">
            {{ formation.nom }}
          </option>
        </select>
        
        <select v-model="filtreStatut" @change="rechercherEtudiants" class="select-filtre">
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En Attente</option>
          <option value="COMFIMER">Confirmé</option>
          <option value="REFUSER">Refusé</option>
        </select>
      </div>
    </div>

    <!-- Résultats de recherche -->
    <div v-if="resultatsRecherche.length > 0" class="resultats-recherche">
      <div class="en-tete-resultats">
        <h3>Résultats de la recherche ({{ resultatsRecherche.length }})</h3>
        <button @click="exporterResultats" class="btn-export-resultats">
          <span class="icon">📄</span>
          Exporter
        </button>
      </div>
      
      <div class="grille-etudiants">
        <div v-for="etudiant in resultatsRecherche" :key="etudiant.id" class="carte-etudiant">
          <div class="header-carte">
            <h4>{{ etudiant.prenom }} {{ etudiant.nom }}</h4>
            <span :class="['statut-badge', etudiant.statusInscription.toLowerCase()]">
              {{ etudiant.statusInscription }}
            </span>
          </div>
          
          <div class="info-carte">
            <p><strong>Matricule:</strong> {{ etudiant.numMatricule || 'Non défini' }}</p>
            <p><strong>Email:</strong> {{ etudiant.email }}</p>
            <p><strong>Téléphone:</strong> {{ etudiant.numeroTelephone }}</p>
            <p><strong>Formation:</strong> {{ etudiant.formation ? etudiant.formation.nom : 'Non assignée' }}</p>
            <p><strong>Âge:</strong> {{ etudiant.age }} ans</p>
          </div>
          
          <div class="actions-carte">
            <button @click="voirDetailsComplets(etudiant)" class="btn-details">
              Voir Détails
            </button>
            <button @click="modifierEtudiant(etudiant)" class="btn-modifier">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div v-else-if="rechercheEffectuee" class="aucun-resultat">
      <div class="icon-aucun-resultat">🔍</div>
      <h3>Aucun étudiant trouvé</h3>
      <p>Essayez de modifier vos critères de recherche</p>
    </div>

    <!-- Message initial -->
    <div v-else class="message-initial">
      <div class="icon-recherche">🎓</div>
      <h3>Recherche d'Étudiants</h3>
      <p>Utilisez la barre de recherche pour trouver des étudiants par nom, email, matricule ou formation</p>
    </div>

    <!-- Modal de détails complets -->
    <div v-if="modalDetailsOuverte" class="modal-overlay" @click="fermerModalDetails">
      <div class="modal-contenu modal-large" @click.stop>
        <div class="modal-header">
          <h3>Profil Complet de l'Étudiant</h3>
          <button @click="fermerModalDetails" class="btn-fermer">✕</button>
        </div>
        
        <div class="profil-complet" v-if="etudiantSelectionne">
          <div class="section-profil">
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
                <span :class="['statut-badge', etudiantSelectionne.statusInscription.toLowerCase()]">
                  {{ etudiantSelectionne.statusInscription }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="section-profil">
            <h4>Formation</h4>
            <div class="formation-info">
              <p><strong>{{ etudiantSelectionne.formation ? etudiantSelectionne.formation.nom : 'Non assignée' }}</strong></p>
              <p v-if="etudiantSelectionne.formation">{{ etudiantSelectionne.formation.description }}</p>
            </div>
          </div>
          
          <div class="section-profil" v-if="notesEtudiant.length > 0">
            <h4>Notes et Résultats</h4>
            <div class="tableau-notes-modal">
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
              
              <div class="statistiques-notes">
                <div class="stat-note">
                  <label>Moyenne générale:</label>
                  <span class="moyenne">{{ calculerMoyenne() }}/20</span>
                </div>
                <div class="stat-note">
                  <label>Nombre de notes:</label>
                  <span>{{ notesEtudiant.length }}</span>
                </div>
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
  name: "RechercheSecretaire",
  data() {
    return {
      termeRecherche: '',
      filtreFormation: '',
      filtreStatut: '',
      resultatsRecherche: [],
      formations: [],
      rechercheEffectuee: false,
      modalDetailsOuverte: false,
      etudiantSelectionne: null,
      notesEtudiant: [],
      baseURL: 'http://localhost:8080/THS-GROUP'
    }
  },
  methods: {
    // Rechercher les étudiants
    async rechercherEtudiants() {
      if (!this.termeRecherche && !this.filtreFormation && !this.filtreStatut) {
        this.resultatsRecherche = []
        this.rechercheEffectuee = false
        return
      }
      
      try {
        // Charger tous les étudiants
        const response = await axios.get(`${this.baseURL}/etudiants`)
        let etudiants = response.data
        
        // Filtrer par terme de recherche
        if (this.termeRecherche) {
          const terme = this.termeRecherche.toLowerCase()
          etudiants = etudiants.filter(etudiant => 
            etudiant.nom.toLowerCase().includes(terme) ||
            etudiant.prenom.toLowerCase().includes(terme) ||
            etudiant.email.toLowerCase().includes(terme) ||
            (etudiant.numMatricule && etudiant.numMatricule.toLowerCase().includes(terme))
          )
        }
        
        // Filtrer par formation
        if (this.filtreFormation) {
          etudiants = etudiants.filter(etudiant => 
            etudiant.formation && etudiant.formation.id == this.filtreFormation
          )
        }
        
        // Filtrer par statut
        if (this.filtreStatut) {
          etudiants = etudiants.filter(etudiant => 
            etudiant.statusInscription === this.filtreStatut
          )
        }
        
        this.resultatsRecherche = etudiants
        this.rechercheEffectuee = true
        
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        alert('Erreur lors de la recherche des étudiants')
      }
    },
    
    // Charger les formations
    async chargerFormations() {
      try {
        const response = await axios.get(`${this.baseURL}/formations`)
        this.formations = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error)
      }
    },
    
    // Voir les détails complets d'un étudiant
    async voirDetailsComplets(etudiant) {
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
    
    // Fermer la modal de détails
    fermerModalDetails() {
      this.modalDetailsOuverte = false
      this.etudiantSelectionne = null
      this.notesEtudiant = []
    },
    
    // Modifier un étudiant (redirection vers la gestion)
    modifierEtudiant(etudiant) {
      // Émettre un événement pour changer de page vers la gestion des étudiants
      this.$emit('changerPage', 'etudiants', etudiant)
    },
    
    // Exporter les résultats
    exporterResultats() {
      const donnees = this.resultatsRecherche.map(etudiant => ({
        nom: `${etudiant.prenom} ${etudiant.nom}`,
        matricule: etudiant.numMatricule || 'Non défini',
        email: etudiant.email,
        formation: etudiant.formation ? etudiant.formation.nom : 'Non assignée',
        statut: etudiant.statusInscription
      }))
      
      console.log('Export des résultats de recherche:', donnees)
      alert('Fonctionnalité d\'export à implémenter')
    },
    
    // Obtenir la classe CSS pour la note
    getNoteClass(valeur) {
      if (valeur >= 16) return 'excellent'
      if (valeur >= 14) return 'bien'
      if (valeur >= 12) return 'assez-bien'
      if (valeur >= 10) return 'passable'
      return 'insuffisant'
    },
    
    // Obtenir l'appréciation d'une note
    getAppreciation(valeur) {
      if (valeur >= 16) return 'Excellent'
      if (valeur >= 14) return 'Bien'
      if (valeur >= 12) return 'Assez Bien'
      if (valeur >= 10) return 'Passable'
      return 'Insuffisant'
    },
    
    // Calculer la moyenne des notes
    calculerMoyenne() {
      if (this.notesEtudiant.length === 0) return '0.00'
      const somme = this.notesEtudiant.reduce((acc, note) => acc + note.valeur, 0)
      return (somme / this.notesEtudiant.length).toFixed(2)
    },
    
    // Formater une date
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  },
  async created() {
    await this.chargerFormations()
  }
}
</script>

<style scoped>
.recherche-etudiant {
  max-width: 1400px;
}

/* Barre de recherche */
.barre-recherche {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.champ-recherche {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.input-recherche-principal {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-recherche-principal:focus {
  outline: none;
  border-color: #003366;
}

.btn-rechercher {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-rechercher:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.filtres-avances {
  display: flex;
  gap: 15px;
}

.select-filtre {
  padding: 12px 15px;
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

/* Résultats de recherche */
.resultats-recherche {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.en-tete-resultats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e0e0;
}

.en-tete-resultats h3 {
  margin: 0;
  color: #003366;
  font-size: 20px;
}

.btn-export-resultats {
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

.btn-export-resultats:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Grille des étudiants */
.grille-etudiants {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 25px;
}

.carte-etudiant {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.carte-etudiant:hover {
  border-color: #003366;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 51, 102, 0.15);
}

.header-carte {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-carte h4 {
  margin: 0;
  color: #003366;
  font-size: 18px;
}

.statut-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.statut-badge.en_attente {
  background-color: #fff3cd;
  color: #856404;
}

.statut-badge.comfimer {
  background-color: #d4edda;
  color: #155724;
}

.statut-badge.refuser {
  background-color: #f8d7da;
  color: #721c24;
}

.info-carte {
  margin-bottom: 20px;
}

.info-carte p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.info-carte strong {
  color: #003366;
}

.actions-carte {
  display: flex;
  gap: 10px;
}

.btn-details,
.btn-modifier {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-details {
  background-color: #17a2b8;
  color: white;
}

.btn-modifier {
  background-color: #ffc107;
  color: #212529;
}

.btn-details:hover,
.btn-modifier:hover {
  transform: translateY(-2px);
}

/* Messages */
.aucun-resultat,
.message-initial {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.icon-aucun-resultat,
.icon-recherche {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucun-resultat h3,
.message-initial h3 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucun-resultat p,
.message-initial p {
  color: #666;
  font-size: 16px;
}

/* Modal de détails complets */
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 1000px;
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

.profil-complet {
  padding: 25px;
}

.section-profil {
  margin-bottom: 30px;
}

.section-profil h4 {
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

.formation-info p {
  margin: 10px 0;
  font-size: 16px;
}

.tableau-notes-modal table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.tableau-notes-modal th,
.tableau-notes-modal td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.tableau-notes-modal th {
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

.statistiques-notes {
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

/* Responsive */
@media screen and (max-width: 768px) {
  .champ-recherche {
    flex-direction: column;
  }
  
  .filtres-avances {
    flex-direction: column;
  }
  
  .grille-etudiants {
    grid-template-columns: 1fr;
    padding: 15px;
  }
  
  .en-tete-resultats {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .actions-carte {
    flex-direction: column;
  }
  
  .modal-contenu {
    width: 95%;
    margin: 10px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .statistiques-notes {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
