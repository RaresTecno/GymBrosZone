<script setup>
import { ref } from 'vue';
import { userActive } from '../clients/supabase'

const posicionAnt = ref(0);
const mostrar = ref(true);

window.addEventListener('scroll', () => {
  const posicionActual = window.scrollY;

  if (posicionActual > 100) {
    mostrar.value = false;
    if (posicionActual < posicionAnt.value) {
      mostrar.value = true;
    }
  } else {
    mostrar.value = true;
  }
  posicionAnt.value = posicionActual;
});


</script>
<template>
  <header v-if="mostrar">
    <div class="home">
      <div class="logo">
        <div class="fondo_logo">
          <RouterLink to="/" class="RouterLink">
            <img src="../assets/img/logo.png">
          </RouterLink>
        </div>
      </div>

      <div class="titulo_main_header">
        <RouterLink to="/" class="RouterLink">
          <h1>GymBros Zone</h1>
        </RouterLink>
      </div>

    </div>
    <div v-if="userActive" id="loged">
      <RouterLink to="" id="btn-profile">Mi cuenta</RouterLink>
    </div>
    <div v-if="!userActive" id="no-loged">
      <RouterLink to="/log/login" class="btn-loged" id="btn-login">Login</RouterLink>
      <RouterLink to="/log/register" class="btn-loged" id="btn-register">Registro</RouterLink>
    </div>
  </header>
</template>


<style scoped>
header {
  background-color: var(--dark-blue);
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  z-index: 100;
}

.home {
  display: flex;
  align-items: center;
}
.RouterLink{
  text-decoration: none;
}
.fondo_logo {
  border-radius: 50%;
  background-color: black;
  width: 65px;
  height: 65px;
  position: relative;
}

.logo img {
  position: absolute;
  width: 69px;
  height: 69px;
  top: -2px;
  left: -2px;
  border-radius: 50px;
  margin-right: 5%;
}

h1 {
  color: white;
  background-color: #3D5A98;
  padding: 5px 30px;
  border-radius: 25px;
  width: fit-content;
}

#loged {
  margin-left: 4%;

}

#btn-profile {
  color: white;
  background-color: #3D5A98;
  border-radius: 25px;
  padding: 7px;
  font-weight: bold;
  border: none;
  text-decoration: none;
}

#no-loged {
  display: flex;
  justify-content: space-between;
}

.btn-loged {
  color: white;
  background-color: #3D5A98;
  border-radius: 25px;
  padding: 7px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  width: 90px;
  text-align: center;
}

#btn-login {
  margin-right: 10px;

}

.titulo_main_header {
  width: 100%;
  margin-left: 30px;
}

@media(max-width: 875px) {
  #no-loged {
    flex-direction: column;
    justify-content: space-around;
    height: 90%;
    margin-top: 5px;
  }

  .btn-loged {

    padding: 4px 10px;
    margin: 4px 0;
    width: 78px;
  }

  #btn-login {
    margin: 0;
  }
}

@media(max-width: 600px){
    
}
</style>