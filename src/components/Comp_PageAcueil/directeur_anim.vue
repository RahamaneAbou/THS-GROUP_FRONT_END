<template>
  <div>
    <div class="background">
      <div class="circle-container">
        <p>SCHOOL-Demo</p>
        <div class="orbit">
          <div
            v-for="(item, index) in orbitItems"
            :key="index"
            class="orbit-item"
            :style="getOrbitItemStyle(index)"
          >
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Style pour le cercle principal */
.circle-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px; /* Taille du cercle principal */
  height: 300px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #555;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 50%; /* Cercle principal */
  overflow: hidden;
  opacity: 0.95;
  backdrop-filter: blur(8px);
  text-align: center;
}

/* Arrière-plan animé */
.background {
  margin-top: -10px;
  height: 200px;

  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, blue, #fad0c4, yellow);
  animation: gradientShift 6s infinite;
  background-size: 300% 300%;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  border-radius:10px;
}

/* Animation pour le dégradé */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Cercle des petits éléments */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  animation: orbit-rotate 10s linear infinite; /* Rotation infinie */
}

/* Style pour les petits cercles */
.orbit-item {
  position: absolute;
  width: 70px; /* Taille des petits cercles */
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Forme circulaire */
  background-color: #ffffff;
  border: 2px solid #ddd; /* Bordure blanche */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Ombre subtile */
}

/* Style des images dans les petits cercles */
.orbit-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Cercle pour l'image */
  object-fit: cover;
  border: 2px solid white;
}

/* Animation de rotation */
@keyframes orbit-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
<script>
export default {
  name: "DirecteurAnim",
  data() {
    return {orbitItems: [
  { image: "https://cdn.pixabay.com/photo/2016/03/31/19/14/school-1297778_50x50.jpg", text: "École 1" },
  { image: "https://images.unsplash.com/photo-1596495577886-d920f1d5d2d0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=50&w=50", text: "Salle de classe" },
  { image: "https://img.freepik.com/vecteurs-libre/illustration-ecole_53876-37449.jpg?size=50&ext=jpg", text: "Illustration d'école" },
  { image: "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&h=50&w=50", text: "Tableau noir" },
],
    };
  },
  methods: {
    getOrbitItemStyle(index) {
      // Positions fixes pour 4 éléments : haut, droite, bas, gauche
      const angles = [0, 90, 180, 270]; // Angles en degrés
      const angle = angles[index]; // Angle pour l'élément en fonction de l'index
      const radius = 120; // Rayon du cercle
      const x = Math.cos((angle * Math.PI) / 180) * radius; // Coordonnée X
      const y = Math.sin((angle * Math.PI) / 180) * radius; // Coordonnée Y

      return {
        transform: `translate(${x}px, ${y}px)`, // Positionnement des cercles
      };
    },
  },
};
</script>