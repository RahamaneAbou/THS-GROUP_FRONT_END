<template>
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <h2>Tableau de Bord</h2>
      <ul>
        <li @click="currentTab = 'formations'">Liste des Formations</li>
        <li @click="currentTab = 'inscriptions'">Gestion des Inscriptions</li>
        <li @click="currentTab = 'notes'">Modification des Notes</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Si les données sont chargées -->
      <div v-if="isDataLoaded">
        <header class="body">
          <h1>Bienvenue, {{ agentName }} !</h1>
          <p>Matricule : {{ agentMatricule }}</p>
        </header>
        <!-- Affichage du composant pour la modification des notes -->
      <modification-notes v-if="currentTab === 'notes'" />
        <!-- Section Liste des Formations -->
        <section v-if="currentTab === 'formations'" class="formations-section">
          <h2>Liste des Formations</h2>
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

          <!-- Contenu de la formation sélectionnée -->
          <div v-if="selectedFormation">
            <h3>{{ selectedFormation.nom }}</h3>
            <!-- Boutons pour afficher étudiants confirmés et rejetés -->
            <button @click="fetchInscriptionsByStatus('COMFIMER')" class="action-button">Étudiants Confirmés</button>
            <button @click="fetchInscriptionsByStatus('REFUSER')" class="action-button">Étudiants Rejetés</button>
          </div>

          <!-- Afficher Étudiants Confirmés -->
          <div v-if="currentAction === 'etudiants-confirmes'" class="students-section">
            <h4>Étudiants Confirmés</h4>
            <ul v-if="etudiantsConfirmes.length > 0" class="students-list">
              <li v-for="etudiant in etudiantsConfirmes" :key="etudiant.id" class="student-item">
                Nom : {{ etudiant.nom }}<br />
                Prénom : {{ etudiant.prenom }}<br />
                Numéro Matricule : {{ etudiant.numMatricule }}
              </li>
            </ul>
            <p v-else>Aucun étudiant confirmé dans cette formation.</p>
          </div>

          <!-- Afficher Étudiants Rejetés -->
          <div v-if="currentAction === 'etudiants-rejetes'" class="students-section">
            <h4>Étudiants Rejetés</h4>
            <ul v-if="etudiantsRejetes.length > 0" class="students-list">
              <li v-for="etudiant in etudiantsRejetes" :key="etudiant.id" class="student-item">
                Nom : {{ etudiant.nom }}<br />
                Prénom : {{ etudiant.prenom }}<br />
                Formation : {{ inscription.formation.nom }}<br /> <!-- Ajout du nom de la formation -->
                Numéro Matricule : {{ etudiant.numMatricule }}
              </li>
            </ul>
            <p v-else>Aucun étudiant rejeté dans cette formation.</p>
          </div>
        </section>

        <!-- Section Gestion des Inscriptions -->
        <section v-if="currentTab === 'inscriptions'" class="inscriptions-section">
          <h2>Gestion des Inscriptions</h2>
          <div>
            <button @click="fetchInscriptionsByStatus('EN_ATTENTE')" class="action-button">En Attente</button>
            <button @click="fetchInscriptionsByStatus('COMFIMER')" class="action-button">Confirmés</button>
            <button @click="fetchInscriptionsByStatus('REFUSER')" class="action-button">Rejetés</button>
          </div>

          <div v-if="inscriptions.length > 0">
            <ul>
              <li v-for="inscription in inscriptions" :key="inscription.id" class="inscription-item">
                <p>
                  Nom : {{ inscription.etudiant.nom }}<br />
                  Prénom : {{ inscription.etudiant.prenom }}<br />
                  Numéro Matricule : {{ inscription.etudiant.numMatricule }}<br />
                  Email : {{ inscription.etudiant.email }}<br />
                  Statut : <span class="status-views"> {{ inscription.status }} </span>
                </p>
                <!-- Boutons pour confirmation/refus uniquement en attente -->
                <div v-if="inscription.status === 'EN_ATTENTE'">
                  <button @click="confirmInscription(inscription.id)" class="confirm-button">Confirmer</button>
                  <button @click="refuseInscription(inscription.id)" class="refuse-button">Refuser</button>
                </div>
              </li>
            </ul>
          </div>
          <p v-else>Aucune inscription dans cette catégorie pour le moment.</p>
        </section>
      </div>

      <!-- Message de chargement global -->
      <div v-else class="loading-message">
        <p>Chargement des données...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

