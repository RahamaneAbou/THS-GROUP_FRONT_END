<template>
    <div>
         <!-------//--------------//----------les icon en haut de la baree--------------//-------------//------------------>
    <div class="icon">
                <img class="enveloppe" src="../../assets//enveloppe.png" alt="">
        <div class="text-enve">
            aboupharmacie@gmail.com
        </div>
                <img src="../../assets//lieu.png" class="lieux" alt="">
        <div class="text-lieux">
            KARA,M.R.S-TOTAL,voix UK
        </div>
                <img src="../../assets//social.png" class="icon-gle" alt="">
        <img src="../../assets//linkedin.png" class="icon-lk" alt="">
                <img src="../../assets//twitter.png" class="icon-tw" alt="">
        <img src="../../assets//facebook.png" class="icon-fb" alt="">
    </div>
    
    <!-------//--------------//----------La bar de menue--------------//-------------//------------------>
    <div class="barre_gene">
        <div class="menu">
            <div class="login">
              <a href=""><span @click="ouvrirLogin">Login</span></a>
            </div>
        </div>
    <div class="">
      <div class="">
        <button @click="showInscription = !showInscription" class="nav-link">
          {{ showInscription ? "Cacher" : "Inscription" }}
        </button>
        <div v-if="showInscription">
          <Inscription />
        </div>
        <!-- <router-link :to="{ name: 'Inscription' }" class="nav-link">Inscriptio hhhhn</router-link> -->
      </div>
    </div>
    </div>
     <!-------//--------------//----------img dans la barre de menue--------------//-------------//------------------>
     <div class="img_bar">
        <img src="../../assets/logo.jpg" class="img_b" alt="">
     </div>
    </div>
    <div id="text_1">
        <span class="sp_1">{{ displayedText }} </span>
        <span class="sp_2">{{ display_2 }}</span>
      </div>
    
     <!-- <div class="div_0">
      <div class="div_1">
        <img src="../../assets/logo.jpg" alt="logo" class="img_1">
      </div>
      <div id="text_1">
        <span class="sp_1">{{ displayedText }} </span>
        <span class="sp_2">{{ display_2 }}</span>
      </div>
     Boutons  
      <div class="div_2">
        <button type="" class="btn_1" >Inscription</button>
        <button type="" class="btn_1">Connexion</button>
        <button type="" class="btn_1">Particulier</button>
      </div>
    </div>  -->
  </template>
  
  <script>

import Inscription from "../../views/Inscription.vue"; 
  export default {
    name: "CompMenue",
    components: {
    Inscription,
  },
    data() {
      return {
        showInscription: false,
        fullText: " THS-GROUP,", // Texte complet
        text_2:"La Satisfation sans pression !!!",
       
        display_2:"",
        displayedText: "", // Texte affiché progressivement
        typeWriterIndex: 0, // Index du caractère actuel
        index_2:0,
      };
    },
    methods: {
      ouvrirNouvelOnglet() {
      const route = this.$router.resolve({ path: "/admin" });
      window.open(route.href, "_blank");
    },
    ouvrirLogin(){
      const route= this.$router.resolve({path:"/connexion"});
      window.open(route.href,"_blank")
    },
        goToInscription() {
      // Navigation vers la route d'inscription
      this.$router.push({ name: 'Inscription' });
    },
      startTypeWriter_1() {
         if (this.typeWriterIndex < this.fullText.length)  
            {
            this.displayedText += this.fullText.charAt(this.typeWriterIndex);
            this.typeWriterIndex++;

            setTimeout(this.startTypeWriter_1, 200); // Appelle récursive        
            }
        else if(
            this.typeWriterIndex>=11
        ){
            
            if (this.index_2 < this.text_2.length)  
            {
            this.display_2 += this.text_2.charAt(this.index_2);
            this.index_2++;
            
            setTimeout(this.startTypeWriter_1, 200); // Appelle récursive        
            }
        else if(
            this.index_2>=30
        ){
            this.display_2="";
            this.index_2=0;
            this.displayedText="";
            this.typeWriterIndex=0;
            setTimeout(this.startTypeWriter_1, 400)
        }
            
        
        }
      },
     
    },
    mounted(){
        //this.startTypeWriter() ;
       setInterval(this.startTypeWriter_1(),    4000);
      // setInterval(this.startTypeWriter_2(),    4000); 


    },}
  </script>
  
  <style>
  /*------------//---------------//----les icon en haut de la barre---------------//------------------//--------------------*/
  /*------------//---------------//----la barre de menue---------------//------------------//--------------------*/
  .is{
    width:100%;
    position:relative;
  }
.img_b{
    margin-top: -800px;
    width: 80px;
    margin-left: 160px;
}
.icon{
    font-family: 'Courier New', Courier, monospace;
    color: rgb(207, 207, 6);
    font-weight: bolder;
}
.enveloppe{
    margin-top: 15px;
    width: 20px;
    margin-left: 150px;
    margin-bottom: -20px;
}
.text-enve{
    margin-left: 175px;
    margin-bottom: -10px;
}
.lieux{
    margin-left: 470px;
    width: 30px;
    margin-top: -30px;
}
.text-lieux{
    margin-top: -25px;
    margin-left: 500px;
}
.icon-gle{
    float: right;
    width: 25px;
    margin-right: 90px;
    margin-top: -20px;
}
.icon-lk{
    float: right;
    width: 25px;
    margin-right: 30px;
    margin-top: -20px;
}
.icon-tw{
    float: right;
    width: 25px;
    margin-right: 30px;
    margin-top: -20px;
}
.icon-fb{
    float: right;
    width: 25px;
    margin-right: 30px;
    margin-top: -20px;
}

