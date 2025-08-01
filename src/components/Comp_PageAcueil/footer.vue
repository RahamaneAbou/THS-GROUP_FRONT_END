<template>
    <footer class="footer">
      <div class="footer-content">
        <!-- Section réseaux sociaux -->
        <div class="social-links">
            <div class="social-links">
        <a href="https://www.linkedin.com/in/rahamane-abou-bakari-153265319/" class="social-icon">
          <img src="../../assets/linkedin.png" alt="LinkedIn" class="social-media-icon">
        </a>
        <a href="https://github.com/RahamaneAbou" class="social-icon">
          <img src="../../assets/github.png" alt="GitHub" class="social-media-icon">
        </a>
        <a href="https://x.com/theabrits_" class="social-icon">
          <img src="../../assets/twitter.png" alt="Twitter" class="social-media-icon">
        </a>
        <a href="https://www.instagram.com/rahamane_abou/" class="social-icon">
          <img src="../../assets/instagram.png" alt="Instagram" class="social-media-icon">
        </a>
        
      </div>
        </div>
        
  <!-- <div>
    Bouton de navigation vers la route "Inscription" 
    <router-link to="/inscription">
      <button>Aller à l'inscription</button>
    </router-link>
  </div> -->
  
        <!-- Ligne de séparation -->
        <div class="divider"></div>
  
        <!-- Copyright -->
        <div class="copyright">
          <p>&copy; {{ currentYear }} ABOU-BAKARI Rahamane. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer_",
    computed: {
      currentYear() {
        return new Date().getFullYear();
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    background: linear-gradient(135deg, #003366, #001a4d);
    padding: 3rem 0;
    margin-top: auto;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .social-icon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #ffd700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: #003366;
  }
  
  .social-icon i {
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .social-icon:hover {
    transform: translateY(-5px);
    background: #003366;
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
  
  .social-icon:hover i {
    color: #ffd700;
  }
  
  .divider {
    height: 2px;
    background: linear-gradient(to right, transparent, #ffd700, transparent);
    margin: 2rem auto;
    width: 80%;
  }
  
  .copyright {
    color: #ffd700;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    .social-links {
      gap: 1rem;
    }
  
    .social-icon {
      width: 40px;
      height: 40px;
    }
  
    .social-icon i {
      font-size: 1.2rem;
    }
  
    .copyright {
      font-size: 0.9rem;
    }
  }
  
.social-media-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.social-icon:hover .social-media-icon {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .social-media-icon {
    width: 20px;
    height: 20px;
  }
}
  </style>