<template>
  <div class="accueil-etudiant">
    <!-- Statistiques rapides -->
    <div class="statistiques-etudiant">
      <div class="carte-stat">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <h3>{{ courses.length }}</h3>
          <p>Cours suivis</p>
        </div>
      </div>
      
      <div class="carte-stat">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <h3>{{ notes.length }}</h3>
          <p>Notes obtenues</p>
        </div>
      </div>
      
      <div class="carte-stat">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>{{ moyenneGenerale }}</h3>
          <p>Moyenne générale</p>
        </div>
      </div>
      
      <div class="carte-stat">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <h3>{{ studentData.statusInscription || 'N/A' }}</h3>
          <p>Statut</p>
        </div>
      </div>
    </div>

    <!-- Informations personnelles -->
    <div class="section-info">
      <h2>Mes Informations</h2>
      <div class="carte-info">
        <div class="info-grid">
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
            <label>Formation:</label>
            <span>{{ studentData.formation ? studentData.formation.nom : 'Non assignée' }}</span>
          </div>
          <div class="info-item">
            <label>Date d'inscription:</label>
            <span>{{ formaterDate(studentData.dateInscription) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dernières notes -->
    <div class="section-notes">
      <h2>Dernières Notes</h2>
      <div class="carte-notes">
        <div v-if="dernieresNotes.length > 0" class="liste-notes">
          <div v-for="note in dernieresNotes" :key="note.id" class="note-item">
            <div class="note-cours">{{ note.cours.nom }}</div>
            <div class="note-valeur" :class="getNoteClass(note.valeur)">
              {{ note.valeur }}/20
            </div>
            <div class="note-date">{{ formaterDate(note.DateAttribution) }}</div>
          </div>
        </div>
        <div v-else class="aucune-note">
          <p>Aucune note disponible pour le moment</p>
        </div>
      </div>
    </div>

    <!-- Cours à venir -->
    <div class="section-cours">
      <h2>Mes Cours</h2>
      <div class="grille-cours">
        <div v-for="cours in courses" :key="cours.id" class="carte-cours">
          <h4>{{ cours.nom }}</h4>
          <p>{{ cours.description }}</p>
          <div class="cours-info">
            <span class="formation">{{ cours.formation ? cours.formation.nom : 'Formation non définie' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccueilEtudiant",
  props: {
    studentData: {
      type: Object,
      default: () => ({})
    },
    courses: {
      type: Array,
      default: () => []
    },
    notes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    moyenneGenerale() {
      if (this.notes.length === 0) return '0.00'
      const somme = this.notes.reduce((acc, note) => acc + note.valeur, 0)
      return (somme / this.notes.length).toFixed(2)
    },
    
    dernieresNotes() {
      return this.notes
        .sort((a, b) => new Date(b.DateAttribution) - new Date(a.DateAttribution))
        .slice(0, 5)
    }
  },
  methods: {
    formaterDate(date) {
      if (!date) return 'Non définie'
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    getNoteClass(valeur) {
      if (valeur >= 16) return 'excellent'
      if (valeur >= 14) return 'bien'
      if (valeur >= 12) return 'assez-bien'
      if (valeur >= 10) return 'passable'
      return 'insuffisant'
    }
  }
}
</script>

<style scoped>
.accueil-etudiant {
  max-width: 1200px;
}

.statistiques-etudiant {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.carte-stat {
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

.carte-stat:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 36px;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: bold;
  color: #FFD700;
}

.stat-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.section-info,
.section-notes,
.section-cours {
  margin-bottom: 40px;
}

.section-info h2,
.section-notes h2,
.section-cours h2 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 20px;
  border-bottom: 3px solid #FFD700;
  padding-bottom: 10px;
}

.carte-info,
.carte-notes {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
}

.info-item span {
  font-weight: 500;
  color: #333;
}

.liste-notes {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.note-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.note-cours {
  font-weight: 600;
  color: #003366;
}

.note-valeur {
  padding: 8px 12px;
  border-radius: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
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

.note-date {
  color: #666;
  font-size: 14px;
}

.aucune-note {
  text-align: center;
  padding: 40px;
  color: #666;
}

.grille-cours {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.carte-cours {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #003366;
  transition: transform 0.3s ease;
}

.carte-cours:hover {
  transform: translateY(-5px);
}

.carte-cours h4 {
  margin: 0 0 15px 0;
  color: #003366;
  font-size: 18px;
}

.carte-cours p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.cours-info {
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
}

.formation {
  background-color: #003366;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .statistiques-etudiant {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .note-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .grille-cours {
    grid-template-columns: 1fr;
  }
}
</style>
