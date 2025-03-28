<template> 
  <div>
      <div class="transition-container">
          <div class="decorative-line left"></div>
          <div class="transition-phrase">
              Chez nous, chaque formation est une porte ouverte vers l'excellence.
          </div>
          <div class="decorative-line right"></div>
      </div>
  </div>
  </template>
<style>
.div_70{
    height:100px;
}
.transition-phrase {
  font-size: 1.5rem;
  font-family: "Playfair Display", serif;
  text-align: center;
  margin: 20px auto;
  color: #333;
  opacity: 0;
  animation: slideIn 2s forwards;
}

@keyframes slideIn {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}


.transition-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 40px 20px;
}

.decorative-line {
    height: 2px;
    background-color: #333;
    flex: 1;
    max-width: 100px;
    opacity: 0;
}

.decorative-line.left {
    animation: slideInLeft 2s forwards;
}

.decorative-line.right {
    animation: slideInRight 2s forwards;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-50px);
        opacity: 0;
    } 
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(50px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
<script>
export default{
    name:"Formation_anim"

}
</script>