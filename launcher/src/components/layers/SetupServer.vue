<template>

<div class="test">
    <section id="header">
      <h2>CONNECT TO YOUR SERVER</h2>
    </section>
    <form @submit.prevent>
      <div id="container">
        <div id="one">
          <input id="two" type="number" placeholder="--NONE--" />
          <input class="three" type="image" src="./img/icon/+.png" />
          <input class="three" type="image" src="./img/icon/TRASH CAN.png" />
        </div>
        <div class="formGroup">
          <label for="servername">SARVERNAME</label>
          <input name="servername" id="servername" type="text" />
        </div>
        <div class="formGroup">
          <label for="iporhostname">IP or HOSTNAME</label>
          <input name="iporhostname" id="iporhostname" type="text" />
        </div>
        <div class="formGroup">
          <label for="username">USERNAME</label>
          <input name="username" id="username" />
        </div>
      </div>
      <div id="keyLocation">
        <label for="keylocation">KEYLOCATION</label>
        <input name="keylocation" id="keylocation" />
      </div>
<div class="ssh">
    <label id="lbl" for="">SSH</label>
    <label class="switch">
        <input type="checkbox" checked>
        <span class="slider round"></span>
      </label>
    
</div>

      <input id="login" type="submit" value="LOGIN">
    </form>
  
    </div>
    

</template>
<script>
import BaseLogo from './BaseLogo.vue'

export default{
  components: { BaseLogo },
    name:'SetupServer',
    data(){return{
        link:'stereumLogoExtern.png'
    }}
}
</script>
<style scoped>

test{
      border: solid 5px rgba(15, 15, 15, .5);
  /* animation: modal 0.3s ease-out forwards; */
  background-color:rgba(76, 72, 72, .5);
}
      #header {
        text-align: center;
        margin: 2rem auto;
        max-width: 35rem;
        border-radius: 40px;
        /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
        padding: 0.5rem;
        background-color: #aa2626;
        color: #FFF;
      }
      div {
        text-align: center;
        margin: 1rem auto;
        max-width: 40rem;
        border-radius: 20px;
        /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
        padding: 0.3rem;
        background-color: #3326aa;
      }
      #one {
        margin: 1rem auto;
        max-width: 40rem;
        border-radius: 40px;
        /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
        padding: 1rem;
        background-color: #681264;
        justify-content: center;
        align-items: center;
        display: flex;
      }
      #two {
        width: 70%;
        padding: 1rem;
        border-radius: 40px;
        float: left;
      }
      .three {
        width: 50px;
        float: left;
      }
      .formGroup {
        display: flex;
        background-color: #567891;
      }

      .formGroup label {
        /* Other styling... */
        text-align: right;
        clear: both;
        float: left;
        margin-right: 40px;
        font-size: large;

        color: #fff;
      }
      .formGroup input {
        width: 60%;
        border-radius: 40px;
        padding: 0.1rem;
        float: right;
        text-align: right;
      }
      #keyLocation {
        text-align: center;
        margin: 1rem auto;
        max-width: 35rem;
        border-radius: 20px;
        /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
        padding: 0.3rem;
        background-color: #26aa43;
        justify-content: center;

        display: flex;
      }
      #keyLocation label {
        /* Other styling... */
        text-align: right;
        clear: both;
        float: left;
        margin-right: 40px;
        font-size: large;

        color: #fff;
      }
      #keyLocation input {
        width: 60%;
        border-radius: 40px;
        padding: 0.1rem;
        float: right;
        text-align: right;
        justify-content: center;

        display: flex;
      }
      #login{
        position: fixed;
  top: 81vh;
  left: 86%;
 width: 100px;
  z-index: 100;
  resize: both;
  padding: .4rem;
  border-radius: 40px;
  background-color: orange;
  text-align: center;
  font-weight: bold;
      }
   

.ssh{
    width: 15%;
    background-color: indianred;
   margin-top: 0;
    text-align: left;
        
        max-width: 35rem;
        border-radius: 40px;
        /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
        padding: 0.3rem;
       display: flex;
        color: #FFF;
}
.shh #lbl{
        /* Other styling... */
        text-align: right;
    clear: both;
    float:left;
    margin-right:15px;

}
.switch {  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>