/*------------//---------------//----la barre de menue---------------//------------------//--------------------*/
.menu{
    background-color: white;
    width: 1110px;
    height: 70px;
    margin-left: 150px;
    margin-top: 10px;
    border: solid 1px  rgb(7, 7, 129);
    border-radius: 3px;
}
.login{
    float: right;
    padding: 10px;
    border: 1px solid ;
    border-color: rgb(7, 7, 129);
    border-radius: 5px;
    margin-right: -20px;
    margin-top: 10px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 400;
    font-size: 20px;
    background-color: rgb(7, 7, 129);
}
.login a{
    color: aliceblue;
    text-decoration: none;
}
.menu :hover{
    background-color: rgb(3, 92, 92);
}
.particulier :hover{
    border: 1px solid rgb(7, 7, 129);
    padding: 10px;
    border-radius: 5px;
}
.menu_1, {
    position: relative;  /* Au lieu de float */
    display: inline-block;
    margin: 10px 20px;
    z-index: 10;  /* Assure que les boutons sont au-dessus des autres éléments */
}
  /* -------------------------------------------------------------*/
  #text_1{
    float: left;
    margin-top: -70px;
    margin-left: 15%;
    text-align: center;
    font-family:'Lucida Sans', Geneva, Verdana, sans-serif ;
    transform: skewX(15deg);
    width: 700px;
  }
  .sp_1{
    color: rgb(7, 7, 129);
    font-size: 30px;
  }
  .sp_2{
    color: rgb(207, 207, 6);
    font-size: 25px;
  }
  /* Styles inchangés */
  .btn_1 {
      color: blue;
      background-color: white;
      border-color: aliceblue;
      border: 1px solid;
      border-radius: 4px;
      width: 80px;
      height: 30px;
      font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
      margin-right: 20px;
  }
  .btn_1:hover {
      width: 85px;
      color: rgb(79, 95, 5);
  }
  .div_0 {
      border-bottom: 1px solid blue;
      border-radius: 10px;
  }
  .img_1 {
      width: 100px;
      margin-left: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 5s alternate-reverse cubic-bezier(0.95, 0.05, 0.795, 0.035);
      
  }
  @keyframes fadeIn {
      from {
          opacity: 0;
      }
      to {
          opacity: 1;
      }
  }
  .div_2 {
      float: right;
      margin-top: -50px;
  }

.login {
    float: right;
    padding: 12px 25px;
    border: 2px solid rgb(7, 7, 129);
    border-radius: 8px;
    margin-right: -20px;
    margin-top: 10px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 600;
    font-size: 18px;
    background-color: rgb(7, 7, 129);
    transition: all 0.3s ease;
}

.login:hover {
    background-color: rgb(3, 92, 92);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.menu_1 {
    float: right;
    padding: 10px;
    border-radius: 5px;
    margin-right: 400px;  /* Ajusté pour éviter le chevauchement */
    margin-top: -60px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 400;
    font-size: 18px;
}


.menu_2 {
    float: right;
    padding: 10px;
    border-radius: 5px;
    margin-right: 500px;  /* Ajusté pour éviter le chevauchement */
    margin-top: -60px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 400;
    font-size: 18px;
}

@media screen and (max-width: 1200px) {
  .menu {
    width: 90%;
    margin-left: 5%;
  }
  
  .icon {
    padding: 0 5%;
  }
  
  .enveloppe {
    margin-left: 5%;
  }
  
  .text-enve {
    margin-left: 10%;
  }
  
  .lieux {
    margin-left: 30%;
  }
  
  .text-lieux {
    margin-left: 35%;
  }
}

@media screen and (max-width: 768px) {
  .menu, .menu_1, .menu_2 {
    float: none;
    margin: 10px auto;
    text-align: center;
    width: 95%;
  }
  
  .login,{
    float: none;
    display: block;
    margin: 10px auto;
    width: fit-content;
  }
  
  .icon {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 10px;
  }
  
  .text-enve, .text-lieux {
    margin: 5px auto;
    text-align: center;
  }
  
  .icon-gle, .icon-lk, .icon-tw, .icon-fb {
    float: none;
    margin: 5px;
  }
  
  #text_1 {
    margin: 20px auto;
    width: 90%;
    transform: none;
    text-align: center;
  }
  
  .img_b {
    margin: 10px auto;
    display: block;
  }
}

@media screen and (max-width: 480px) {
  .sp_1 {
    font-size: 24px;
  }
  
  .sp_2 {
    font-size: 20px;
  }
  
  .login, .particulier a, .menu_2 a {
    padding: 8px 15px;
    font-size: 16px;
  }
  
  .text-enve, .text-lieux {
    font-size: 14px;
  }
}

.nav-link {
    display: inline-block;
    padding: 12px 25px;
    text-decoration: none;
    color: rgb(7, 7, 129);
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
    float:right;
    margin-right:320px;
    margin-top:-60px;

}

.nav-link:hover {
    border: 2px solid rgb(7, 7, 129);
    background-color: rgba(7, 7, 129, 0.1);
    cursor: pointer;
}
</style>