<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { supabase, logOut, userState } from '../clients/supabase';

const nombre = ref('');
  const edad = ref('');
  const peso = ref('');
  const localidad = ref('');
  const apellidos = ref('');
  const sexo = ref('');
  const altura = ref('');
  const gym = ref('');
  const gymtag = ref('');
  const mostrarMensaje = ref(false);
  const mensajeError = ref('');

  const nombreRegex = /^[a-zñáéíóú\s]{3,14}$/i;
  const apellidosRegex = /^[a-zñáéíóú\s-]{4,24}$/i;
  const gymtagRegex = /^[a-z0-9ñ._]{3,14}$/i;
  

  const validarNombre = () => {
    if (!nombreRegex.test(nombre.value)) {
      mensajeError.value = 'El nombre debe contener entre 3 y 14 letras.';
      mostrarMensaje.value = true;
      return true;
    }
    return false;
  }

  const validarApellidos = () => {
    if (!apellidosRegex.test(apellidos.value)) {
      mensajeError.value = 'Los apellidos deben contener entre 4 y 24 letras.';
      mostrarMensaje.value = true;
      return true;
    }
    return false;
  }

  const validarGym = () => {
    if (!nombreRegex.test(nombre.value)) {
      mensajeError.value = 'El Gym debe contener entre 3 y 14 letras.';
      mostrarMensaje.value = true;
      return true;
    }
    return false;
  }

  const validarLocalidad = () => {
    if (!nombreRegex.test(nombre.value)) {
      mensajeError.value = 'La localidad debe contener entre 3 y 14 letras.';
      mostrarMensaje.value = true;
      return true;
    }
    return false;
  }

  const validarGymtag = () => {
    const gymtagMin = gymtag.value.toLowerCase();
    gymtag.value = gymtagMin;

    if (gymtagMin.length >= 3 && gymtagMin.length <= 14) {
      if (!gymtagRegex.test(gymtagMin)) {
        mensajeError.value = 'Tu GymTag solo puede tener letras, números y algunos caracteres especiales.';
        mostrarMensaje.value = true;
        gymtag.value = '';
        return true;
      }
    } else {
      mensajeError.value = 'Tu GymTag debe tener entre 3 y 14 caracteres.';
      mostrarMensaje.value = true;
      gymtag.value = '';
      return true;
    }

    // Verificar si GymTag está disponible
    return false;
  }

  const validateForm = () => {
    // Validar que todos los campos estén llenos
    if (!nombre.value || !edad.value || !peso.value || !localidad.value || !apellidos.value || !sexo.value || !altura.value || !gym.value) {
      mensajeError.value = 'Por favor, complete todos los campos del formulario.';
      mostrarMensaje.value = true;
      return false;
    }
    mostrarMensaje.value = false;
    mensajeError.value = '';
    if (validarNombre() || validarApellidos() || validarGymtag() || validarGym() || validarLocalidad()) {
        return;
    }
    return true;
  }

const urlFoto = ref("../assets/img/logo.png");
console.log(urlFoto)

</script>

<template>
  <div class="img_perfil" v-if="!userActive">
    <div class="image-container"></div>
    <img src="../assets/img/logo.png" alt="img-perfil" class="imgPerfil">
    <img src="../assets/icons/imgUpload.png" alt="upload IMG" class="img-icon">
    <br>
    <input v-model="gymtag" type="text" class="gym_tag" placeholder="GymTag...">
  </div>
  <div class="container_formulario" v-if="!userActive">
    <form action="Profile.vue" method="POST" class="formulario" novalidation @submit="validateForm">
      <div class="column">
        <label for="nombre">Nombre: &nbsp &nbsp</label>
        <input v-model="nombre" class="inputs" type="text" name="nombre" placeholder="Escriba su nombre" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="edad">Fecha de Nacimiento: &nbsp &nbsp</label>
        <input type="date" class="inputs" name="edad" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="peso">Peso: &nbsp &nbsp</label>
        <input v-model="peso" type="number" class="inputs" name="peso" placeholder="Escriba su peso" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="localidad">Localidad: &nbsp &nbsp</label>
        <input
          v-model="localidad"
          type="text"
          class="inputs"
          name="localidad"
          placeholder="Escriba su localidad"
          autocomplete="off"
        />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
      </div>
      <div class="column">
        <label for="apellidos">Apellidos: &nbsp &nbsp</label>
        <input
          v-model="apellidos"
          class="inputs"
          type="text"
          name="apellidos"
          placeholder="Escriba sus apellidos"
          autocomplete="off"
        />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="sexo">Sexo: &nbsp &nbsp</label>
        <input v-model="sexo" type="text" class="inputs" name="sexo" placeholder="Escriba su sexo" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="altura">Altura: &nbsp &nbsp</label>
        <input v-model="altura" ype="text" class="inputs" name="altura" placeholder="Escriba su altura" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
        <label for="gym">Gym: &nbsp &nbsp</label>
        <input type="text" name="gym" placeholder="¿Dónde entrenas?" autocomplete="off" />
        <div class="container_lapiz">
          <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
        </div>
      </div>
      <div v-if="mostrarMensaje">{{ mensajeError }}</div>
    </form>
    <button type="submit" class="actualizar" @click="validateForm"><RouterLink to="/"><a href="">Actualizar</a></RouterLink></button>
  </div>
  <button class="cerrar-sesion" v-if="!userActive">
    <RouterLink to="/" @click="logOut"><i>Cerrar Sesión</i></RouterLink>
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
  margin-top: 3%;
  text-align: center;
}

.imgPerfil{
  width: 20%;
  height: auto;
  cursor: pointer;
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

.container_formulario {
    margin-top: 2%;

    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 15px auto 30px;
    padding: 20px 30px;
    background-color: var(--dark-blue);
    box-shadow: 0 2px 5px var(--alt-black);
    border: 3px solid black;
    width: 65%;
    height: 75%;
  }

@media (max-width: 805px) and (max-height: 1098px) {
  .img_perfil{
    margin-top: 15%;
  }

  .formulario > * {
    margin-bottom: 10px;
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
}


.container_lapiz {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0;
  cursor: pointer;
  width: 20px;
  height: 5%;
}

.lapiz {
  width: 18px;
  height: auto;
  cursor: pointer;
  position: absolute;
  right: 5px; 
}



.column{
  display: flex;
  flex-direction: column;
  position: relative;
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

button.cerrar-sesion, button.actualizar{
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

button.cerrar-sesion::before, button.actualizar::before{
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

button.cerrar-sesion:hover , button.actualizar:hover {
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

button.cerrar-sesion:hover::before , button.actualizar:hover::before{
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.cerrar-sesion:active , button.actualizar:active{
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.cerrar-sesion:active::before , button.actualizar:active::before{
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
