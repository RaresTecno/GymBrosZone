<script setup>
import { ref, watch } from 'vue';

const tema = ref('');
const contenido = ref('');
const validarTema = ref(false);
const validarContenido = ref(false);
const maxLength = 500; // Máximo número de caracteres permitidos

//Comprobamos validación de input y textarea sólo si hay cambios o se ha escrito
watch(tema, (newValue) => {
  validarTema.value = /^[a-zA-Z\s]+$/.test(newValue);
});

watch(contenido, (newValue) => {
  validarContenido.value = /^[\s\S]*\S[\s\S]*$/.test(newValue);
});

if (tema.value && !validarTema) {
  console.log('La temática debe contener solo letras y espacios');
}

if (contenido.value && !validarContenido) {
  console.log('El contenido no puede estar vacío');
}

function updateCharacterCount() {
  const caracteresEscritos = contenido.value.length;
  caracteresRestantes.value = maxLength - caracteresEscritos;
}

const intentoPublicar = ref(false);

function handleClickPublicar() {
  intentoPublicar.value = true;
}

const caracteresRestantes = ref(maxLength);
updateCharacterCount();
</script>


<template>
  <div class="todo_publicar">
    <div class="publicar_container">
      <div class="titulo_publicar">
        <div class="tit_publicar">
          Publicar
        </div>
      </div>
      <div class="contenido_publicar">
        <div class="div_imagen">
          <div class="prev_imagen">

          </div>
        </div>
        <div class="div_contenido">

        </div>
      </div>
    </div>
    <!-- <router-link to="./Acccount.vue">Account</router-link>
    <button class="close_account"><span class="text">Account</span><span class="icon"><svg
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
          </path>
        </svg></span></button> -->
    <!-- <div class="container">
      <div class="form_area">
        <p class="title">Publicar</p>
        <form action="#" id="form-post">
          <div class="card">
          </div>

          <div class="form_group">
            <label class="sub_title" for="foto">Elegir Foto</label>
            <input placeholder="Elige foto" class="form_style" type="file" />
          </div>
          <div class="form_group">
            <label class="sub_title" for="tema">Temática</label>
            <input v-model="tema" placeholder="Temática (opcional)" id="tema" class="form_style" type="text" />
          </div>
          <div class="form_group">
            <label class="sub_title" for="contenido">Contenido</label>
            <textarea v-model="contenido" name="contenido" id="contenido" class="form_style" cols="30" rows="10"
              placeholder="Escribe aquí el contenido..." @input="updateCharacterCount"></textarea>
          </div>
          <div class="form_group error_container">
            <span v-if="tema && !validarTema.value" class="error">La temática debe contener solo letras y
              espacios</span>
            <span v-if="contenido != '' && !validarContenido" class="error">El contenido no puede estar vacío</span>
            <span v-if="contenido" class="character-count">Caracteres restantes: {{ caracteresRestantes }}</span>
          </div>
          <div>
            <button class="publicar" :disabled="!validarTema || !validarContenido"
              @click="handleClickPublicar">Publicar</button>
          </div>
        </form>
      </div>
      <a class="link" href=""></a>
    </div> -->
  </div>

</template>

<style scoped>
.todo_publicar {
  background-color: red;
  width: 100vw;
  height: fit-content;
  padding-left: 60px;
  display: flex;
  justify-content: center;
  margin-top: 80px;
  padding-bottom: 150px;
}

.publicar_container {
  width: 80%;
  margin-top: 100px;
  height: 550px;
  background-color: var(--dark-blue);
  max-width: 1126px;
  border: var(--black) 4px solid;
  border-radius: 6px;
  min-width: 761px;
}

.titulo_publicar {
  background-color: green;
}

