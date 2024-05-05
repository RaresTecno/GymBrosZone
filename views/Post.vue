<script setup>
import { ref } from 'vue';
import { supabase, userState } from '../clients/supabase';

const tematica = ref('');
const contenido = ref('');

const tematicaInput = ref(null);
const contenidoInput = ref(null);
// const validarTema = ref(false);
// const validarContenido = ref(false);
// const maxLength = 500; // Máximo número de caracteres permitidos
const hayImagen = ref(false);
const fileInput = ref(null);
const imagenPreview = ref(null);
const logo_foto = ref(null);
const fondo_imagen = ref(null);
const div_quitar_imagen = ref(null);
const div_girar_imagen = ref(null);

//Comprobamos validación de input y textarea sólo si hay cambios o se ha escrito
// watch(tema, (newValue) => {
//   validarTema.value = /^[a-zA-Z\s]+$/.test(newValue);
// });

// watch(contenido, (newValue) => {
//   validarContenido.value = /^[\s\S]*\S[\s\S]*$/.test(newValue);
// });

// if (tema.value && !validarTema) {
//   console.log('La temática debe contener solo letras y espacios');
// }

// if (contenido.value && !validarContenido) {
//   console.log('El contenido no puede estar vacío');
// }

// function updateCharacterCount() {
//   const caracteresEscritos = contenido.value.length;
//   caracteresRestantes.value = maxLength - caracteresEscritos;
// }

// const intentoPublicar = ref(false);

// function handleClickPublicar() {
//   intentoPublicar.value = true;
// }

// const caracteresRestantes = ref(maxLength);
// updateCharacterCount();

const mensajeAviso = ref('');
const mostrarAviso = ref(false);

function aviso(mensaje, Input) {
  mensajeAviso.value = mensaje;
  mostrarAviso.value = true;
  Input.value.focus();
}

function avisoImagen(mensaje) {
  mensajeAviso.value = mensaje;
  mostrarAviso.value = true;
  quitar_imagen();
}

async function publicar() {
  if (validarTematica() && validarContenido()) {
    if (hayImagen.value) {
      const data = await insertarImagen();
      console.log(data);
    } else {
      avisoImagen('Debes incluir una imagen.');
    }
  }
}

async function insertarImagen() {
  const imagen = fileInput.value.files[0];
  console.log(imagen);
  const ruta = `${imagen.name}`;
  console.log(imagen.name+' este es el nombre');
  const { data, error } = await supabase.storage
    .from('archivos-usuarios')
    .upload(ruta, imagen)

  if(error){
    avisoImagen('Ha ocurrido un error al guardar la imagen.');
  }
  return data;
}

