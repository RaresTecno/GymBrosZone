<script setup>
import Publicacion from "../components/Publicacion.vue";
import { userActive } from "../clients/supabase";
import { usandoMovil, disponible } from "../main";

disponible.value = true;
</script>

<template>
  <main>
    <template v-if="!userActive">
      <div class="portada">
        <img src="../assets/img/logo.png" alt="logo" class="logo" />
        <h1 class="title">GymBros Zone</h1>
      </div>
      <div class="container_log-or-reg">
        <div class="login_or_register">
          <p>
            <i><b>Inicia Sesión</b></i> o <i><b>Regístrate</b></i> para acceder
            a GymBros Zone
          </p>
        </div>
      </div>
      <button class="button-login_register">
        <RouterLink to="/login"
          ><a href=""><i>Login</i></a></RouterLink
        >
      </button>
      <button class="button-login_register">
        <RouterLink to="/register"
          ><a href=""><i>Registro</i></a></RouterLink
        >
      </button>
      <div class="container_services">
        <!--  v-if="no-logged" -->
        <div class="services">
          <p>¿Qué ofrecemos?</p>
          <br />
          <div>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea
            recusandae obcaecati quod alias esse aperiam aut necessitatibus odit
            eaque. Et sed ut harum perferendis nobis! Amet harum labore debitis
            fugit. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Excepturi nam eveniet cum, quis quo laboriosam, sint est ratione
            velit minus consectetur impedit corrupti eum explicabo optio non
            numquam sunt mollitia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Cum temporibus inventore animi in nihil eius
            voluptates dolore maxime cumque facere doloribus, ex ab voluptatem
            blanditiis, eos soluta odit. Facere, tempore.
          </div>
        </div>
      </div>
    </template>
    <div v-if="userActive" class="publicaciones">
      <div class="vista">
        <template v-for="n in 50" :key="n">
          <Publicacion />
        </template>
      </div>
    </div>
    <button v-if="!userActive" class="post">
      <RouterLink to="./post"><a href=""><b>+</b></a></RouterLink>
    </button>
  </main>
</template>

<style scoped>
main {
  margin: 80px auto 0;
}
.publicaciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  margin-bottom: 100px;
}
.vista {
  width: 60%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  /* Centra el contenido horizontalmente */
  justify-content: center;
  /* Centra el contenido verticalmente */
}
.portada {
  background-color: var(--alt-black);
  text-align: center;
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 3px solid #292823bf;
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
}

.logo {
  margin-right: 20px;
  width: 8.5%;
}

.title {
  color: aliceblue;
  font-size: 35px;
  font-family: "BioRhyme", serif;
  font-weight: bold;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "width" 100;
}

.login_or_register,
.services {
  color: aliceblue;
  text-align: center;
  align-items: center;
  font-size: 15px;
  font-family: "BioRhyme", serif;
  font-weight: bold;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "width" 100;
  padding: 5px;
  border-radius: 2px;
  margin-left: auto;
  margin-right: auto;
}
.container_log-or-reg,
.container_services {
  display: flex;
  justify-content: center;
  border-radius: 4px;
  margin: 10px auto;
  margin-top: 2%;
  padding: 20px 30px;
  background-color: var(--dark-blue);
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
  width: 85%;
}

a {
  padding: 27px;
  text-decoration: none;
  color: aliceblue;
}

a:hover {
  color: black;
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-family: inherit;
  font-size: 15px;
  margin: 2.5%;
  margin-bottom: 5%;
}

button.button-login_register, button.post {
  font-weight: 600;
  color: black;
  text-transform: uppercase;
  padding: 1em 0.2em;
  background: var(--blue);
  border: 2px solid var(--alt-black);
  border-radius: 0.75em;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: background 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
  transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
    background 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
  margin-left: auto;
  margin-right: auto;
  display: block;
}

button.button-login_register::before, button.post::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-blue);
  border-radius: inherit;
  -webkit-box-shadow: 0 0 0 2px var(--blue), 0 0.625em 0 0 var(--dark-blue);
  box-shadow: 0 0 0 2px rgb(63, 63, 65), 0 0.625em 0 0;
  -webkit-transform: translate3d(0, 0.75em, -1em);
  transform: translate3d(0, 0.75em, -1em);
  transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
    box-shadow 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
}

.button-login_register:hover, button.post:hover {
  color: black;
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

.button-login_register:hover::before, button.post:hover::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0 whitesmoke;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.button-login_register:active, button.post:active {
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.button-login_register:active::before, button.post::before {
  -webkit-box-shadow: 0 0 0 2px grey, 0 0 rgb(95, 88, 88);
  box-shadow: 0 0 0 2px rgb(65, 58, 58), 0 0 rgb(192, 178, 178);
  -webkit-transform: translate3d(0, 0, -1em);
  transform: translate3d(0, 0, -1em);
}
button a {
  color: white;
}
button:hover a {
  color: black;
}
@media (max-width: 1100px) {
  .vista {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
}
@media (max-width: 875px) {

  .publicaciones {
    margin-left: 0;
  }
  .vista {
    margin: 0px;

    width: 100%;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
