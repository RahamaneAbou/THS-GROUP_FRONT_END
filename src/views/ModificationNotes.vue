<template>
    <div class="modification-notes">
      <!-- Message d'alerte -->
      <header>
        <h2>Modification des Notes</h2>
        <p style="color: red; font-weight: bold;">
          Attention : Vous êtes sur la page de modification des notes. Veuillez faire preuve de vigilance.
        </p>
      </header>
  
      <!-- Liste des Formations -->
      <section v-if="!selectedFormation && !selectedCours" class="formations-section">
        <h3>Sélectionnez une formation :</h3>
        <ul v-if="formations.length > 0">
          <li 
            v-for="formation in formations" 
            :key="formation.id" 
            @click="selectFormation(formation)"
            class="formation-item clickable-item"
          >
            {{ formation.nom }}
          </li>
        </ul>
        <p v-else>Aucune formation attribuée pour le moment.</p>
      </section>
  
      <!-- Liste des Cours dans la Formation Sélectionnée -->
      <section v-if="selectedFormation && !selectedCours" class="courses-section">
        <h4>Cours de la Formation : {{ selectedFormation.nom }}</h4>
        <ul v-if="coursList.length > 0">
          <li 
            v-for="cours in coursList" 
            :key="cours.id" 
            @click="selectCours(cours)"
            class="course-item clickable-item"
          >
            {{ cours.nom }}
          </li>
        </ul>
        <p v-else>Aucun cours associé à cette formation.</p>
      </section>
  
      <!-- Liste des Étudiants avec Champs de Modification -->
      <section v-if="selectedCours" class="students-section">
        <h5>Étudiants inscrits dans le cours : {{ selectedCours.nom }}</h5>
        <table v-if="etudiants.length > 0">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Note Actuelle</th>
              <th>Nouvelle Note</th>
              <th>Valider</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="etudiant in etudiants" :key="etudiant.id">
              <td>{{ etudiant.nom }} {{ etudiant.prenom }}</td>
              <td>{{ etudiant.noteActuelle || "Non disponible" }}</td>
              <td>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  v-model="etudiant.nouvelleNote" 
                  placeholder="Nouvelle note" 
                />
              </td>
              <td>
                <button 
                  @click="updateNote(etudiant.id, etudiant.nouvelleNote)" 
                  class="confirm-button"
                  :disabled="!etudiant.nouvelleNote"
                >
                  Valider
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Aucun étudiant inscrit dans ce cours.</p>
      </section>
    </div>
  </template>

  <script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "ModificationNotes",
  data() {
    return {
      formations: [], // Liste des formations
      selectedFormation: null, // Formation sélectionnée
      coursList: [], // Liste des cours dans la formation sélectionnée
      selectedCours: null, // Cours sélectionné
      etudiants: [], // Liste des étudiants avec leurs notes
      baseURL: "https://api-qrbus.onrender.com/qrbus", // URL de base de l'API
    };
  },
  async created() {
    try {
      // Récupérer toutes les formations
      const response = await axios.get(`${this.baseURL}/formations`);
      this.formations = response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des formations :", error);
      alert("Impossible de charger les formations.");
    }
  },
  methods: {
    // Sélectionner une formation
    selectFormation(formation) {
      this.selectedFormation = formation;
      this.selectedCours = null; // Réinitialiser le cours sélectionné
      this.fetchCoursByFormation();
    },

    // Récupérer les cours d'une formation
    async fetchCoursByFormation() {
      try {
        const response = await axios.get(
          `${this.baseURL}/cours/formation/${this.selectedFormation.id}`
        );
        this.coursList = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
        alert("Impossible de charger les cours pour cette formation.");
      }
    },

    // Sélectionner un cours
    selectCours(cours) {
      this.selectedCours = cours;
      this.fetchEtudiantsByCours();
    },

    // Récupérer les étudiants avec leurs notes pour un cours donné
    async fetchEtudiantsByCours() {
      try {
        const response = await axios.get(
          `${this.baseURL}/notes/cours/${this.selectedCours.id}`
        );
        this.etudiants = response.data.map((note) => ({
          id: note.etudiant.id,
          nom: note.etudiant.nom,
          prenom: note.etudiant.prenom,
          noteActuelle: note.valeur,
          nouvelleNote: null, // Champ pour la nouvelle note
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants :", error);
        alert("Impossible de charger les étudiants pour ce cours.");
      }
    },

    // Mettre à jour la note d'un étudiant
    async updateNote(etudiantId, nouvelleNote) {
      if (!nouvelleNote) {
        alert("Veuillez entrer une nouvelle note valide.");
        return;
      }

      try {
        await axios.put(`${this.baseURL}/notes/update`, {
          etudiantId,
          coursId: this.selectedCours.id,
          valeur: parseFloat(nouvelleNote),
        });
        alert("Note mise à jour avec succès !");
        this.fetchEtudiantsByCours(); // Rafraîchir la liste des étudiants après modification
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la note :", error);
        alert(etudiantId+"oui"+ this.selectedCours.id+"OUI"+ nouvelleNote)
        alert("Une erreur est survenue lors de la mise à jour de la note.");
      }
    },
  },
};
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #003366; /* Bleu foncé */
  --secondary-color: #ffcc00; /* Jaune doré */
  --background-color: #f4f4f4; /* Gris clair */
  --text-color: white;
}

/* Conteneur principal */
.modification-notes {
  background-color: var(--background-color);
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Header */
header {
  background: var(--secondary-color); /* Fond jaune doré */
  color: var(--primary-color); /* Texte bleu foncé */
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}
header p {
  font-size: 1rem;
}

/* Section : Liste des Formations */
.formations-section {
  background: #d1eaff; /* Bleu encore plus clair */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.formations-section h3 {
  color: var(--primary-color); /* Bleu foncé */
  margin-bottom: 15px;
}
.formations-section ul {
  list-style-type: none;
  padding: 0;
}
.formation-item {
  padding: 15px;
  margin: 5px 0;
  background: var(--secondary-color); /* Jaune doré */
  border: 2px solid var(--primary-color); /* Contour bleu foncé */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.formation-item:hover {
  background: #ffe47a; /* Jaune plus clair au survol */
  transform: scale(1.02);
}

/* Section : Liste des Cours */
.courses-section {
  background: #d1eaff; /* Bleu encore plus clair */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.courses-section h4 {
  color: var(--primary-color); /* Bleu foncé */
  margin-bottom: 15px;
}
.courses-section ul {
  list-style-type: none;
  padding: 0;
}
.course-item {
  padding: 10px;
  margin-bottom: 5px;
  background: #e7f1ff; /* Bleu très clair */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.course-item:hover {
  background: #d1eaff; /* Bleu encore plus clair au survol */
}

/* Section : Liste des Étudiants */
.students-section {
  background: var(--secondary-color); /* Jaune doré */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.students-section h5 {
  color: var(--primary-color); /* Bleu foncé */
  margin-bottom: 15px;
}
.students-section table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.students-section th,
.students-section td {
  padding: 10px;
  border: 1px solid var(--primary-color); /* Contour bleu foncé */
  text-align: left;
  font-size: 1rem;
}
.students-section th {
  background-color: var(--secondary-color); /* Jaune doré */
  color: var(--primary-color); /* Bleu foncé */
  font-weight: bold;
}

/* Boutons : Valider la Note */
.confirm-button {
  background: var(--primary-color); /* Bleu foncé */
  color: var(--text-color); /* Texte blanc */
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 1rem;
}
.confirm-button:hover {
  background: #28a745; /* Vert plus clair au survol */ 
  transform: scale(1.02);
}

/* Input pour saisir la nouvelle note */
input[type="number"] {
  padding: 5px;
  border: 1px solid var(--primary-color); /* Contour bleu foncé */
  border-radius: 5px;
  margin-right: 10px;
  font-size: 1rem;
}
</style>
