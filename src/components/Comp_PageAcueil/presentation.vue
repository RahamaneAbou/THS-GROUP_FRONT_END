<template>
  <div>
  <div class="body">
  <div class="presentation">
    <div class="school-info">
      <h1 class="h_30">{{ schoolName }}</h1>
      <p><strong>Devise :</strong> {{ motto }}</p>
      <h3>Objectifs :</h3>
      <ul>
        <li class="li_30" v-for="objective in objectives" :key="objective">{{ objective }}</li>
      </ul>
      <p>{{ description }}</p>
    </div>
    <div class="image-carousel">
      <img src="@/assets/logo_1.png" alt="Carousel image" class="carousel-image" />
    </div>
  </div>
  
  </div>
  
</div>
</template>

<script>

export default {
  name: "Presentation",
  data() {
    return {
      schoolName: "École Supérieure de Développement et d'Innovation",
      motto: "L'excellence au service de l'innovation",
      objectives: [
        "Former des leaders compétents",
        "Encourager l'innovation technologique",
        "Promouvoir l'excellence académique",
        "Favoriser l'entrepreneuriat",
        "Soutenir le développement durable",
      ],
      description:
        "Notre école s'engage à offrir une formation de qualité en mettant l'accent sur l'innovation et le développement personnel. Nous préparons nos étudiants à relever les défis du monde moderne.",
      
    };
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    },
  
};
</script>

<style scoped>
.li_30{
  border-bottom:1px solid rgb(110, 97, 97) ;
  list-style: none;
  
  
  
  border-radius: 0px;
  padding:0px 30px;
}
.body {
  margin: 0;
  font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
   color:aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  min-height: 100vh;
  background-color: #f4f4f4;
/* background-image:url("../../assets/img_7.jpg");
 border-radius:10px;
 background-size:cover;
 background-position: center;  */
}

.presentation {
  display: flex;
  gap: 20px;
  width: 80%;
  max-width: 1200px;
  color: #555;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
 /* opacity:0.9;
  backdrop-filter: blur(10px);   */
}

/* Ajout des media queries pour la responsivité */
@media screen and (max-width: 768px) {
  .presentation {
    flex-direction: column;
    width: 95%;
    margin: 20px auto;
  }

  .school-info h1 {
    font-size: 1.5rem;
  }

  .li_30 {
    padding: 0px 15px;
  }

  .image-carousel {
    min-height: 200px;
  }
}

@media screen and (max-width: 480px) {
  .school-info h1 {
    font-size: 1.2rem;
  }

  .school-info {
    padding: 15px;
  }

  .presentation {
    width: 98%;
  }
}
.school-info {
  flex: 1;
  padding: 20px;
}

.school-info h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.school-info p {
  margin: 10px 0;
  color: #555;
}

.school-info ul {
  padding-left: 20px;
}

.school-info ul li {
  margin: 5px 0;
}

.image-carousel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #222;
  overflow: hidden;

}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}


</style>
