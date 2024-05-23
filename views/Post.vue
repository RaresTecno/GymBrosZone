<script setup>
import { ref } from 'vue';
import { supabase, obtenerId } from '../clients/supabase';
import { disponible } from "../main";

disponible.value = true;

const tematica = ref('');
const contenido = ref('');

const tematicaInput = ref(null);
const contenidoInput = ref(null);
const hayImagen = ref(false);
const fileInput = ref(null);
const imagenPreview = ref(null);
const logo_foto = ref(null);
const fondo_imagen = ref(null);
const div_quitar_imagen = ref(null);
const div_girar_imagen = ref(null);

const mensajeAviso = ref('');
const mostrarAviso = ref(false);

/*Se avisa al usuario de que la temática o el contenido son demasiado largos.*/
function aviso(mensaje, Input) {
  mensajeAviso.value = mensaje;
  mostrarAviso.value = true;
  /*Ponemos el foco en el input que sea más largo de lo que debería.*/
  Input.value.focus();
}

/*Se avisa al usuario de que ha incluido un archivo inválido o que ha ocurrido algún error al guardar la imagen o la publicación.*/
function avisoImagen(mensaje) {
  mensajeAviso.value = mensaje;
  mostrarAviso.value = true;
  /*Quitamos la imagen.*/
  quitar_imagen();
}

/*Función para realizar la publicación.*/
async function publicar() {
  /*Validamos la temática y el contenido de la publicación.*/
  if (validarTematica() && validarContenido()) {
    /*Comprobamos si hay una imagen para así realizar la publicación.*/
    if (hayImagen.value) {
      /*Guardamos la imagen en la base de datos.*/
      const data = await insertarImagen();
      /*Guardamos la ruta, la temática y el contenido en la bdd.*/
      await guardarPublicacion(data);
    } else {
      avisoImagen('Debes incluir una imagen.');
    }
  }
}

