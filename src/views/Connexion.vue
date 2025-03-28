<template>
  <div>
    <div class="login-container">
      <!-- Fond avec dégradé bleu-jaune -->
      <div class="background"></div>

      <!-- Formulaire de connexion -->
      <div class="login-form">
        <h2>Connexion</h2>

        <!-- Sélection du rôle -->
        <div class="role-selection">
          <label for="role">Rôle :</label>
          <select id="role" v-model="selectedRole" required>
            <option value="etudiant">Étudiant</option>
            <option value="enseignant">Enseignant</option>
            <option value="agent_administratif">Agent administratif</option>
            <option value="administrateur">Administrateur</option>
          </select>
        </div>

        <!-- Champ Numéro Matricule -->
        <div class="input-group">
          <label for="numMatricule">Numéro Matricule :</label>
          <input type="text" id="numMatricule" v-model="numeMatricule" placeholder="Votre Numéro Matricule" required />
        </div>

        <!-- Bouton de connexion -->
        <button @click="handleLogin" class="login-button">Se connecter</button>

        <!-- Lien pour réinitialiser le mot de passe -->
        <p class="forgot-password">
          <a href="#">Mot de passe oublié ?</a>
        </p>
      </div>

      <!-- Le pied de page -->
    </div>
    <Footer_ />
  </div>
</template>

<script>
import Footer_ from "../components/Comp_PageAcueil/footer.vue";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie"; // Importer js-cookie

export default {
  name: "Login",
  components: {
    Footer_,
  },
  data() {
    return {
      selectedRole: "", // Rôle sélectionné par défaut
      numeMatricule: "", // Numéro matricule de l'utilisateur
      password: "", // Mot de passe de l'utilisateur
      baseURL: "http://localhost:8080/THS-GROUP", // URL de base de l'API
      etud: {}, // Objet pour stocker les données de l'utilisateur
      path_2: "" // Chemin vers la page après connexion
    };
  },
  methods: {
    async handleLogin() {
      if (!this.numeMatricule) {
        // Vérifier si le champ numéro matricule est vide
        Swal.fire({
          title: "ERREUR D'authentification !",
          text: "Veuillez entrer votre numéro matricule.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        let endpoint = ""; // Variable pour stocker l'endpoint approprié
        let redirectPath = ""; // Variable pour stocker le chemin de redirection

        // Déterminer l'endpoint et le chemin de redirection en fonction du rôle sélectionné
        if (this.selectedRole === "etudiant") {
          endpoint = `${this.baseURL}/etudiants/getEtudiantByNumMatricule/${this.numeMatricule}`;
          redirectPath = "/etudiant";
        } else if (this.selectedRole === "enseignant") {
          endpoint = `${this.baseURL}/enseignants/getEnseignantByNumMatricule/${this.numeMatricule}`;
          redirectPath = "/enseignant";
        } else if(this.selectedRole === "agent_administratif"){
          endpoint = `${this.baseURL}/personnels/matricule/${this.numeMatricule}`;
          redirectPath = "/AgentDashboard";
        }else if(this.selectedRole === "administrateur"){
          endpoint = `${this.baseURL}/personnels/matricule/${this.numeMatricule}`;
          redirectPath = "/Admin";
        }
        else {
          throw new Error("Rôle non pris en charge."); // Gérer les autres rôles
        }

        // Appel à l'API avec l'endpoint approprié
        const response = await axios.get(endpoint);

        if (response.data) {
          this.etud = response.data;

          // Stocker l'ID et le numéro matricule dans des cookies
          Cookies.set("userId", this.etud.id, { expires: 7 }); // Expiration : 7 jours
          Cookies.set("userMatricule", this.etud.numMatricule, { expires: 7 });

          if (!Cookies.get("userId") || !Cookies.get("userMatricule")) {
            throw new Error("Données d'utilisateur non trouvées dans les cookies.");
          } else {
            // Rediriger vers la page correspondante selon le rôle
            setTimeout(() => {
              const route = this.$router.resolve({ path: redirectPath });
              window.open(route.href, "_blank");
            }, 100);
          }
        } else {
          Swal.fire({
            title: "NOT FOUND",
            text: "Les informations entrées sont introuvables.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'appel API :", error.response?.data || error.message);

        // Gérer les erreurs spécifiques
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "INCORRECT",
            text: "Numéro matricule introuvable.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (error.message.includes("Rôle non pris en charge.")) {
          Swal.fire({
            title: "ERREUR",
            text: "Le rôle sélectionné n'est pas pris en charge actuellement.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "ERREUR",
            text: "Une erreur s'est produite lors de l'authentification.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
/* Styles inchangés */
</style>
  
<style scoped>
  /* Conteneur principal */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
  }
  
  /* Fond dégradé bleu-jaune */
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #003366, #ffcc00);
    z-index: -1;
  }
  
  /* Formulaire de connexion */
  .login-form {
    background: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  /* Titre */
  .login-form h2 {
    margin-bottom: 20px;
    color: #003366;
    font-size: 2rem;
  }
  
  /* Sélection du rôle */
  .role-selection {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .role-selection label {
    display: block;
    margin-bottom: 5px;
    color: #003366;
    font-weight: bold;
  }
  
  .role-selection select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  /* Groupes d'inputs */
  .input-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
    color: #003366;
    font-weight: bold;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  /* Bouton de connexion */
  .login-button {
    width: 100%;
    padding: 10px;
    background-color: #003366;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: #ffcc00;
    color: #003366;
  }
  
  /* Lien pour réinitialiser le mot de passe */
  .forgot-password {
    margin-top: 10px;
    font-size: 0.9rem;
  }
  
  .forgot-password a {
    color: #003366;
    text-decoration: none;
    font-weight: bold;
  }
  
  .forgot-password a:hover {
    text-decoration: underline;
  }
  </style>