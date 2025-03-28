<template>
  <div class="divider">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path class="wave-path" d="M0,128L120,154.7C240,181,480,235,720,250.7C960,267,1200,245,1320,234.7L1440,224V320H1320C1200,320,960,320,720,320C480,320,240,320,120,320H0V128Z"></path>
      </svg>
  </div>
</template>
<style>


.divider {
    position: relative;
    height: 120px;
    overflow: hidden;
    background: linear-gradient(180deg, transparent, #f4f9ff);
}

.divider svg {
    position: absolute;
    bottom: 0;
    width: 100%;
    transform-origin: bottom;
    animation: wave-animation 8s ease-in-out infinite;
}


.wave-path {
    fill: #1e90ff;
    filter: drop-shadow(0 -2px 4px rgba(255, 223, 0, 0.3));
}

@keyframes wave-animation {
    0%, 100% {
        transform: translateY(0) scale(1.01);
    }
    50% {
        transform: translateY(5px) scale(1);
    }
}
</style>

<script>
export default{
    name:"Apres_formation_anim"
}
</script>