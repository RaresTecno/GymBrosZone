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
    <div v-if="userActive" id="loged">
      <RouterLink to="" id="btn-profile">Mi cuenta</RouterLink>
    </div>
    <div v-if="!userActive" id="no-loged">
      <RouterLink to="/log/login" class="btn-no-loged" id="btn-login"
        >Login</RouterLink
      >
      <RouterLink to="/log/register" class="btn-no-loged" id="btn-register"
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
}

.home {
  display: flex;
  align-items: center;
}
.RouterLink {
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
  top: -1px;
  left: -2px;
  border-radius: 50px;
  margin-right: 5%;
}

h1 {
  color: white;
  background-color: #3d5a98;
  padding: 5px 30px;
  border-radius: 25px;
  width: fit-content;
}

#btn-profile {
  color: white;
  background-color: #3d5a98;
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

.btn-no-loged {
  display: flex;
  justify-content: center;
  color: white;
  background-color: #3d5a98;
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
