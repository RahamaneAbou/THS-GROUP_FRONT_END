<template>
  <div class="book-container">
    <!-- Page de gauche - Formulaire -->
    <div class="book-page left-page">
      <div class="page-header">
        <div class="logo-container">
          <img src="../../src/assets/logo.jpg" alt="Logo" class="logo">
        </div>
        <h2>Inscription</h2>
      </div>
      <form class="inscription-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nom">
            <i class="fas fa-user"></i> Nom
          </label>
          <input type="text" id="nom" v-model="form.nom" required>
        </div>
  
        <div class="form-group">
          <label for="prenom">
            <i class="fas fa-user"></i> Prénom
          </label>
          <input type="text" id="prenom" v-model="form.prenom" required>
        </div>
  
        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i> Email
          </label>
          <input type="email" id="email" v-model="form.email">
        </div>

        <div class="form-group">
          <label for="tel">
            <i class="fas fa-envelope"></i> Telephone
          </label>
          <input type="number" id="tel" v-model="form.numeroTelephone" required>
        </div>

        <div class="form-group">
          <label for="dateNaissance">
            <i class="fas fa-calendar-alt"></i> Date de naissance
          </label>
          <input 
            type="date" 
            id="dateNaissance" 
            v-model="form.dateNaissance" 
            required
            :max="maxDate"
          >
        </div>

         <!-- ... autres éléments ... -->
         <div class="form-group">
      <label for="formation">
        <i class="fas fa-graduation-cap"></i> Formation
      </label>
      <div v-if="isLoading">Chargement des formations...</div>
      <select 
        v-else
        id="formation" 
        v-model="form.formation" 
        required
        :disabled="isLoading"
      >
        <option value="">Sélectionnez une formation</option>
        <option 
          v-for="formation in formations" 
          :key="formation.id" 
          :value="formation.id"
        >
          {{ formation.nom }}
        </option>
      </select>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  
        <button type="submit">
          <i class="fas fa-paper-plane"></i> S'inscrire
        </button>
      </form>
    </div>

    <!-- Page de droite - Détails de la formation -->
    <div class="book-page right-page">
      <div class="formation-details" v-if="form.formation">
        <div class="formation-header">
          <h2>{{ selectedFormation?.nom }}</h2>
          <div class="formation-badge">{{ selectedFormation?.duree }}</div>
        </div>
        
        <div class="formation-content">
          <div class="description-card">
            <h3>Description</h3>
            <p>{{ selectedFormation?.description }}</p>
          </div>

          <div class="points-cles-card">
            <h3>Points clés de la formation</h3>
            <ul>
              <li v-for="(point, index) in selectedFormation?.pointsCles" 
                  :key="index">
                <i class="fas fa-check"></i>
                {{ point }}
              </li>
            </ul>
          </div>

          <div class="formation-footer">
            <div class="stats-container">
              <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>{{ selectedFormation?.duree }}</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>{{ selectedFormation?.placesDisponibles }} places</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="formation-placeholder" v-else>
        <i class="fas fa-book-open placeholder-icon"></i>
        <h3>Sélectionnez une formation</h3>
        <p>Découvrez nos programmes de formation professionnelle</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Inscription",
  data() {
    return {
      form: {
        nom: '',
        prenom: '',
        email: '',
        numeroTelephone:'',
        dateNaissance: '',
        numeroTelephone: '',
        formation: ''
      },
      formations: [],
      isLoading: false,
      error: null,
      baseURL: 'https://api-qrbus.onrender.com/qrbus'
    };
  },
  computed: {
    selectedFormation() {
      return this.formations.find(f => f.id === this.form.formation) || null;
    }
  },
  methods: {
    EstVideVariable() {
      const champsVides = [];
      
      for (const [key, value] of Object.entries(this.form)) {
        if (!value) {
          champsVides.push(key);
        }
      }

      if (champsVides.length > 0) {
        alert(`Veuillez remplir les champs suivants : ${champsVides.join(', ')}`);
        return false;
      }

      return true;
    },

    async fetchFormations() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Début du chargement des formations");
        const response = await axios.get(`${this.baseURL}/formations`);
        console.log("Réponse de l'API:", response.data);
        this.formations = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
        this.error = "Impossible de charger les formations. Veuillez réessayer.";
      } finally {
        this.isLoading = false;
      }
    },
    
    calculateAge(dateNaissance) {
      const today = new Date();
      const birthDate = new Date(dateNaissance);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },

    async submitInscription() {
      this.isLoading = true;
      this.error = null;
      try {
        const etudiant = {
          nom: this.form.nom,
          prenom: this.form.prenom,
          age: this.calculateAge(this.form.dateNaissance),
          email: this.form.email,
          numeroTelephone: this.form.numeroTelephone,
          formation: { id: this.form.formation },
          statusInscription: 'EN_ATTENTE',
          dateInscription:  new Date().toISOString(),
        };

        const response = await axios.post(`${this.baseURL}/etudiants`, etudiant);
        console.log("Inscription réussie:", response.data);
        // recuper le id 
        if (response.data && response.data.id) {
        await this.ajouterInscription(response.data.id);
        console.log('inscriptions reussie')
       } else {
        throw new Error("L'ID de l'étudiant n'a pas été renvoyé.");
      }
        // Rediriger ou afficher un message de succès
        Swal.fire({
        title: "Inscription réussie !",
        text: "Votre inscription a été enregistrée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
        
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        this.error = "Impossible de finaliser l'inscription. Veuillez réessayer.";
      } finally {
        this.isLoading = false;
      }
    },
    // la fonciton pour ajouter une inscriptipn
    async ajouterInscription(etudiantId) {
  try {
    const inscription = {
      dateCreation: new Date().toISOString(), // Corrigé : correspond à l'entité Java
      etudiant: { id: etudiantId }, //  Corrigé : doit être un objet
      formation: { id: this.form.formation }, //  Corrigé : doit être un objet
      status: 'EN_ATTENTE',
    };

    const response_1 = await axios.post(`${this.baseURL}/inscriptions/createInscription`, inscription);
    alert(response_1)
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'inscription:", error);
    this.error = "Impossible de finaliser l'inscription après l'insertion de l'étudiant.";
  }
},

    async handleSubmit() {
      if (this.EstVideVariable()) {
        this.submitInscription();
        alert("Inscription reussi")
      }
    }
  },
  mounted() {
    this.fetchFormations();
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
.book-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  perspective: 1500px;
}

.book-page {
  background: white;
  width: 500px;
  min-height: 700px;
  padding: 2rem;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.left-page {
  border-radius: 15px 0 0 15px;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to right, #ffffff 97%, #f0f0f0 100%);
  border-right: 2px solid #0066cc;
}

.right-page {
  border-radius: 0 15px 15px 0;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to left, #ffffff 97%, #f0f0f0 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  margin-bottom: 1rem;
}

.logo {
  width: 80px;
  height: auto;
}

h2 {
  color: #0066cc;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: #ffd700;
}

/* Style du formulaire */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #0066cc;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

label i {
  margin-right: 0.5rem;
  color: #ffd700;
}

input, select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
  background: #f8f9fa;
}

input[type="date"] {
  padding: 0.9rem;
  color: #0066cc;
  font-family: inherit;
}

input:focus, select:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  background: white;
}

