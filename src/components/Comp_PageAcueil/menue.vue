<template>
  <div class="menu-container">
    <!-- Section des icônes de contact en haut -->
    <div class="section-contact">
      <div class="contact-gauche">
        <div class="contact-item">
          <img class="icon-contact" src="../../assets/enveloppe.png" alt="Email">
          <span class="text-contact">abouBakarieDev@gmail.com</span>
        </div>
        <div class="contact-item">
          <img src="../../assets/lieu.png" class="icon-contact" alt="Lieu">
          <span class="text-contact">KARA, M.R.S-TOTAL, voix UK</span>
        </div>
      </div>
      
      <div class="reseaux-sociaux">
        <img src="../../assets/social.png" class="icon-social" alt="Google">
        <img src="../../assets/linkedin.png" class="icon-social" alt="LinkedIn">
        <img src="../../assets/twitter.png" class="icon-social" alt="Twitter">
        <img src="../../assets/facebook.png" class="icon-social" alt="Facebook">
      </div>
    </div>

    <!-- Barre de navigation principale -->
    <div class="barre-navigation">
      <div class="logo-section">
        <img src="../../assets/logo.jpg" class="logo-principal" alt="Logo SCHOOL-Demo">
        <div class="nom-entreprise">
          <h1>SCHOOL-Demo</h1>
          <p>Excellence en Formation</p>
        </div>
      </div>

      <div class="menu-actions">
        <button @click="showInscription = !showInscription" class="btn-menu btn-inscription">
          {{ showInscription ? "Fermer" : "Inscription" }}
        </button>
        <button @click="ouvrirLogin" class="btn-menu btn-connexion">
          Connexion
        </button>
      </div>
    </div>

    <!-- Section du texte animé -->
    <div class="section-hero">
      <div class="texte-anime">
        <h2 class="titre-principal">{{ displayedText }}</h2>
        <p class="sous-titre">{{ display_2 }}</p>
      </div>
    </div>

    <!-- Section d'inscription conditionnelle -->
    <div v-if="showInscription" class="section-inscription">
      <Inscription />
    </div>
  </div>
</template>

<script>
import Inscription from "../../views/Inscription.vue"

export default {
  name: "CompMenue",
  components: {
    Inscription,
  },
  data() {
    return {
      showInscription: false,
      fullText: "SCHOOL-Demo", // Texte complet
      text_2: "La Satisfaction sans pression !!!",
      display_2: "",
      displayedText: "", // Texte affiché progressivement
      typeWriterIndex: 0, // Index du caractère actuel
      index_2: 0,
    }
  },
  methods: {
    // Ouvrir la page de connexion dans un nouvel onglet
    ouvrirLogin() {
      const route = this.$router.resolve({ path: "/connexion" })
      window.open(route.href, "_blank")
    },

    // Animation du texte (effet machine à écrire)
    startTypeWriter_1() {
      if (this.typeWriterIndex < this.fullText.length) {
        this.displayedText += this.fullText.charAt(this.typeWriterIndex)
        this.typeWriterIndex++
        setTimeout(this.startTypeWriter_1, 200) // Appel récursif
      } else if (this.typeWriterIndex >= 11) {
        if (this.index_2 < this.text_2.length) {
          this.display_2 += this.text_2.charAt(this.index_2)
          this.index_2++
          setTimeout(this.startTypeWriter_1, 200) // Appel récursif
        } else if (this.index_2 >= 30) {
          this.display_2 = ""
          this.index_2 = 0
          this.displayedText = ""
          this.typeWriterIndex = 0
          setTimeout(this.startTypeWriter_1, 400)
        }
      }
    },
  },
  mounted() {
    // Démarrer l'animation du texte
    setInterval(this.startTypeWriter_1(), 3000)
  },
}
</script>

