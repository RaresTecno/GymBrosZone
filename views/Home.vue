<script setup>
import Publicacion from '../components/Publicacion.vue'
import { userActive } from '../clients/supabase'


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
          <i><b>Inicia Sesión</b></i> o <i><b>Regístrate</b></i> para acceder a GymBros Zone
        </p>
      </div>
    </div>
    <button class="button-login_register">
      <RouterLink to="/log/login"><a href=""><i>Login</i></a></RouterLink>
    </button>
    <button class="button-login_register">
      <RouterLink to="/log/register"><a href=""><i>Registro</i></a></RouterLink>
    </button>
    <div class="container_services"> <!--  v-if="no-logged" -->
      <div class="services">
        <p>¿Qué ofrecemos?</p>
        <br />
        <cite
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea
          recusandae obcaecati quod alias esse aperiam aut necessitatibus odit
          eaque. Et sed ut harum perferendis nobis! Amet harum labore debitis
          fugit. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Excepturi nam eveniet cum, quis quo laboriosam, sint est ratione velit
          minus consectetur impedit corrupti eum explicabo optio non numquam
          sunt mollitia! Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cum temporibus inventore animi in nihil eius voluptates dolore
          maxime cumque facere doloribus, ex ab voluptatem blanditiis, eos
          soluta odit. Facere, tempore.
        </cite>
      </div>
    </div>
  </template>
    <div v-if="userActive" id="reja">
     <template v-for="n in 50" :key="n">
        <Publicacion />
      </template>
    </div>
  </main>
</template>

<style scoped>
main {
  width: fit-content;
  padding-top: 80px ;
  margin: auto;
}
#reja {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.title {
  color: aliceblue;
  font-size: 35px;
  font-family: "BioRhyme", serif;
  font-weight: bold;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "width" 100;
}
.logo {
  margin-right: 20px;
  width: 12.5%;
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
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.301);
  margin-left: auto;
  margin-right: auto;
}
.container_log-or-reg,
.container_services {
  margin-top: 2%;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  margin: 10px auto;
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
  margin: 5%;
}

button.button-login_register {
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

button.button-login_register::before {
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
  box-shadow: 0 0 0 2px rgb(63, 63, 65), 0 0.625em 0 0 var(--greeny-cyan);
  -webkit-transform: translate3d(0, 0.75em, -1em);
  transform: translate3d(0, 0.75em, -1em);
  transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
    box-shadow 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
}

.button-login_register:hover {
  color: black;
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

.button-login_register:hover::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0 whitesmoke;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.button-login_register:active {
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.button-login_register:active::before {
  -webkit-box-shadow: 0 0 0 2px grey, 0 0 rgb(95, 88, 88);
  box-shadow: 0 0 0 2px rgb(65, 58, 58), 0 0 rgb(192, 178, 178);
  -webkit-transform: translate3d(0, 0, -1em);
  transform: translate3d(0, 0, -1em);
}
button a{
  color: white;
}
button:hover a{
  color: black;
}
</style>