button {
  width: 100%;
  padding: 1rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

button:hover {
  background: #0052a3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 102, 204, 0.2);
}

/* Styles améliorés pour la page de droite */
.formation-details {
  height: 100%;
  padding: 1rem;
  animation: fadeIn 0.5s ease-out;
}

.formation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ffd700;
}

.formation-badge {
  background: #ffd700;
  color: #0066cc;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description-card, .points-cles-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #0066cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.description-card:hover, .points-cles-card:hover {
  transform: translateY(-2px);
}

.description-card h3, .points-cles-card h3 {
  color: #0066cc;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ffd700;
}

.description-card p {
  color: #2c3e50;
  line-height: 1.8;
  font-size: 1.1rem;
  text-align: justify;
}

.points-cles-card ul {
  list-style: none;
  padding: 0;
}

.points-cles-card li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-size: 1.05rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.points-cles-card li:hover {
  background-color: rgba(0, 102, 204, 0.05);
}

.points-cles-card li i {
  color: #ffd700;
  margin-right: 1rem;
  font-size: 1.1rem;
}

.formation-footer {
  margin-top: 2rem;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  padding: 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 102, 204, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #0066cc;
  font-weight: 600;
}

.stat-item i {
  color: #ffd700;
  font-size: 1.2rem;
}

.formation-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #0066cc;
  animation: fadeIn 0.5s ease-out;
}

.placeholder-icon {
  font-size: 4rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.formation-placeholder h3 {
  color: #0066cc;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.formation-placeholder p {
  color: #2c3e50;
  font-size: 1.1rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .book-container {
    flex-direction: column;
    padding: 1rem;
  }

  .book-page {
    width: 100%;
    max-width: 500px;
    margin: 1rem 0;
    border-radius: 15px;
  }

  .left-page, .right-page {
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

/* Animation du bouton */
button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  transition: all 0.5s;
}

button:hover::after {
  left: 100%;
}
</style>
