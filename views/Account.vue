<script setup>
import {logOut, userState } from '../clients/supabase';


</script>

<template>
  <div class="sub-header">
    <!--  v-if="logged" -->
    <img src="../assets/img/logo.png" alt="logo" class="logo" />
    <h1 class="title">GymBros Zone</h1>
  </div>
  <div class="img_perfil">
    <div class="image-container"></div>
    <img src="../assets/img/logo.png" alt="img-perfil" class="imgPerfil">
    <img src="../assets/icons/imgUpload.png" alt="upload IMG" class="img-icon">
  </div>
  <div class="container_formulario">
    <form action="Profile.vue" method="POST" class="formulario" novalidation>
      <!--  v-if="logged" -->
      <div class="column">
        <label for="nombre">Nombre: &nbsp &nbsp</label>
        <input type="text" name="nombre" placeholder="Escriba su nombre" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="edad">Fecha de Nacimiento: &nbsp &nbsp</label>
        <input type="date" name="edad" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="peso">Peso: &nbsp &nbsp</label>
        <input type="number" name="peso" placeholder="Escriba su peso" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="localidad">Localidad: &nbsp &nbsp</label>
        <input
          type="text"
          name="localidad"
          placeholder="Escriba su localidad"
        />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
      </div>
      <div class="column">
        <label for="apellidos">Apellidos: &nbsp &nbsp</label>
        <input
          type="text"
          name="apellidos"
          placeholder="Escriba sus apellidos"
        />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="sexo">Sexo: &nbsp &nbsp</label>
        <input type="text" name="sexo" placeholder="Escriba su sexo" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="altura">Altura: &nbsp &nbsp</label>
        <input type="text" name="altura" placeholder="Escriba su altura" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="gym">Gym: &nbsp &nbsp</label>
        <input type="text" name="gym" placeholder="¿Dónde entrenas?" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
      </div>
    </form>
  </div>
  <button class="cerrar-sesion" @click="logOut">
    <RouterLink to="/" ><i>Cerrar Sesión</i></RouterLink>
  </button>
</template>

<style scope>
.sub-header {
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

.img_perfil{
  text-align: center;
}

.imgPerfil{
  width: 20%;
  height: auto;
}

.img-container {
  display: flex;
  align-items: center;
}


.img-icon{
  margin-bottom: 14%;
  width: 25px;
  height: auto;
  cursor: pointer;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex-direction: column;
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
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.349), 0 0 20px white;
  margin-left: auto;
  margin-right: auto;
}

.formulario > * {
  margin-bottom: 10px;
}

.container_lapiz {
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
  width: 20px;
  height: 5%;
}

.lapiz {
  width: 18px;
  height: auto;
  cursor: pointer;
}

.container_formulario {
  margin-top: 2%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 15px auto 30px;
  padding: 20px 30px;
  background-color: var(--dark-blue);
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
  width: 85%;
  height: auto;
}

.column{
  display: flex;
  flex-direction: column;
}

a {
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
  margin: 1%;
}

button.cerrar-sesion {
  font-weight: 600;
  color: black;
  text-transform: uppercase;
  padding: 1.25em 2em;
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

button.cerrar-sesion::before {
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

button.cerrar-sesion:hover {
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

button.cerrar-sesion:hover::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0 whitesmoke;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.cerrar-sesion:active {
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.cerrar-sesion:active::before {
  -webkit-box-shadow: 0 0 0 2px grey, 0 0 rgb(95, 88, 88);
  box-shadow: 0 0 0 2px rgb(65, 58, 58), 0 0 rgb(192, 178, 178);
  -webkit-transform: translate3d(0, 0, -1em);
  transform: translate3d(0, 0, -1em);
}
</style>
