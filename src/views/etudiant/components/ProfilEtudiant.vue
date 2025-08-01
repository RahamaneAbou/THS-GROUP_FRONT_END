<template>
  <div class="profil-etudiant">
    <!-- Informations personnelles -->
    <div class="section-profil">
      <div class="header-section">
        <h2>Mes Informations Personnelles</h2>
        <button @click="toggleEdition" class="btn-modifier">
          {{ modeEdition ? 'Annuler' : 'Modifier' }}
        </button>
      </div>
      
      <div class="carte-profil">
        <div class="avatar-section">
          <div class="avatar-large">
            <span>{{ getInitiales() }}</span>
          </div>
          <div class="statut-inscription">
            <span :class="['badge-statut', studentData.statusInscription ? studentData.statusInscription.toLowerCase() : '']">
              {{ studentData.statusInscription || 'Non défini' }}
            </span>
          </div>
        </div>
        
        <div class="info-profil">
          <form @submit.prevent="sauvegarderProfil" v-if="modeEdition">
            <div class="groupe-champs">
              <div class="champ">
                <label>Nom *</label>
                <input v-model="profilForm.nom" type="text" required>
              </div>
              <div class="champ">
                <label>Prénom *</label>
                <input v-model="profilForm.prenom" type="text" required>
              </div>
            </div>
            
            <div class="groupe-champs">
              <div class="champ">
                <label>Email *</label>
                <input v-model="profilForm.email" type="email" required>
              </div>
              <div class="champ">
                <label>Âge *</label>
                <input v-model="profilForm.age" type="number" min="16" max="100" required>
              </div>
            </div>
            
            <div class="champ">
              <label>Numéro de Téléphone *</label>
              <input v-model="profilForm.numeroTelephone" type="tel" required>
            </div>
            
            <div class="actions-form">
              <button type="button" @click="toggleEdition" class="btn-annuler">Annuler</button>
              <button type="submit" class="btn-sauvegarder">Sauvegarder</button>
            </div>
          </form>
          
          <div v-else class="info-grid">
            <div class="info-item">
              <label>Nom complet:</label>
              <span>{{ studentData.prenom }} {{ studentData.nom }}</span>
            </div>
            <div class="info-item">
              <label>Matricule:</label>
              <span>{{ studentData.numMatricule || 'Non défini' }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ studentData.email }}</span>
            </div>
            <div class="info-item">
              <label>Âge:</label>
              <span>{{ studentData.age }} ans</span>
            </div>
            <div class="info-item">
              <label>Téléphone:</label>
              <span>{{ studentData.numeroTelephone }}</span>
            </div>
            <div class="info-item">
              <label>Date d'inscription:</label>
              <span>{{ formaterDate(studentData.dateInscription) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Informations formation -->
    <div class="section-formation">
      <h2>Ma Formation</h2>
      <div class="carte-formation">
        <div v-if="studentFormation.id" class="formation-details">
          <div class="formation-header">
            <h3>{{ studentFormation.nom }}</h3>
            <span class="duree-badge">{{ studentFormation.duree }}</span>
          </div>
          
          <p class="formation-description">{{ studentFormation.description }}</p>
          
          <div class="formation-stats">
            <div class="stat-formation">
              <span class="stat-label">Places disponibles:</span>
              <span class="stat-valeur">{{ studentFormation.placesDisponibles }}</span>
            </div>
            <div class="stat-formation" v-if="studentFormation.responsable">
              <span class="stat-label">Responsable:</span>
              <span class="stat-valeur">{{ studentFormation.responsable.prenom }} {{ studentFormation.responsable.nom }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="aucune-formation">
          <div class="icon-formation">🎓</div>
          <h4>Aucune formation assignée</h4>
          <p>Vous n'êtes pas encore inscrit à une formation. Contactez l'administration pour plus d'informations.</p>
        </div>
      </div>
    </div>

    <!-- Statistiques personnelles -->
    <div class="section-stats">
      <h2>Mes Statistiques</h2>
      <div class="grille-stats">
        <div class="carte-stat-profil">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h4>Cours Suivis</h4>
            <span class="stat-nombre">{{ nombreCours }}</span>
          </div>
        </div>
        
        <div class="carte-stat-profil">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h4>Notes Obtenues</h4>
            <span class="stat-nombre">{{ nombreNotes }}</span>
          </div>
        </div>
        
        <div class="carte-stat-profil">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h4>Moyenne Générale</h4>
            <span class="stat-nombre">{{ moyenneGenerale }}/20</span>
          </div>
        </div>
        
        <div class="carte-stat-profil">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <h4>Meilleure Note</h4>
            <span class="stat-nombre">{{ meilleureNote }}/20</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  name: "ProfilEtudiant",
  props: {
    studentData: {
      type: Object,
      default: () => ({})
    },
    studentFormation: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      modeEdition: false,
      profilForm: {
        nom: '',
        prenom: '',
        email: '',
        age: '',
        numeroTelephone: ''
      },
      baseURL: 'https://ths-group-api.onrender.com'
    }
  },
  computed: {
    nombreCours() {
      return this.$parent.courses ? this.$parent.courses.length : 0
    },
    
    nombreNotes() {
      return this.$parent.notes ? this.$parent.notes.length : 0
    },
    
    moyenneGenerale() {
      if (!this.$parent.notes || this.$parent.notes.length === 0) return '0.00'
      const somme = this.$parent.notes.reduce((acc, note) => acc + note.valeur, 0)
      return (somme / this.$parent.notes.length).toFixed(2)
    },
    
    meilleureNote() {
      if (!this.$parent.notes || this.$parent.notes.length === 0) return '0.00'
      const max = Math.max(...this.$parent.notes.map(note => note.valeur))
      return max.toFixed(2)
    }
  },
  methods: {
    // Obtenir les initiales
    getInitiales() {
      if (!this.studentData.nom || !this.studentData.prenom) return 'ET'
      return (this.studentData.prenom.charAt(0) + this.studentData.nom.charAt(0)).toUpperCase()
    },
    
    // Basculer le mode édition
    toggleEdition() {
      this.modeEdition = !this.modeEdition
      if (this.modeEdition) {
        this.profilForm = {
          nom: this.studentData.nom || '',
          prenom: this.studentData.prenom || '',
          email: this.studentData.email || '',
          age: this.studentData.age || '',
          numeroTelephone: this.studentData.numeroTelephone || ''
        }
      }
    },
    
    // Sauvegarder le profil
    async sauvegarderProfil() {
      try {
        const userId = Cookies.get('userId')
        const profilMisAJour = {
          ...this.studentData,
          nom: this.profilForm.nom,
          prenom: this.profilForm.prenom,
          email: this.profilForm.email,
          age: parseInt(this.profilForm.age),
          numeroTelephone: this.profilForm.numeroTelephone
        }
        
        await axios.put(`${this.baseURL}/etudiants/${userId}`, profilMisAJour)
        
        // Mettre à jour les données locales
        Object.assign(this.studentData, profilMisAJour)
        
        this.modeEdition = false
        alert('Profil mis à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        alert('Erreur lors de la mise à jour du profil')
      }
    },
    
    // Formater une date
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  }
}
</script>

<style scoped>
.profil-etudiant {
  max-width: 1200px;
}

.section-profil,
.section-formation,
.section-stats {
  margin-bottom: 40px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h2 {
  color: #003366;
  font-size: 24px;
  margin: 0;
  border-bottom: 3px solid #FFD700;
  padding-bottom: 10px;
}

.btn-modifier {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-modifier:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
}

.carte-profil,
.carte-formation {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.carte-profil {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: start;
}

.avatar-section {
  text-align: center;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #003366;
  margin-bottom: 20px;
}

.statut-inscription {
  text-align: center;
}

.badge-statut {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-statut.en_attente {
  background-color: #fff3cd;
  color: #856404;
}

.badge-statut.comfimer {
  background-color: #d4edda;
  color: #155724;
}

.badge-statut.refuser {
  background-color: #f8d7da;
  color: #721c24;
}

.info-profil {
  flex: 1;
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

.actions-form {
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

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #003366;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item span {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.section-formation h2,
.section-stats h2 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 20px;
  border-bottom: 3px solid #FFD700;
  padding-bottom: 10px;
}

.formation-details {
  text-align: left;
}

.formation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.formation-header h3 {
  margin: 0;
  color: #003366;
  font-size: 22px;
}

.duree-badge {
  background-color: #003366;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.formation-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 16px;
}

.formation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-formation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #FFD700;
}

.stat-label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.stat-valeur {
  font-weight: bold;
  color: #003366;
  font-size: 14px;
}

.aucune-formation {
  text-align: center;
  padding: 60px 20px;
}

.icon-formation {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucune-formation h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucune-formation p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.grille-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.carte-stat-profil {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
  transition: transform 0.3s ease;
}

.carte-stat-profil:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 36px;
}

.stat-content h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  opacity: 0.9;
}

.stat-nombre {
  font-size: 28px;
  font-weight: bold;
  color: #FFD700;
}

@media screen and (max-width: 768px) {
  .carte-profil {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .groupe-champs {
    grid-template-columns: 1fr;
  }
  
  .formation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .formation-stats {
    grid-template-columns: 1fr;
  }
  
  .grille-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .actions-form {
    flex-direction: column;
  }
}
</style>
