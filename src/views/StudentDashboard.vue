<template>
  <div class="dashboard-container" v-if="isDataLoaded">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <h2>Tableau de Bord</h2>
      <ul>
        <li @click="clearSelection">Accueil</li>
        <li 
          v-for="course in courses" 
          :key="course.id" 
          @click="selectCourse(course)"
        >
          {{ course.nom }}
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <header>
        <h1>Bienvenue, {{ studentName }} !</h1>
        <p>Matricule : {{ studentMatricule }}</p>
      </header>

      <section class="summary">
        <h2>Résumé Personnel</h2>
        <div class="info-card">
          <p><strong>Formation :</strong> {{ studentFormation.nom || "Non disponible" }}</p>
          <p><strong>Cours inscrits :</strong> {{ courseCount || "Aucun" }}</p>
        </div>
      </section>

      <section v-if="selectedCourse" class="notes-section">
        <h2>Mes Notes pour le Cours : {{ selectedCourse.nom }}</h2>
        <table>
          <thead>
            <tr>
              <th>Nom du Cours</th>
              <th>Note</th>
              <th>Date d'Attribution</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="note in notes" 
              :key="note.id"
            >
              <td>{{ selectedCourse.nom }}</td>
              <td>{{ note.valeur || "Non disponible" }}</td>
              <td>{{ formatDate(note.dateAttribution) || "Non disponible" }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>

  <div v-else class="loading">Chargement des données...</div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "StudentDashboard",
  data() {
    return {
      studentId: "", // ID de l'étudiant
      studentMatricule: "", // Matricule de l'étudiant
      studentName: "", // Nom complet de l'étudiant
      studentFormation: {}, // Formation de l'étudiant
      courses: [], // Liste des cours dans la formation de l'étudiant
      notes: [], // Liste des notes de l'étudiant
      selectedCourse: null, // Cours actuellement sélectionné
      isDataLoaded: false, // Indicateur de chargement des données
      baseURL: "http://localhost:8080/THS-GROUP", // URL de base de l'API
    };
  },
  async created() {
    try {
      const userId = Cookies.get("userId");
      this.studentMatricule = Cookies.get("userMatricule");

      if (!userId) throw new Error("Données utilisateur non trouvées.");

      // Récupérer les informations de l'étudiant
      const studentResponse = await axios.get(`${this.baseURL}/etudiants/${userId}`);
      this.studentName = `${studentResponse.data.prenom} ${studentResponse.data.nom}`;
      this.studentFormation = studentResponse.data.formation;

      // Récupérer tous les cours associés à sa formation
      const coursesResponse = await axios.get(`${this.baseURL}/cours/formation/${this.studentFormation.id}`);
      this.courses = coursesResponse.data;

      // Récupérer toutes les notes de cet étudiant
      const notesResponse = await axios.get(`${this.baseURL}/notes/etudiant/${userId}`);
      this.notes = notesResponse.data;

      // Marquer les données comme chargées
      this.isDataLoaded = true;
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      alert("Impossible de charger les données.");
    }
  },
  methods: {
    // Réinitialiser la sélection
    clearSelection() {
      this.selectedCourse = null;
    },

    // Sélectionner un cours
    selectCourse(course) {
      this.selectedCourse = course;
    },

    // Formater la date
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
  },
  computed: {
    // Calculer le nombre total de cours inscrits
    courseCount() {
      return this.courses.length;
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif; /* Police moderne */
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #003366; /* Bleu foncé */
  color: white; /* Texte blanc */
  padding: 20px;
  font-weight: bold;
  font-size: 1rem;
}
.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-radius: 5px;
  margin-bottom: 5px;
  font-size: 1rem;
}
.sidebar li:hover {
  background: #0055a4; /* Bleu plus clair au survol */
  color: white; /* Texte blanc au survol */
  transform: scale(1.05); /* Effet de zoom */
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background: #f8f9fa; /* Fond clair */
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #333;
}

/* Header */
header {
  background: #003366; /* Bleu foncé pour le header */
  color: white; /* Texte blanc */
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}
header p {
  font-size: 1rem;
}

/* Info Card */
.info-card {
  background: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.info-card p {
  font-size: 1rem;
  margin: 5px 0;
}
.info-card strong {
  font-weight: bold;
  color: #003366; /* Mise en évidence avec le bleu foncé */
}

/* Notes Section */
.notes-section {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.notes-section h2 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #003366; /* Titre en bleu foncé */
}
.notes-section table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.notes-section th,
.notes-section td {
  border: 1px solid #003366;
  padding: 10px;
  text-align: left;
  font-size: 1rem;
}
.notes-section th {
  background-color: #003366; /* En-tête de tableau en bleu foncé */
  color: white; /* Texte blanc */
  font-weight: bold;
}

/* Loading Message */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #003366; /* Bleu foncé pour le message de chargement */
  margin-top: 20%;
}
</style>