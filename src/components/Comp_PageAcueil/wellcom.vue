<template>
    <div>
       <div class="div_10">
            <div class="div_11">
                <div class="div_12">
                <h1>Apprendre aujourd'hui, <br/> diriger demain</h1>
                Nous somme un structure  de formation talentueux formant des <br/> futur dirigant et cadre du pays.
                </div> 
                <button class="btn_10">Commencer</button>
            </div>

        </div>
       
        <div class="coter_droit">
            <span id="a_b">S<br>C</span><br><span id="o_u">H</span><br><span id="t">O</span><br><span id="b_a">O<br> L</span><br> <span id="k_a">-<br>D</span>e<span id="r_i">mo</span>
        </div>
        
    </div>
    
</template>
<script>
export default{
    name:"Wellcomme",
     data(){
        return{
           a:1
        };
    },
    methods:{
        
        LeightColor(){
            var a_b=document.getElementById('a_b')
            var o_u=document.getElementById('o_u')
            var b_a=document.getElementById('b_a')
            var t=document.getElementById('t')
            var k_a=document.getElementById('k_a')
            var r_i=document.getElementById('r_i')
            if(this.a==1){
                a_b.style.color='rgb(207, 207, 6)'
                    o_u.style.color='rgb(7, 7, 129)'
                    t.style.color='rgb(7, 7, 129)'
                    b_a.style.color='rgb(7, 7, 129)'
                    k_a.style.color='rgb(7, 7, 129)'
                    r_i.style.color='rgb(7, 7, 129)'
            }else if(this.a==2){
                a_b.style.color='rgb(7, 7, 129)'
                o_u.style.color='rgb(207, 207, 6)'
                t.style.color='rgb(7, 7, 129)'
                b_a.style.color='rgb(7, 7, 129)'
                k_a.style.color='rgb(7, 7, 129)'
                r_i.style.color='rgb(7, 7, 129)'
            }else if(this.a==3){
                a_b.style.color='rgb(7, 7, 129)'
                o_u.style.color='rgb(7, 7, 129)'
                t.style.color='rgb(207, 207, 6)'
                b_a.style.color='rgb(7, 7, 129)'
                k_a.style.color='rgb(7, 7, 129)'
                r_i.style.color='rgb(7, 7, 129)'
            }else if(this.a==4){
                a_b.style.color='rgb(7, 7, 129)'
                            o_u.style.color='rgb(7, 7, 129)'
                            t.style.color='rgb(7, 7, 129)'
                            b_a.style.color='rgb(207, 207, 6)'
                            k_a.style.color='rgb(7, 7, 129)'
                            r_i.style.color='rgb(7, 7, 129)'
            }else if(this.a==5){
                a_b.style.color='rgb(7, 7, 129)'
                            o_u.style.color='rgb(7, 7, 129)'
                            t.style.color='rgb(7, 7, 129)'
                            b_a.style.color='rgb(7, 7, 129)'
                            k_a.style.color='rgb(207, 207, 6)'
                            r_i.style.color='rgb(7, 7, 129)'
            }else if(this.a==6){
                a_b.style.color='rgb(7, 7, 129)'
                            o_u.style.color='rgb(7, 7, 129)'
                            t.style.color='rgb(7, 7, 129)'
                            b_a.style.color='rgb(7, 7, 129)'
                            k_a.style.color='rgb(7, 7, 129)'
                            r_i.style.color='rgb(207, 207, 6)'
            }else{
                this.a=0;
                setTimeout(this.LeightColor, 600);
            }
            this.a++;
            setTimeout(this.LeightColor, 600)
        }
    },
    mounted(){
        //LeightColor()
        setInterval(this.LeightColor(), 300)
    }
}
</script>
<style>
.div_10{
    border: 1px solid ='rgb(7, 7, 129)';
    border-radius: 5px;
   width: 900px;
   height: 800px;
   background-image: url("../../assets/img_1.jpg");
   background-size: cover;
   float: left;
   background-position:center;
   display:flex;
   align-items:center;
   position: absolute;
}
.div_11{
    background-color: rgb(14, 15, 22);
    opacity: 0.4;
    width: 900px;
    height: 800px;
   float: left;
}
.div_12{
   
    color:aliceblue ;   
    margin-top:350px;
    margin-left:200px;
    
}
.coter_droit{
    font-size:60px;
    
    font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
    margin-left:1000px;
   
}
.test{
    float: left;
    margin-left:-100px;
    color: aliceblue;
}
.btn_10{
    margin-top:20px;
    margin-left:200px;
    color: aliceblue;
    opacity: 0.9;
    background:transparent;
    width:130px;
    height:30px;
    font-weight:bold;
    font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
    border: 2px solid aliceblue;
    border-radius: 30px;
    font-size:16px;
    padding: 20px, 20px;
    cursor:pointer;
    transition:all 0.3s ease;
}
.btn_10:hover{
    background-color:aliceblue;
    color: black;
}


@media screen and (max-width: 768px) {
    .coter_droit {
        font-size: clamp(24px, 4vw, 40px);
        right: 10px;
    }
    
    .div_12 {
        width: 95%;
        padding: 10px;
    }
    
    .div_12 h1 {
        font-size: 24px;
    }
    
    .btn_10 {
        width: 110px;
        height: 35px;
        font-size: 14px;
    }
}

@media screen and (max-width: 480px) {
    .coter_droit {
        display: none;
    }
}
</style>