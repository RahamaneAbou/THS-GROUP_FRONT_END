<template >
    <div class="div_20">
    <div id="id_1">
    <div class="div_21" v-if="fonLoading">
      <div class="div_21_1">
        <div class="div_21_1_1" id="id_2">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
        </div>
        <div class="div_21_1_1" id="computer">
            <img src="../../assets/portable.png" alt="macbool image" class="img_anim">
          <img src="../../assets/portable.png" alt="macbool image" class="img_anim">
        </div>
        <div class="div_21_1_1" id="id_2">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
            <img src="../../assets/stylo.png" alt="oencil image" class="img_anim">
        </div>
      </div>
    </div>
    
  </div>
</div>
</template>

<style>
.img_anim{
    width:30px;
}
.div_20 {
    margin-top: clamp(100px, 15vh, 180px);
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: clamp(60px, 10vh, 100px);
}

.div_21 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    animation: fadeIn 2s ease-in-out;
    padding: 0 1rem;
}

.div_21_1 {
    display: flex;
    gap: clamp(10px, 2vw, 20px);
    flex-wrap: wrap; /* Permet le retour à la ligne sur petits écrans */
    justify-content: center;
}

.div_21_1_1 {
  font-size: 2.5rem;
  animation: spin 2s linear infinite;
}

@media screen and (max-width: 768px) {
    .div_21_1_1 {
        font-size: 1.8rem;
    }

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px); /* Animation réduite sur mobile */
        }
    }
}

@media screen and (max-width: 480px) {
    .div_21_1_1 {
        font-size: 1.5rem;
    }
}
#id_2 {
  animation: bounce 1.5s ease-in-out infinite;
}

#computer {
  animation: spin 2s linear infinite;
}

#calculator {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Animations */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}


</style>

<script>
export default{
    name:"Stylo_anim",
    data() {
    return {
        fonLoading: true, // L'état du chargement
    };
  },
  methods: {
    toggleLoading() {
      this.fonLoading= !this.fonLoading; // Permet de masquer ou afficher le loader
    },
  },
}
</script>