/*Función para encriptar cadenas de texto.*/
async function hashString(cadena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(cadena);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/*Función para guardar la imagen en la bdd.*/
async function insertarImagen() {
  const imagen = fileInput.value.files[0];
  let nombreDisponible = false;
  let contador = 1;
  let nombrePublicacion;
  let ruta;
  let id = await obtenerId();
  let encId = await hashString(id);

  /*Buscamos un nombre único para almacenar la imagen con dicho nombre.*/
  do {
    /*Asignamos un posible nombre para la imagen. Falta juntarlo con el Id del usuario y encriptarlo.*/
    nombrePublicacion = 'post-' + contador;
    /*Creamos la ruta de la carpeta en la que se almacenará la imagen.*/
    ruta = `users/user-${encId}/post/`;
    /*Verificamos si la carpeta en la que almacenaremos la imagen existe.*/
    const { data: publicacion, error: errorPublicacion } = await supabase
      .storage
      .from('files')
      .list(ruta);
    /*Avisamos al usuario en caso de error.*/
    if (errorPublicacion) {
      avisoImagen('Ha ocurrido un error al guardar la publicación.');
      return false;
    }

    /*Encriptamos el nombre de la imagen que vamos a guardar.*/
    const nombreArchivo = await hashString(id + nombrePublicacion);
    /*Comprobamos si la carpeta en la que almacenaremos la imagen contiene alguna imagen con el mismo nombre de la imagen que hemos encriptado.*/
    const existePublicacion = publicacion.some(file => file.name === nombreArchivo);

    /*Si no existe una imagen con el nombre encriptado, la guardamos.*/
    if (!existePublicacion) {
      nombreDisponible = true;
      /*Guardamos la publicación.*/
      const rutaFinal = `${ruta}${nombreArchivo}`;
      const { data, error } = await supabase.storage
        .from('files')
        .upload(rutaFinal, imagen);
      /*Avisamos al usuario en caso de error.*/
      if (error) {
        avisoImagen('Ha ocurrido un error al guardar la publicación.');
        return false;
      }
      return [id, rutaFinal];
    } else {
      contador++;
    }
  } while (!nombreDisponible);
  /*Avisamos al usuario en caso de error.*/
  avisoImagen('Ha ocurrido un error al guardar la publicación.');
  return false;
}

/*Función para guarda la publicación del usuario.*/
async function guardarPublicacion(data) {
  /*Guardamos la publicación.*/
  let resolucion = '';
  if (imagenPreview.value.style.objectFit == 'cover') {
    resolucion = 'cover';
  } else {
    resolucion = 'normal';
  }
  const { error: insertError } = await supabase
    .from('publicaciones')
    .insert([{ idusuario: data[0], tematica: tematica.value, contenido: contenido.value, ruta: data[1], resolucion: resolucion }]);

  /*Avisamos al usuario en caso de error.*/
  if (insertError) {
    avisoImagen('Ha ocurrido un error al guardar la publicación.');
    return false;
  } else {
    /*Si se ha guardado la publicación, vaciamos todos los campos.*/
    quitar_imagen();
    tematica.value = '';
    contenido.value = '';
  }
}

/*Función para validar la temática.*/
function validarTematica() {
  if (tematica.value.length <= 35) {
    return true;
  } else {
    /*Avisamos al usuario en caso de error.*/
    aviso('La temática ingresada es demasiado larga.', tematicaInput);
  }
  return false;
}

/*Función para validar el contenido.*/
function validarContenido() {
  if (contenido.value.length <= 440) {
    return true;
  } else {
    /*Avisamos al usuario en caso de error.*/
    aviso('El contenido es demasiado largo.', contenidoInput);
  }
  return false;
}

/*Para que cuando se haga click en el preview de la foto se autopulse el input de la foto.*/
function triggerFileInput() {
  fileInput.value.click();
}

/*Redirigimos al usuario a home si pulsa el botón de cerrar publicar.*/
function cerrar_publicar() {
  window.location.href = "/";
}

/*Función para quitar la previsualización de la imagen.*/
function quitar_imagen() {
  hayImagen.value = false;
  imagenPreview.value.src = '';
  imagenPreview.value.style.display = 'none';
  logo_foto.value.style.display = 'block';
  fondo_imagen.value.style.backgroundColor = 'var(--light-blue-text)';
  div_quitar_imagen.value.style.display = 'none';
  div_girar_imagen.value.style.display = 'none';
}

/*Función para cambiar la resolución de la imagen.*/
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

/*Función para resetear el input de la imagen.*/
function resetInput(event) {
  hayImagen.value = false;
  event.target.value = null;
}

/*Función para comprobar la imagen.*/
function comprobarImagen(event) {
  const file = event.target.files[0];
  /*Comprobamos que haya un archivo*/
  if (!file) return;

  /*Comprobación del tipo de archivo*/
  if (!file.type.startsWith('image/')) {
    /*Avisamos al usuario en caso de error.*/
    avisoImagen('Por favor, selecciona una imagen válida.');
    /*Limpiamos el input si el archivo no es una imagen.*/
    event.target.value = '';
    return;
  }
  /*Máximo 4MB*/
  const tamMax = 4 * 1024 * 1024;
  if (file.size > tamMax) {
    /*Avisamos al usuario en caso de error.*/
    avisoImagen('El archivo supera el tamaño máximo permitido, 4 MB.');
    /*Limpiamos el input si el archivo es demasiado grande.*/
    event.target.value = '';
    return;
  }
  /*Llamamos a la función para mostrar la previsualización de la imagen.*/
  mostrarImagen(file);
}

/*Función para mostrar la previsualización de la imagen.*/
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
            <input class="input_file" type="file" ref="fileInput" @change="comprobarImagen" @click="resetInput" />
            <div class="anadir">
              <div class="anadir_texto">
                <button @click="triggerFileInput">
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
  margin-top: 120px;
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
  top: -1800.5px;
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
  padding: 8px 8px 12px;
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
    height: 225px;
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
    min-width: 794px;
  }

  .div_imagen {
    min-width: 367px;
  }

  .div_contenido {
    min-width: 430px;
  }
}

@media(max-width: 875px) {
  .todo_publicar {
    margin-top: -6px;
    padding: 0;
    background-color: var(--dark-blue);
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
    margin-top: 10px;
    height: fit-content;
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
    margin-bottom: 20px;
  }

  .aviso {
    transform: translateY(-135px);
  }

  .aviso_texto {
    font-size: 19px;
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

  .contenido {
    margin-top: 55px;
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

  .div_imagen {
    margin-top: 20px;
    margin-bottom: 10px
  }

  .prev_imagen {
    height: 300px;
    width: 300px;
  }

  .publicar {
    margin-bottom: 5px;
  }

  .textarea,
  #tematica {
    font-size: 16px;
  }

  .aviso {
    transform: translateY(-120px);
  }

  .textarea {
    height: 155px;
  }
}

@media(max-width: 380px) {

  .todo_publicar,
  .publicar_container {
    height: 920px;
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
    transform: translateY(-225px);
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

  .todo_publicar,
  .publicar_container {
    height: 1000px;
  }

  .prev_imagen {
    height: 220px;
    width: 220px;
  }

  .aviso {
    transform: translateY(-340px);
  }

  .aviso_texto {
    font-size: 15px;
    width: 90%;
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
</style>