function validarTematica() {
  if (!/['"]/.test(tematica.value)) {
    if (tematica.value.length <= 35) {
      return true;
    } else {
      aviso('La temática ingresada es demasiado larga.', tematicaInput);
    }
  } else {
    aviso('La temática contiene comillas simples o dobles.', tematicaInput);
  }
  return false;
}

function validarContenido() {
  if (!/['"]/.test(contenido.value)) {
    if (contenido.value.length <= 440) {
      return true;
    } else {
      aviso('El contenido es demasiado largo.', contenidoInput);
    }
  } else {
    aviso('El contenido contiene comillas simples o dobles.', contenidoInput);
  }
  return false;
}

//Para que cuando se haga click en el preview de la foto se autopulse el input de la foto.
function triggerFileInput() {
  fileInput.value.click();
}

function cerrar_publicar() {
  window.location.href = "/";
}

function quitar_imagen() {
  hayImagen.value = false;
  imagenPreview.value.src = '';
  logo_foto.value.style.display = 'block';
  fondo_imagen.value.style.backgroundColor = 'var(--light-blue-text)';
  div_quitar_imagen.value.style.display = 'none';
  div_girar_imagen.value.style.display = 'none';
}

function girar_imagen() {
  if (imagenPreview.value.style.objectFit == 'cover') {
    imagenPreview.value.style.maxWidth = '100%';
    imagenPreview.value.style.maxHeight = '100%';
    imagenPreview.value.style.objectFit = 'fill';
    imagenPreview.value.style.width = 'auto';
    imagenPreview.value.style.height = 'auto';
  } else {
    imagenPreview.value.style.maxWidth = 'none';
    imagenPreview.value.style.maxHeight = 'none';
    imagenPreview.value.style.objectFit = 'cover';
    imagenPreview.value.style.width = '100%';
    imagenPreview.value.style.height = '100%';
  }
}

function resetInput(event) {
  hayImagen.value = false;
  event.target.value = null;
}

function handleImageChange(event) {
  const file = event.target.files[0];

  //Comprobamos que haya un archivo
  if (!file) return;

  //Comprobación del tipo de archivo
  if (!file.type.startsWith('image/')) {
    avisoImagen('Por favor, selecciona una imagen válida.');
    //Limpiamos el input si el archivo no es una imagen
    event.target.value = '';
    return;
  }
  //Máximo 3MB
  const tamMax = 3 * 1024 * 1024;
  if (file.size > tamMax) {
    avisoImagen('El archivo supera el tamaño máximo permitido, 3 MB.');
    //Limpiamos el input si el archivo es demasiado grande
    event.target.value = '';
    return;
  }
  mostrarImagen(file);
}

function mostrarImagen(file) {
  mensajeAviso.value = '';
  mostrarAviso.value = false;
  hayImagen.value = true;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagenPreview.value.src = e.target.result;
    imagenPreview.value.style.display = 'block';
    logo_foto.value.style.display = 'none';
    fondo_imagen.value.style.backgroundColor = 'rgba(12, 12, 12, 0.804)';
    div_quitar_imagen.value.style.display = 'flex';
    div_girar_imagen.value.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}
</script>



<template>
  <div class="todo_publicar">
    <div class="publicar_container">
      <div class="titulo_publicar">
        <div class="tit_publicar">
          Publicar
        </div>
        <div class="cerrar_publicar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="cerrar_publicar">
            <path
              d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
            </path>
          </svg>
        </div>
      </div>
      <div class="contenido_publicar">
        <div class="div_imagen">
          <div class="prev_imagen" @click="triggerFileInput" ref="fondo_imagen">
            <div class="div_quitar_imagen" ref="div_quitar_imagen">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 24 24" class="quitar_imagen"
                @click="quitar_imagen" @click.stop>
                <path
                  d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                </path>
              </svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ref="logo_foto">
              <path
                d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z">
              </path>
            </svg>
            <img id="imagen" ref="imagenPreview" src="" style="display: none;" />
            <div class="div_girar_imagen" ref="div_girar_imagen">
              <svg width="600px" height="600px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="girar_imagen" @click="girar_imagen" @click.stop>
                <g id="Arrow / Expand">
                  <path id="Vector" d="M10 19H5V14M14 5H19V10" stroke="#000000" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </g>
              </svg>
            </div>
          </div>
          <div class="div_input_imagen">
            <input class="input_file" type="file" ref="fileInput" @change="handleImageChange" @click="resetInput" />
            <div class="anadir">
              <div class="anadir_texto">
                <button>
                  Seleccionar imagen
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="div_contenido">
          <div class="container">
            <div class="subcontainer">
              <input type="text" id="tematica" class="input" required autocomplete="off" ref="tematicaInput"
                v-model="tematica" placeholder="(Opcional)">
              <label class="label" for="tematica">Temática</label>
            </div>
          </div>
          <div class="container contenido">
            <div class="subcontainer">
              <textarea id="contenido" class="input textarea" required autocomplete="off" ref="contenidoInput"
                v-model="contenido" maxlength="440" rows="10"
                placeholder="Contenido de la publicación (Opcional)"></textarea>
              <label class="label" for="contenido">Contenido</label>
            </div>
          </div>
          <div class="publicar">
            <div class="publicar_div">
              <button class="publicar_boton" @click="publicar">Publicar</button>
            </div>
          </div>
        </div>
      </div>
      <div class="aviso" :style="{ visibility: mostrarAviso ? 'visible' : 'hidden' }">
        <div class="aviso_texto">
          {{ mensajeAviso }}
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
  background-color: var(--bg-color);
  width: 100vw;
  height: fit-content;
  padding-left: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  padding-bottom: 150px;
}

.publicar_container {
  width: 80%;
  margin-top: 100px;
  height: 520px;
  background-color: var(--dark-blue);
  max-width: 1026px;
  border: var(--black) 4px solid;
  border-radius: 6px;
  min-width: 761px;
}

.aviso {
  height: 35px;
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.aviso_texto {
  width: fit-content;
  font-size: 20px;
  padding: 3px 15px;
  border-radius: 2px;
  border: var(--border-bg-color2);
  background-color: var(--bg-color2);
}

.titulo_publicar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
}

.tit_publicar {
  color: var(--light-blue-text);
  padding: 10px 0 10px 20px;
  font-size: 40px;
  font-weight: bold;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.cerrar_publicar {
  cursor: pointer;
}

.cerrar_publicar svg path {
  fill: var(--light-blue-text);
  stroke: var(--dark-blue);
  stroke-width: 2.5px;
}

.contenido_publicar {
  display: flex;
  height: calc(100% - 82px);
  width: 100%;
}

.div_quitar_imagen {
  position: absolute;
  display: flex;
  align-items: center;
  top: 8px;
  z-index: 10;
  width: 95%;
  height: 20px;
  display: none;
}

svg.quitar_imagen {
  width: 20px !important;
  background-color: var(--light-blue-text);
  height: 20px !important;
}

.div_quitar_imagen svg path {
  fill: black;
  stroke: var(--light-blue-text);
  stroke-width: 1.5px;
}

.div_girar_imagen {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: end;
  bottom: 12px;
  left: 12px;
  z-index: 10;
  width: 95%;
  height: 20px;
  display: none;
}

svg.girar_imagen {
  background-color: var(--light-blue-text);
  border-radius: 50%;
  width: 30px !important;
  height: 30px !important;
}

.div_imagen {
  width: 45%;
  height: calc(100% + 10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  position: relative;
}

.prev_imagen {
  position: relative;
  width: 350px;
  height: 350px;
  background-color: var(--light-blue-text);
  border-radius: 5px;
  border: 2px solid black;
  box-shadow: 2px 2px 8px var(--very-dark-blue);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.prev_imagen svg {
  width: 40px;
  height: 40px;
  transition: filter 0.3s;
  filter: opacity(0.9);

}

#imagen {
  /* width: 100%;
  height: 100%;
  object-fit: cover; */
  max-width: 100%;
  max-height: 100%;
}

.prev_imagen:hover svg,
.prev_imagen:active svg {
  filter: opacity(0.7);
}

.div_contenido {
  width: calc(55% + 2px);
  height: 100%;
}

.publicar {
  height: fit-content;
  width: 100%;
}

.publicar {
  margin-top: 5px;
  margin-bottom: 40px;
  height: 37px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.div_input_imagen {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  height: 74px;
}

.input_file {
  width: 20%;
  height: 37px;
  width: 200px;
  border-radius: 2px;
  position: relative;
  top: 18.5px;
  cursor: pointer;
}

.anadir {
  height: 37px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -18.5px;
  pointer-events: none;
}

.anadir_texto {
  width: 28%;
  min-width: 275px;
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

.anadir_texto button {
  padding: 0 19px;
  cursor: pointer;
  background-color: var(--blue-inputs);
  border: solid var(--black) 2px;
  color: var(--light-blue-text);
  border-radius: 2px;
  font-size: 18px;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
  pointer-events: none;
}

.anadir_texto button:hover,
.anadir_texto button:active {
  border: 2px solid #eef2fa81;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: relative;
  align-items: center;
  color: var(--light-blue-text);
  width: 100%;
  margin-top: 15px;
  margin-bottom: 50px;
}

.contenido {
  margin-bottom: 25px;
}

.subcontainer {
  display: flex;
  justify-content: start;
  width: 80%;
}


.container .label {
  font-size: 24px;
  padding-left: 10px;
  position: absolute;
  top: 9.5px;
  transition: 0.3s;
  pointer-events: none;
  padding-left: 2px;
  transform: translateY(-36px);
}

.input {
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  padding: 0px 8px;
  border-radius: 2px;
  color: var(--light-blue-text);
  font-size: 18px;
  background-color: var(--blue-inputs);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 1);
  cursor: pointer;
}

.input:focus {
  border: 2px solid transparent;
  color: var(--light-blue-text);
}

.container .input:valid,
.container .input:focus {
  border: 2px solid var(--grey-buttons-inputs-border);
}

.textarea {
  resize: none;
  height: 255px;
  padding: 12px 8px;
}

.textarea::-webkit-scrollbar {
  display: none;
}

.publicar_div {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  justify-content: end;
}

.publicar_div button {
  cursor: pointer;
  background-color: var(--blue-buttons);
  width: 27%;
  border: solid var(--black) 2px;
  border-radius: 2px;
  font-size: 18px;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
}

.publicar_div button:hover,
.publicar_div button:active {
  background-color: var(--very-dark-blue);
  color: var(--light-blue-text);
  border: 2px solid var(--grey-buttons-inputs-border);
}

#file-upload-button {
  cursor: pointer !important;
  width: 0 !important;
}

::placeholder {
  color: var(--light-blue-text);
  opacity: 0.8;
  font-size: 17px;
}

::-moz-placeholder {
  color: var(--light-blue-text);
  font-size: 17px;
  opacity: 0.8;
}

:-ms-input-placeholder {
  color: var(--light-blue-text);
  font-size: 17px;
  opacity: 0.8;
}

::-ms-input-placeholder {
  color: var(--light-blue-text);
  font-size: 17px;
  opacity: 0.8;
}

@media(max-width: 1275px) {
  .prev_imagen {
    width: 305px;
    height: 305px;
  }

  .publicar_container {
    height: 500px;
  }

  .container {
    margin-bottom: 42px;
  }

  .textarea {
    resize: none;
    height: 225px;
    padding: 12px 8px;
  }

  .container .label {
    font-size: 22px;
  }

  #tematica {
    height: 40px;
  }
}

@media(max-width: 1040px) {
  .publicar_container {
    width: 89%;
  }

  .div_imagen {
    min-width: 367px;
  }

  .div_contenido {
    min-width: 430px;
  }

  .publicar_container {
    min-width: 794px;
  }
}

@media(max-width: 875px) {
  .todo_publicar {
    margin-top: -6px;
    padding: 0;
  }

  .tit_publicar {
    font-size: 40px;
    padding: 15px 30px;
    height: 70px;
  }

  .cerrar_publicar {
    margin-right: 4px;
  }

  .publicar_container {
    width: 100%;
    margin-top: 100px;
    height: 850px;
    background-color: var(--dark-blue);
    max-width: 1126px;
    border: none;
    border-radius: 0;
    min-width: 0;
  }

  .contenido_publicar {
    flex-direction: column;
  }

  .div_imagen {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  .prev_imagen {
    width: 400px;
    height: 400px;
  }

  .div_contenido {
    width: 100%;
    height: fit-content;
    background-color: var(--dark-blue);
  }

  .div_input_imagen {
    margin-top: 10px;
    height: 60px;
  }

  .container .label {
    font-size: 24px;
  }

  .publicar {
    margin-top: 70px;
  }

  .aviso {
    height: 35px;
    width: 100%;
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .aviso_texto {
    width: fit-content;
    font-size: 19px;
    padding: 3px 15px;
    border-radius: 2px;
    color: var(--light-blue-text);
    border: none;
    background-color: transparent;
    text-align: center;
  }

  .publicar_div {
    justify-content: center;
  }

  .anadir {
    top: -13.5px;
  }
}

@media(max-width: 600px) {
  .tit_publicar {
    font-size: 35px;
  }

  .div_imagen {
    padding-top: 10px;
  }

  .prev_imagen {
    height: 350px;
    width: 350px;
  }

  .subcontainer {
    max-width: 450px;
  }

  .publicar_boton {
    min-width: 125px;
  }

  .container .label {
    font-size: 20px;
  }

  .anadir_texto button {
    font-size: 16px;
    width: 200px;
  }

  .aviso {
    margin-top: 0;
  }

  .aviso_texto {
    font-size: 17px;
  }

  .textarea {
    height: 200px;
  }
}

@media(max-width: 440px) {
  .tit_publicar {
    font-size: 32px;
    height: 60px;
  }

  .div_contenido,
  .subcontainer,
  .container {
    min-width: 0;
  }

  .prev_imagen {
    height: 300px;
    width: 300px;
  }

  .textarea,
  #tematica {
    font-size: 16px;
  }

  .aviso {
    margin-top: -100px;
  }

  .textarea {
    height: 150px;
  }
}

@media(max-width: 380px) {

  .todo_publicar,
  .publicar_container {
    height: 860px;
  }

  .tit_publicar {
    font-size: 32px;
    height: 60px;
  }

  .div_contenido,
  .subcontainer,
  .container {
    min-width: 0;
  }

  .prev_imagen {
    height: 250px;
    width: 250px;
  }

  .div_imagen {
    min-width: 0;
  }

  .textarea {
    height: 200px;
  }

  .publicar {
    margin-bottom: 30px;
    margin-top: 60px;
  }

  ::placeholder {
    font-size: 15px;
    word-spacing: -2px;
  }

  ::-moz-placeholder {
    font-size: 15px;
    word-spacing: -2px;
  }

  :-ms-input-placeholder {
    font-size: 15px;
    word-spacing: -2px;
  }

  ::-ms-input-placeholder {
    font-size: 15px;
    word-spacing: -2px;
  }

  .aviso {
    margin-top: -90px;
  }

  .aviso_texto {
    font-size: 15px;
    width: 85%;
  }

  .textarea {
    height: 125px;
  }
}

@media(max-width: 300px) {
  .prev_imagen {
    height: 220px;
    width: 220px;
  }

  .aviso {
    margin-top: -90px;
  }

  .todo_publicar,
  .publicar_container {
    height: 830px;
  }

  .aviso_texto {
    font-size: 15px;
    width: 85%;
  }

  ::placeholder {
    font-size: 13px;
    word-spacing: -2px;
  }

  ::-moz-placeholder {
    font-size: 13px;
    word-spacing: -2px;
  }

  :-ms-input-placeholder {
    font-size: 13px;
    word-spacing: -2px;
  }

  ::-ms-input-placeholder {
    font-size: 13px;
    word-spacing: -2px;
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
