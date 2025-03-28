<template>
  <div>
    <div class="grid">
      <div class="grid-item" v-for="(formation, index) in formations" :key="index">
        <h1>{{ formation.titre }}</h1>
        <p class="short-desc">{{ formation.shortDescription }}</p>
        <div class="expanded-content">
          <p class="full-desc">{{ formation.fullDescription }}</p>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="grid-item" v-for="(formation__, index) in formations_2" :key="index">
        <h1>{{ formation__.titre }}</h1>
        <p class="short-desc">{{ formation__.shortDescription }}</p>
        <div class="expanded-content">
          <p class="full-desc">{{ formation__.fullDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 30px;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    opacity: 0;
    animation: fadeInGrid 1s 0.5s forwards;
    margin-bottom: 40px;
  }
  
  .grid-item {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    text-align: left;
    transition: all 0.4s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }
  
  .grid-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(45deg, #4a90e2, #67b26f);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .grid-item:hover {
    /*
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1); */
    z-index: 1000;
  }
  
  .grid-item:hover::before {
    opacity: 1;
  }
  
  .grid-item h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 15px;
    font-weight: 600;
    position: relative;
    padding-bottom: 10px;
  }
  
  .grid-item h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(45deg, #4a90e2, #67b26f);
  }
  
  .grid-item p {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: #5a6c7f;
    line-height: 1.6;
    margin: 0;
  }
  
  @keyframes fadeInGrid {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .grid {
      padding: 20px;
      gap: 20px;
    }
  
    .grid-item h1 {
      font-size: 1.5rem;
    }
  
    .grid-item p {
      font-size: 1rem;
    }
  }
  
.grid-item {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  text-align: left;
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: visible;
  z-index: 1;
}

.grid-item:hover {
  transform: scale(1.1);
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
}

.short-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.expanded-content {
  display: none;
  position: absolute;
  left: -20px;
  right: -20px;
  top: -10px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.grid-item:hover .expanded-content {
  display: block;
  animation: expandCard 0.3s ease forwards;
}

.full-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}
  
@keyframes expandCard {
  from {
    transform: scale(1);
    opacity: 0;
  }
  to {
    transform: scale(1.1);
    opacity: 1;
  }
}
  </style>
  
  <script>
  export default {
    name: "Formation",
    data() {
      return {      formations: [
        { 
          titre: "Formation 1", 
          shortDescription: "Introduction à la programmation web",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        { 
          titre: "Formation 2", 
          shortDescription: "Développement frontend avancé",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        { 
          titre: "Formation 3", 
          shortDescription: "Backend et bases de données",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
      ],
      formations_2: [
        {
          titre: "Formation 6",
          shortDescription: "Intelligence artificielle fondamentale",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
          titre: "Formation 7",
          shortDescription: "Cybersécurité avancée",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
          titre: "Formation 8",
          shortDescription: "DevOps et Cloud Computing",
          fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
      ]
      };
    },
  };
  </script>
  