<script setup>
import { ref } from 'vue';
import { logOut, loginGoogle } from '../js/firebase.js';

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
    <img src="../assets/img/logo.png">
    <h1>GymBros Zone</h1>
    <div v-if="false" id="loged">
      <RouterLink to="" id="btn-profile">Mi cuenta</RouterLink>
    </div>
    <div v-if="true" id="no-loged">
      <RouterLink to="/Log" class="btn-loged" id="btn-login">Login</RouterLink>
      <RouterLink to="/Log" class="btn-loged" id="btn-register">Registro</RouterLink>
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

img {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border: 1px solid black;
  margin-right: 5%;
}

h1 {
  color: white;
  background-color: #3D5A98;
  padding: 5px 30px;
  border-radius: 25px;
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
}

#btn-login {
  margin-right: 10px;

}
</style>