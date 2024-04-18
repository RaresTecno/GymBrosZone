<script setup>
import { ref, computed, onMounted} from "vue";
import { userActive } from "../clients/supabase";

const posicionAnt = ref(0);
const mostrar = ref(true);

const mostrarLetras = ref(true);
const windowWidth = ref(window.innerWidth);

function mostrarHeader() {
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
}

if (windowWidth.value < 601) {
  mostrarLetras.value = false;
} else {
  mostrarLetras.value = true;
}
function updateWidth() {
  windowWidth.value = window.innerWidth;

  if (windowWidth.value < 601) {
    mostrarLetras.value = false;
  } else {
    mostrarLetras.value = true;
  }
}

onMounted(() => {
  window.addEventListener("scroll", mostrarHeader);
  window.addEventListener("resize", updateWidth);
});
</script>
<template>
  <header v-if="mostrar">
    <div class="home">
      <div class="logo">
        <div class="fondo_logo">
          <RouterLink to="/" class="RouterLink">
            <img src="../assets/img/logo.png" />
          </RouterLink>
        </div>
      </div>

      <div v-if="mostrarLetras" class="titulo_main_header">
        <RouterLink to="/" class="RouterLink">
          <h1>GymBros Zone</h1>
        </RouterLink>
      </div>
    </div>
    <div v-if="userActive" id="loged" >
      <RouterLink to="/account" id="btn-profile" class="boton_header">Mi cuenta</RouterLink>
    </div>
    <div v-if="!userActive" id="no-loged">
      <RouterLink to="/login" class="btn-no-loged boton_header" id="btn-login"
        >Login</RouterLink
      >
      <RouterLink to="/register" class="btn-no-loged boton_header" id="btn-register"
        >Registro</RouterLink
      >
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--dark-blue);
  min-height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  z-index: 100;
  box-shadow: 2px 0 15px var(--black), 3px 0 20px var(--black);
}

.home {
  display: flex;
  align-items: center;
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
  top: -1px;
  left: -2px;
  border-radius: 50px;
  margin-right: 5%;
}

h1 {
  color: var(--light-blue-text);
  background-color: var(--blue-inputs);
  padding: 5px 30px;
  border-radius: 25px;
  width: fit-content;
}

.boton_header{
  font-weight: bold;
  text-decoration: none;
  background-color: #3d5a98;
  color: var(--light-blue-text);
  border: 2px solid var(--black);
  cursor: pointer;
  border-radius: 25px;
  text-align: center;
  transition: border 0.5s;
}

.boton_header:hover, .boton_header:active{
  border-color: #eef2fa81;
}

#btn-profile {
  padding: 5px 8px;
}

.btn-no-loged {
  display: flex;
  justify-content: center;
  padding: 5px 7px;
  width: 90px;
}

#no-loged {
  display: flex;
  justify-content: space-between;
}

#btn-login {
  margin-right: 10px;
}

.titulo_main_header {
  width: 100%;
  margin-left: 30px;
}

@media (max-width: 875px) {
  header{
    min-height: 94px;
  }

  #loged{
    margin: 20px;
  }

  #no-loged {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
  }

  #btn-login {
  margin-right: 0;
  }

  .btn-no-loged {
    margin: 5px 0;
  }
}

@media (max-width: 600px) {
  header {
    flex-direction: column;
  }

  .logo{
    margin-top: 10px;
    margin-bottom: 5px;
  }

  #no-loged {
    flex-direction: row;
  }

  .btn-no-loged {
    margin: 10px;
  }

  .fondo_logo{
    width: 95px;
    height: 95px;
  }

  .logo img {
    margin: 0;
    width: 99px;
    height: 99px;
  }
}
</style>
