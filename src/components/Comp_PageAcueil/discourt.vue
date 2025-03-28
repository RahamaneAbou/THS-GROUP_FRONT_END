<template>
    <div class="div_60">
      <div class="div_60_1">
        <img src="../../assets/img_4.jpg" alt="image du directeur" class="img_60_1" />
      </div>
      <div class="div_60_2">
        <h1 class="h_60_1">Discours du Directeur</h1>
        <p class="p_60_1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis deserunt maiores officia officiis veniam labore deleniti fugit quos. Quidem dolorum autem fugiat nobis molestiae sapiente, officia illum adipisci eius dolor.
          <br />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae consequuntur sed architecto nemo maxime quibusdam commodi adipisci enim! Eligendi exercitationem alias porro aliquam explicabo nisi possimus deleniti, ipsa dolore quo.
        </p>
      </div>
    </div>
  </template>
  
<style>
.div_60 {
    display: flex;
    align-items: center;
    justify-content: center;
   
    padding: 50px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .div_60_1 {
    flex: 1;
  }
  
  .div_60_2 {
    flex: 2;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    animation: fadeIn 1.5s ease-in-out;
  }
  
  .img_60_1 {
    width: 100%;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }
  
  .img_60_1:hover {
    transform: scale(1.05); /* Effet magique au survol */
  }
  
  .h_60_1 {
    font-family: "Playfair Display", serif; /* Une police élégante */
    font-size: 2.5rem;
    text-align: center;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    animation: glow 2s infinite alternate; /* Un léger effet magique */
  }
  
  .p_60_1 {
    font-family: "Roboto", sans-serif;
    font-size: 1.2rem;
    line-height: 1.8;
    color: #555;
    text-align: justify;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes glow {
    from {
      text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
    }
    to {
      text-shadow: 0 0 20px #ffa500, 0 0 30px #ffa500;
    }
  }
  
</style>
<script>
export default{
    name:"Discourt"
}
</script>