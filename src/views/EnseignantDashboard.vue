<template>
  <div class="dashboard-container" v-if="isDataLoaded">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <h2>Tableau de Bord</h2>
      <ul>
        <li @click="clearSelection">Accueil</li>
        <li 
          v-for="formation in formations" 
          :key="formation.id" 
          @click="selectFormation(formation)"
        >
          {{ formation.nom }}
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <header>
        <h1>Bienvenue, {{ teacherName }} !</h1>
        <p>Matricule : {{ teacherMatricule }}</p>
      </header>

      <section class="summary">
        <h2>Résumé Professionnel</h2>
        <div class="info-card">
          <p><strong>Spécialité :</strong> {{ teacherSpecialty || "Non disponible" }}</p>
          <p><strong>Formations enseignées :</strong> {{ formationCount || "Aucune" }}</p>
        </div>
      </section>

      <section v-if="selectedFormation" class="courses-section">
        <h2>Cours de {{ selectedFormation.nom }}</h2>
        <ul>
          <li 
            v-for="course in courses" 
            :key="course.id" 
            @click="selectCourse(course)"
            class="clickable-item"
          >
            {{ course.nom }}
          </li>
        </ul>
      </section>

      <section v-if="selectedCourse" class="students-section">
        <h2>Étudiants du cours : {{ selectedCourse.nom }}</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="student in students" 
              :key="student.etudiant.id"
            >
              <td>{{ student.etudiant.prenom }} {{ student.etudiant.nom }}</td>
              <td>{{ student.note.valeur || "Non disponible" }}</td>
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
  name: "TeacherDashboard",
  data() {
    return {
      teacherId: "", // ID de l'enseignant
      teacherMatricule: "", // Matricule de l'enseignant
      teacherName: "", // Nom complet de l'enseignant
      teacherSpecialty: "", // Spécialité de l'enseignant
      formations: [], // Liste des formations enseignées
      courses: [], // Liste des cours d'une formation sélectionnée
      students: [], // Liste des étudiants dans un cours sélectionné
      selectedFormation: null, // Formation actuellement sélectionnée
      selectedCourse: null, // Cours actuellement sélectionné
      isDataLoaded: false, // Indicateur de chargement des données
      baseURL: "http://localhost:8080/THS-GROUP", // URL de base de l'API
    };
  },
  async created() {
    try {
      const userId = Cookies.get("userId");
      this.teacherMatricule = Cookies.get("userMatricule");

      if (!userId) throw new Error("Données utilisateur non trouvées.");

      // Récupérer les informations de l'enseignant
      const teacherResponse = await axios.get(`${this.baseURL}/enseignants/${userId}`);
      this.teacherName = `${teacherResponse.data.prenom} ${teacherResponse.data.nom}`;
      this.teacherSpecialty = teacherResponse.data.specialty || "Non spécifiée";

      // Récupérer toutes les formations enseignées par cet enseignant via ses cours
      const coursesResponse = await axios.get(`${this.baseURL}/cours/getByEnseignantId/${userId}`);
      const courses = coursesResponse.data;

      // Filtrer les formations uniques
      const formationIds = [...new Set(courses.map((c) => c.formation.id))];
      const formationPromises = formationIds.map(async (id) => {
        const response = await axios.get(`${this.baseURL}/formations/${id}`);
        return response.data;
      });

      this.formations = await Promise.all(formationPromises);

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
      this.selectedFormation = null;
      this.selectedCourse = null;
      this.courses = [];
      this.students = [];
    },

    // Sélectionner une formation
    async selectFormation(formation) {
      this.selectedFormation = formation;
      this.selectedCourse = null; // Réinitialiser le cours sélectionné
      this.students = []; // Réinitialiser la liste des étudiants

      try {
        // Récupérer tous les cours associés à cette formation
        const response = await axios.get(`${this.baseURL}/cours/formation/${formation.id}`);
        this.courses = response.data.filter(
          (course) => course.enseignantId === parseInt(Cookies.get("userId"))
        );
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
        alert("Impossible de charger les cours pour cette formation.");
      }
    },

    // Sélectionner un cours
    async selectCourse(course) {
      this.selectedCourse = course;

      try {
        // Récupérer tous les étudiants inscrits dans ce cours
        const notesResponse = await axios.get(`${this.baseURL}/notes/cours/${course.id}`);
        this.students = notesResponse.data.map((note) => ({
          etudiant: note.etudiant,
          note: note,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants :", error);
        alert("Impossible de charger les étudiants pour ce cours.");
      }
    },
  },
  computed: {
    // Calculer le nombre total de formations enseignées
    formationCount() {
      return this.formations.length;
    },
  },
};
</script>
<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif; /* Police de caractères moderne */
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #003366;
  color: white;
  padding: 20px;
  font-weight: bold;
  font-size: 1rem; /* Taille de police uniforme */
}
.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.5rem; /* Titre plus grand */
  text-transform: uppercase; /* Texte en majuscules */
  letter-spacing: 1px; /* Espacement entre lettres */
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  margin-bottom: 5px;
  font-size: 1rem; /* Taille de police uniforme */
}
.sidebar li:hover {
  background: #0055a4;
  color: white;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background: #f8f9fa;
  font-family: 'Georgia', serif; /* Police plus élégante */
  line-height: 1.6; /* Interligne pour une meilleure lisibilité */
  color: #333; /* Couleur de texte plus sombre */
}

/* Header */
header {
  background: #003366;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 1.5rem; /* Titre principal plus grand */
}
header p {
  font-size: 1rem; /* Sous-titre avec une taille réduite */
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
  font-size: 1rem; /* Taille de police uniforme */
  margin: 5px 0;
}
.info-card strong {
  font-weight: bold;
  color: #003366; /* Mise en évidence avec une couleur bleu foncé */
}

/* Courses Section */
.courses-section {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.courses-section h2 {
  font-size: 1.25rem; /* Titre section avec une taille intermédiaire */
  margin-bottom: 10px;
  color: #003366;
}
.clickable-item {
  padding: 10px;
  border: 1px solid #003366;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  background-color: #e7f1ff;
  color: #003366;
  font-size: 1rem; /* Taille de police uniforme */
}
.clickable-item:hover {
  background-color: #d1eaff;
  color: #001f3f;
  transform: scale(1.05);
}

/* Students Section */
.students-section {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.students-section h2 {
  font-size: 1.25rem; /* Titre section avec une taille intermédiaire */
  margin-bottom: 10px;
  color: #003366;
}
.students-section table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.students-section th,
.students-section td {
  border: 1px solid #003366;
  padding: 10px;
  text-align: left;
  font-size: 1rem; /* Taille de police uniforme */
}
.students-section th {
  background-color: #003366;
  color: white;
  font-weight: bold;
}

/* Loading Message */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #003366;
  margin-top: 20%;
}
</style>