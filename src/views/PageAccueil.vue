<template>
    <CompMenue/>
    <!-- la page de beinvenue-->
    <Wellcomme/>
    <!-- sytlo dynamique-->
    <Stylo_anim class="stylo_anim" />
    <!-- presentation de l'ecole-->
    <Presentation />
    <!-- animation avant la presentation  du directeur-->
    <Directeur_anim />
    <!-- Le discourt du directeur-->
    <Discourt />
    <!--  l'animation avant la list des formation-->
    <Formation_anim />
    <!-- La liste des formation-->
    <Formation />
    <!--  l'animation de apres ma secrion formaion 
    <Apres_formation_anim /> -->
    <!-- le pied de page-->
     <Footer_ />
</template>
<script>
import CompMenue from "../components/Comp_PageAcueil/menue.vue";
import Wellcomme from '../components/Comp_PageAcueil/wellcom.vue';
import Stylo_anim from '../components/Comp_PageAcueil/stylo_anim.vue';
import Presentation from '../components/Comp_PageAcueil/presentation.vue';
import Directeur_anim from '../components/Comp_PageAcueil/directeur_anim.vue';
import Discourt from '../components/Comp_PageAcueil/discourt.vue';
import Formation_anim from '../components/Comp_PageAcueil/formation_anim.vue';
import Apres_formation_anim from '../components/Comp_PageAcueil/apres_formation_anim.vue';
import Footer_ from '../components/Comp_PageAcueil/footer.vue';
import Formation from '../components/Comp_PageAcueil/formation.vue';

export default{
    name:"PageAccueil",
    components:{
         CompMenue,
         Wellcomme,
         Stylo_anim,
         Presentation,
         Directeur_anim,
         Discourt,
         Formation_anim,
         Apres_formation_anim,
         Formation,
         Footer_
    }
}
</script>
<style>
.stylo_anim{
    color:red;
    margin-top:200px;
   
}</style>