import ModificationNotes from './ModificationNotes.vue'; // Importez le nouveau composant


export default {
  name: "AgentDashboard",
  components: {
    ModificationNotes, // Déclarez le composant
  },
  data() {
    return {
      personnelId: "", // ID du personnel
      personnelMatricule: "", // Matricule du personnel
      agentName: "", // Nom complet de l'agent
      formations: [], // Liste des formations
      selectedFormation: null, // Formation sélectionnée
      inscriptions: [], // Liste des inscriptions filtrées
      etudiantsConfirmes: [], // Liste des étudiants confirmés
      etudiantsRejetes: [], // Liste des étudiants rejetés
      currentTab: "formations", // Tab actif par défaut
      currentAction: "", // Action actuelle (étudiants confirmés, rejetés, etc.)
      isDataLoaded: false, // Indicateur de chargement global
      baseURL: "https://api-qrbus.onrender.com/qrbus", // URL de base de l'API
    };
  },
  async created() {
    try {
      const agentId = Cookies.get("userId");
      this.personnelMatricule = Cookies.get("userMatricule");

      if (!agentId || !this.personnelMatricule) {
        throw new Error("Données utilisateur non trouvées.");
      }

      // Récupérer les informations du personnel
      const agentResponse = await axios.get(`${this.baseURL}/personnels/${agentId}`);
      this.agentName = `${agentResponse.data.prenom} ${agentResponse.data.nom}`;
      this.agentMatricule=  `${agentResponse.data.numMatricule}`;

      // Récupérer toutes les formations
      const formationsResponse = await axios.get(`${this.baseURL}/formations`);
      this.formations = formationsResponse.data;

      this.isDataLoaded = true;
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      alert("Impossible de charger les données.");
    }
  },
  methods: {
    // Sélectionner une formation
    selectFormation(formation) {
      this.selectedFormation = formation;
      this.currentAction = ""; // Réinitialiser l'action
    },

    // Récupérer les inscriptions selon leur statut
    async fetchInscriptionsByStatus(status) {
      try {
        let endpoint = `/inscriptions/en-attente`;
        if (status === "COMFIMER") {
          endpoint = `/inscriptions/confirmes`;
          this.currentAction = "etudiants-confirmes"; // Mettre à jour l'action
        } else if (status === "REFUSER") {
          endpoint = `/inscriptions/rejetees`;
          this.currentAction = "etudiants-rejetes"; // Mettre à jour l'action
        } else {
          this.currentAction = ""; // Réinitialiser l'action
        }

        const response = await axios.get(`${this.baseURL}${endpoint}`);
        this.inscriptions = response.data.map((inscription) => ({
          ...inscription,
          etudiant: inscription.etudiant, // Ajouter explicitement les détails de l'étudiant
        }));

        // Si on charge les confirmés ou rejetés, remplir les listes correspondantes
        if (status === "COMFIMER") {
          this.etudiantsConfirmes = this.inscriptions.map((i) => i.etudiant);
        } else if (status === "REFUSER") {
          this.etudiantsRejetes = this.inscriptions.map((i) => i.etudiant);
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des inscriptions (${status}) :`, error);
        alert("Impossible de charger les inscriptions.");
      }
    },

    // Confirmer une inscription
    async confirmInscription(inscriptionId) {
      try {
        await axios.put(`${this.baseURL}/inscriptions/${inscriptionId}`, {
          status: "COMFIMER",
          dateConfirmation: new Date().toISOString(),
        });
        alert("Inscription confirmée avec succès !");
        await this.fetchInscriptionsByStatus("EN_ATTENTE"); // Rafraîchir la liste des inscriptions en attente
      } catch (error) {
        console.error("Erreur lors de la confirmation de l'inscription :", error);
        alert("Une erreur est survenue lors de la confirmation de l'inscription.");
      }
    },

    // Refuser une inscription
    async refuseInscription(inscriptionId) {
      try {
        await axios.put(`${this.baseURL}/inscriptions/${inscriptionId}`, {
          status: "REFUSER",
          dateConfirmation: null,
        });
        alert("Inscription refusée avec succès !");
        await this.fetchInscriptionsByStatus("EN_ATTENTE"); // Rafraîchir la liste des inscriptions en attente
      } catch (error) {
        console.error("Erreur lors du refus de l'inscription :", error);
        alert("Une erreur est survenue lors du refus de l'inscription.");
      }
    },
  },
};
</script>

<style scoped>
.students-section {

background: 4169E1; /* Rouge moyen */
padding: 20px;
border-radius: 10px;
box-shadow: 0 4px 6px rgba(0, 0, 2, 2);
}
.students-section h4 {
color: var(--primary-color); /* Rouge foncé */
margin-bottom: 15px;
}
.students-section ul {
list-style-type: none;
padding: 0;
}
.student-item{
  border:1px solid #FFFAFA;
  padding: 10px;
  margin-bottom: 5px;
  background: rebeccapurple; /* Rouge moyen */
  border-radius: 5px;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  
}
.body{
  background-color: #00008B ;
  color: #FFFAFA ;
}
/* Variables CSS */
:root {
  --primary-color: #003366; /* Bleu foncé */
  --secondary-color: #ffcc00; /* Jaune doré */
  --background-color: #f4f4f4; /* Gris clair */
  --text-color: white;
}

/* Conteneur principal */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #00008B; /* Fond rouge foncé */
  color: #F8F8FF; /* Texte blanc */
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
  background: 	#0000CD; /* Rouge moyen */
  color: var(--text-color); /* Texte blanc */
}
.sidebar li:hover {
  background: darken(var(--primary-color), 10%); /* Rouge plus foncé au survol */
  transform: scale(1.05);
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background: var(--primary-color); /* Fond bleu foncé */
  color: var(--text-color); /* Texte blanc pour contraste */
}

/* Header */
header {
  background: var(--primary-color); /* Fond bleu foncé */
  color: var(--text-color); /* Texte blanc */
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}
header p {
  font-size: 1rem;
}

/* Boutons principaux */
.action-button {
  background: #4169E1; /* Jaune doré */
  color: var(--primary-color); /* Bleu foncé */
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 1rem;
}
.action-button:hover {
  background: lighten(var(--secondary-color), 20%); /* Jaune encore plus clair au survol */
  transform: scale(1.05);
}

/* Section : Liste des Formations */
.formations-section {
  background: #ADD8E6; /* Bleu ciel */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.formations-section h2 {
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
  background: lighten(var(--secondary-color), 10%); /* Jaune plus clair au survol */
  transform: scale(1.02);
}

/* Section : Gestion des Inscriptions */
.inscriptions-section {
  background: var(--secondary-color); /* Jaune doré */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(2, 0, 0, 2);
}
.inscriptions-section h2 {
  color: var(--primary-color); /* Bleu foncé */
  margin-bottom: 15px;
}
.inscription-item {
  padding: 10px;
  margin-bottom: 5px;
  background: var(--background-color); /* Gris clair */
  border: 1px solid red; /* Contour bleu foncé */
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  border:1px solid #000080;
}
.inscription-item:hover {
  background: lighten(var(--secondary-color), 10%); /* Jaune plus clair au survol */
}

/* Boutons : Confirmer/Refuser */
.confirm-button,
.refuse-button {
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
.refuse-button:hover {
  background: #dc3545; /* Rouge plus clair au survol */
  transform: scale(1.02);
}
.status-views{
  background: #0000CD; /* Bleu foncé */
  color: 	#FFFAFA; /* Texte blanc */
  border: none;
  padding: 5px 5px;
}
.confirm-button {
  background: #1E90FF; /* Vert plus clair au survol */
  
}
.refuse-button {
  background: rebeccapurple; /* Rouge plus clair au survol */
 
}

/* Message de chargement */
.loading-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: var(--secondary-color); /* Jaune doré */
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--secondary-color); /* Jaune doré */
  border-top: 5px solid var(--primary-color); /* Bleu foncé */
  border-radius: 50%;
  animation: spin 1s linear infinite; /* Animation de rotation */
  margin-bottom: 20px;
}

/* Animations personnalisées */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