.tit_publicar {
  color: var(--light-blue-text);
  padding: 15px 0 15px 20px;
  font-size: 45px;
  font-weight: bold;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.contenido_publicar {
  display: flex;
  height: calc(100% - 82px);
  width: 100%;
}

.div_imagen {
  width: 45%;
  height: 100%;
  background-color: blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}

.prev_imagen {
  width: 85%;
  height: 70%;
  background-color: var(--light-blue-text);
}

.div_contenido {
  width: calc(55% + 2px);
  height: 100%;
  background-color: blueviolet;
}

@media(max-width: 1275px) {
  .prev_imagen {
    height: 55%;
  }

  .publicar_container {
    height: 480px;
  }
}

@media(max-width: 875px) {
  .todo_publicar {
    margin-top: -6px;
  }

  .publicar_container {
    width: 100%;
    margin-top: 100px;
    height: 850px;
    background-color: var(--dark-blue);
    max-width: 1126px;
    border: none;
    border-radius: 6px;
    min-width: 0;
  }

  .contenido_publicar {
    flex-direction: column;
  }

  .div_imagen {
    width: 100%;
    height: 800px;
    background-color: blue;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
  }

  .prev_imagen {
    width: 55%;
    min-width: 440px;
    height: 70%;
    background-color: var(--light-blue-text);
  }

  .div_contenido {
    width: 100%;
    height: 100%;
    background-color: blueviolet;
  }
}

@media(max-width: 600px) {
  .todo_publicar {
    margin-top: 68px;
  }

  .tit_publicar{
    font-size: 35px;
  }
}



/* .container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-bottom: 3vh;
  height: fit-content;
  width: 100vw;
  padding-top: 145;
  overflow: hidden;
}

.form_area {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: fit-content;
  width: 50%;
  max-width: 1050px;
  border: 3px solid var(--alt-black);
  border-radius: 20px;
  box-shadow: 3px 4px 0px 1px black;
  overflow: hidden;
}

.title {
  color: aliceblue;
  font-weight: 1200;
  font-size: 2.3em;
  margin-top: 20px;
}

.sub_title {
  font-weight: 600;
  margin: 5px 0;
}

.form_group {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin: 1.75vw;
}

.form_style {
  outline: none;
  border: 2px solid #264143;
  box-shadow: 3px 4px 0px 1px black;
  height: 2.3vw;
  width: 35.5vw;
  padding: 12px 10px;
  border-radius: 4px;
  font-size: 18px;
  cursor: text;
  overflow: hidden;
}

.form_group [type="file"] {
  height: 2vw;
}

#contenido {
  height: 13vw;
}

.form_style:focus,
.btn:focus {
  transform: translateY(4px);
  box-shadow: 1px 2px 0px 0px var(--alt-black);
}

.card {
  position: relative;
  width: 400px;
  height: 300px;
  margin-top: 3.5vh;
  margin-left: 11.5vw;
  background-color: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 5px #ffffff80;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card svg {
  width: 48px;
  fill: #333;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.card__content {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 700;
}

.card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #777;
  line-height: 1.4;
}

label.sub_title {
  color: aliceblue;
}

input,
textarea {
  background-color: var(--blue-inputs);
  color: rgba(240, 248, 255, 0.7267);
}

input::placeholder,
textarea::placeholder {
  color: rgba(240, 248, 255, 0.726);
}

.error_container {
  margin: 6.5%;
  max-width: 35.5vw;
  overflow: hidden;
}

.error {
  color: aliceblue;
  overflow: hidden;
  display: inline-block;
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
  width: 12vw;
  max-width: 175px;
}

button.publicar {
  margin: 8.5%;
  font-weight: 600;
  color: aliceblue;
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

button.publicar:disabled {
  background-color: rgba(61, 57, 57, 0.295);
}

button.publicar::before {
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

button.publicar:hover {
  color: black;
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

button.publicar::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0 whitesmoke;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.publicar:active {
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.publicar::before {
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

button.close_account {
  margin-top: 12vh;
  margin-left: 32.5vw;
  width: 150px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: var(--blue);
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  background: var(--dark-blue);
}

button.close_account,
button.close_account span {
  transition: 200ms;
}

button.close_account .text {
  transform: translateX(35px);
  color: aliceblue;
  font-weight: bold;
}

button.close_account .icon {
  position: absolute;
  border-left: 1px solid aliceblue;
  transform: translateX(110px);
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button.close_account svg {
  width: 15px;
  fill: #eee;
}

button.close_account:hover {
  background: var(--alt-black);
}

button.close_account:hover .text {
  color: transparent;
}

button.close_account:hover .icon {
  width: 150px;
  border-left: none;
  transform: translateX(0);
}

button.close_account:focus {
  outline: none;
}

button.close_account:active .icon svg {
  transform: scale(0.8);
}

.character-count {
  color: aliceblue;
}

@media only screen and (max-width: 875px) and (max-height: 1098px) {
  .container {
    margin-top: 3%;
  }

  button.button-publicar {
    margin: 5%;
  }

  button.close_account {
    margin-left: 18vw;
  }
}

@media only screen and (max-width: 1440px) {
  .container {
    margin-bottom: 3vh;
    height: 100%;
    width: 100%;
  }

  .form_area {
    height: auto;
    width: auto;
  }

  .title {
    font-weight: 900;
    font-size: 1.5em;
  }

  .form_group {
    margin: 10px;
  }

  .form_style {
    height: auto;
    width: 290px;
    padding: 12px 10px;
    border-radius: 4px;
    font-size: 15px;
  }

  .form_group [type="file"] {
    height: 5vw;
  }

  .card {
    height: 200px;
    width: 250px;
    margin-top: 10%;
    margin-left: 10%;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card svg {
    width: 48px;
  }

  .card__content {
    margin-top: 0;
    top: 0;
  }

  .sub_title {
    font-weight: 600;
    margin: 5px 0;
  }

  #contenido {
    height: inherit;
  }

  .error_container {
    max-width: 290px;
  }
} */
</style>