<style scoped>
/* Conteneur principal */
.menu-container {
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Section de contact en haut */
.section-contact {
  background: linear-gradient(135deg, #003366 0%, #004080 100%);
  color: #FFD700;
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-gauche {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-left: 150px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
}

.icon-contact {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(84%) sepia(100%) saturate(1000%) hue-rotate(15deg);
}

.text-contact {
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.reseaux-sociaux {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 150px;
}

.icon-social {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: brightness(0) saturate(100%) invert(84%) sepia(100%) saturate(1000%) hue-rotate(15deg);
}

.icon-social:hover {
  transform: scale(1.2) rotate(5deg);
  filter: brightness(0) saturate(100%) invert(100%);
}

/* Barre de navigation principale */
.barre-navigation {
  background-color: white;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 150px;
  border-radius: 15px;
  margin-top: -10px;
  box-shadow: 0 10px 30px rgba(0, 51, 102, 0.15);
  border: 1px solid rgba(0, 51, 102, 0.1);
  position: relative;
  z-index: 10;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 30px;
}

.logo-principal {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid #003366;
  box-shadow: 0 5px 15px rgba(0, 51, 102, 0.3);
  transition: all 0.3s ease;
}

.logo-principal:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 51, 102, 0.4);
}

.nom-entreprise h1 {
  color: #003366;
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nom-entreprise p {
  color: #FFD700;
  font-size: 14px;
  margin: 2px 0 0 0;
  font-weight: 500;
  font-style: italic;
}

.menu-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 30px;
}

.btn-menu {
  padding: 12px 25px;
  border: 2px solid transparent;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.btn-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-menu:hover::before {
  left: 100%;
}

.btn-inscription {
  background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
  color: #003366;
  border-color: #FFD700;
}

.btn-inscription:hover {
  background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
}

.btn-connexion {
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  color: white;
  border-color: #003366;
}

.btn-connexion:hover {
  background: linear-gradient(135deg, #0055a4 0%, #0066cc 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 51, 102, 0.4);
}

/* Section hero avec texte animé */
.section-hero {
  padding: 3px 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 51, 102, 0.05) 0%, rgba(255, 215, 0, 0.05) 100%);
}

.texte-anime {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.titre-principal {
  color: #003366;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
  background: linear-gradient(135deg, #003366 0%, #0055a4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sous-titre {
  color: #FFD700;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-style: italic;
}

/* Section d'inscription */
.section-inscription {
  margin: 40px 150px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border-top: 5px solid #003366;
  overflow: hidden;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media screen and (max-width: 1200px) {
  .contact-gauche {
    margin-left: 50px;
  }
  
  .reseaux-sociaux {
    margin-right: 50px;
  }
  
  .barre-navigation {
    margin: 0 50px;
    margin-top: -10px;
  }
  
  .section-inscription {
    margin: 40px 50px;
  }
}

@media screen and (max-width: 768px) {
  .section-contact {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }
  
  .contact-gauche {
    margin-left: 0;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .reseaux-sociaux {
    margin-right: 0;
  }
  
  .barre-navigation {
    flex-direction: column;
    gap: 20px;
    margin: 0 20px;
    margin-top: -10px;
    padding: 30px 20px;
  }
  
  .logo-section {
    margin-left: 0;
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .menu-actions {
    margin-right: 0;
    flex-direction: column;
    width: 100%;
  }
  
  .btn-menu {
    width: 100%;
    padding: 15px;
  }
  
  .titre-principal {
    font-size: 32px;
  }
  
  .sous-titre {
    font-size: 18px;
  }
  
  .section-inscription {
    margin: 20px;
  }
}

@media screen and (max-width: 480px) {
  .contact-item {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .text-contact {
    font-size: 12px;
  }
  
  .nom-entreprise h1 {
    font-size: 22px;
  }
  
  .titre-principal {
    font-size: 28px;
  }
  
  .sous-titre {
    font-size: 16px;
  }
}

/* Animations supplémentaires */
.menu-container {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Effet de parallaxe léger */
.section-hero {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

/* Amélioration des transitions */
* {
  transition: all 0.3s ease;
}

/* Focus states pour l'accessibilité */
.btn-menu:focus {
  outline: 3px solid rgba(0, 51, 102, 0.3);
  outline-offset: 2px;
}

.icon-social:focus {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
  border-radius: 50%;
}
</style>
