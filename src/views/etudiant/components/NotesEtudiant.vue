<template>
  <div class="notes-etudiant">
    <!-- Résumé des notes -->
    <div class="resume-notes">
      <div class="carte-resume">
        <h3>Résumé de mes Notes</h3>
        <div class="stats-notes">
          <div class="stat-note">
            <span class="valeur">{{ moyenneGenerale }}</span>
            <span class="label">Moyenne Générale</span>
          </div>
          <div class="stat-note">
            <span class="valeur">{{ notes.length }}</span>
            <span class="label">Notes Obtenues</span>
          </div>
          <div class="stat-note">
            <span class="valeur">{{ notesReussies }}</span>
            <span class="label">Notes ≥ 10</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filtres-notes">
      <select v-model="filtreCours" class="select-filtre">
        <option value="">Tous les cours</option>
        <option v-for="cours in courses" :key="cours.id" :value="cours.id">
          {{ cours.nom }}
        </option>
      </select>
    </div>

    <!-- Liste des notes -->
    <div class="liste-notes">
      <div class="en-tete-notes">
        <h3>Mes Notes ({{ notesFiltrees.length }})</h3>
      </div>
      
      <div v-if="notesFiltrees.length > 0" class="tableau-notes">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Note</th>
              <th>Appréciation</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in notesFiltrees" :key="note.id">
              <td>
                <div class="cours-info">
                  <strong>{{ note.cours.nom }}</strong>
                  <small>{{ note.cours.formation ? note.cours.formation.nom : 'Formation non définie' }}</small>
                </div>
              </td>
              <td>
                <span :class="['note-valeur', getNoteClass(note.valeur)]">
                  {{ note.valeur }}/20
                </span>
              </td>
              <td>
                <span :class="['appreciation', getNoteClass(note.valeur)]">
                  {{ getAppreciation(note.valeur) }}
                </span>
              </td>
              <td>{{ formaterDate(note.DateAttribution) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="aucune-note">
        <div class="icon-aucune-note">📝</div>
        <h4>Aucune note disponible</h4>
        <p>{{ filtreCours ? 'Aucune note pour ce cours' : 'Vous n\'avez pas encore de notes' }}</p>
      </div>
    </div>

    <!-- Graphique des notes (simulation) -->
    <div class="graphique-notes">
      <h3>Évolution de mes Notes</h3>
      <div class="carte-graphique">
        <div class="barres-notes">
          <div v-for="(note, index) in notesFiltrees.slice(-10)" :key="index" class="barre-note">
            <div class="barre" :style="{ height: (note.valeur / 20) * 100 + '%' }"></div>
            <span class="valeur-barre">{{ note.valeur }}</span>
          </div>
        </div>
        <p class="legende-graphique">Évolution des 10 dernières notes</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotesEtudiant",
  props: {
    notes: {
      type: Array,
      default: () => []
    },
    courses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filtreCours: ''
    }
  },
  computed: {
    notesFiltrees() {
      if (!this.filtreCours) {
        return this.notes.sort((a, b) => new Date(b.DateAttribution) - new Date(a.DateAttribution))
      }
      return this.notes
        .filter(note => note.cours.id == this.filtreCours)
        .sort((a, b) => new Date(b.DateAttribution) - new Date(a.DateAttribution))
    },
    
    moyenneGenerale() {
      if (this.notes.length === 0) return '0.00'
      const somme = this.notes.reduce((acc, note) => acc + note.valeur, 0)
      return (somme / this.notes.length).toFixed(2)
    },
    
    notesReussies() {
      return this.notes.filter(note => note.valeur >= 10).length
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
    },
    
    getAppreciation(valeur) {
      if (valeur >= 16) return 'Excellent'
      if (valeur >= 14) return 'Bien'
      if (valeur >= 12) return 'Assez Bien'
      if (valeur >= 10) return 'Passable'
      return 'Insuffisant'
    }
  }
}
</script>

<style scoped>
.notes-etudiant {
  max-width: 1200px;
}

.resume-notes {
  margin-bottom: 30px;
}

.carte-resume {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 51, 102, 0.3);
}

.carte-resume h3 {
  margin: 0 0 25px 0;
  font-size: 24px;
  text-align: center;
}

.stats-notes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-note {
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-note .valeur {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 5px;
}

.stat-note .label {
  font-size: 14px;
  opacity: 0.9;
}

.filtres-notes {
  margin-bottom: 25px;
}

.select-filtre {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.select-filtre:focus {
  outline: none;
  border-color: #003366;
}

.liste-notes {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.en-tete-notes {
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e0e0;
}

.en-tete-notes h3 {
  margin: 0;
  color: #003366;
  font-size: 20px;
}

.tableau-notes {
  overflow-x: auto;
}

.tableau-notes table {
  width: 100%;
  border-collapse: collapse;
}

.tableau-notes th {
  background-color: #003366;
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.tableau-notes td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.tableau-notes tr:hover {
  background-color: #f8f9fa;
}

.cours-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cours-info strong {
  color: #003366;
}

.cours-info small {
  color: #666;
  font-size: 12px;
}

.note-valeur,
.appreciation {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.note-valeur.excellent,
.appreciation.excellent {
  background-color: #d4edda;
  color: #155724;
}

.note-valeur.bien,
.appreciation.bien {
  background-color: #cce5ff;
  color: #004085;
}

.note-valeur.assez-bien,
.appreciation.assez-bien {
  background-color: #fff3cd;
  color: #856404;
}

.note-valeur.passable,
.appreciation.passable {
  background-color: #ffeaa7;
  color: #6c5ce7;
}

.note-valeur.insuffisant,
.appreciation.insuffisant {
  background-color: #f8d7da;
  color: #721c24;
}

.aucune-note {
  text-align: center;
  padding: 60px 20px;
}

.icon-aucune-note {
  font-size: 64px;
  margin-bottom: 20px;
}

.aucune-note h4 {
  color: #003366;
  font-size: 24px;
  margin-bottom: 10px;
}

.aucune-note p {
  color: #666;
  font-size: 16px;
}

.graphique-notes {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.graphique-notes h3 {
  margin: 0 0 25px 0;
  color: #003366;
  font-size: 20px;
  text-align: center;
}

.carte-graphique {
  text-align: center;
}

.barres-notes {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 10px;
  height: 200px;
  margin-bottom: 20px;
}

.barre-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.barre {
  width: 30px;
  background: linear-gradient(180deg, #FFD700 0%, #003366 100%);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: all 0.3s ease;
}

.barre:hover {
  transform: scaleY(1.1);
}

.valeur-barre {
  font-size: 12px;
  font-weight: bold;
  color: #003366;
}

.legende-graphique {
  color: #666;
  font-size: 14px;
  margin: 0;
}

@media screen and (max-width: 768px) {
  .stats-notes {
    grid-template-columns: 1fr;
  }
  
  .tableau-notes {
    font-size: 12px;
  }
  
  .tableau-notes th,
  .tableau-notes td {
    padding: 8px 6px;
  }
  
  .barres-notes {
    height: 150px;
    gap: 5px;
  }
  
  .barre {
    width: 20px;
  }
}
</style>
