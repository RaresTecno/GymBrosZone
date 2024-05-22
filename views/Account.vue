<script setup>
import { ref, onMounted } from 'vue';
import predeterminada from '../assets/img/foto-perfil-predeterminada2.jpg';
import { supabase, obtenerId } from '../clients/supabase';
import { disponible } from "../main";

disponible.value = true;

const hayImagen = ref(false);
const fileInput = ref(null);
const imagenPreview = ref(null);
const fondo_imagen = ref(null);

const mensajeAviso = ref('');
const mostrarAviso = ref(false);





//Comprobamos el nombre ingresado.
function validarNombre() {
  const nombreT = nombre.value.trim();
  if (/^(?!.* {2,})[a-zñáéíóú\s-]{3,14}$/i.test(nombreT)) {
    return true;
  }
  mensaje('El nombre debe contener entre 3 y 14 letras.', nombreInput);
  return false;
}

//Comprobamos los apellidos ingresados.
function validarApellidos() {
  const apellidosT = apellidos.value.trim();
  if (/^(?!.* {2,})[a-zñáéíóú\s-]{3,24}$/i.test(apellidosT)) {
    return true;
  }
  mensaje('Los apellidos deben contener entre 3 y 24 letras.', apellidosInput);
  return false;
}

//Comprobamos el GymTag ingresado.
async function validarGymtag() {
  const gymtagMin = gymtag.value.toLowerCase();
  gymtag.value = gymtagMin;
  //Comprobamos que el tamaño del GymTag sea el deseado.
  if (gymtagMin.length < 3 || gymtagMin.length > 14) {
    mensaje('Tu GymTag debe tener entre 3 y 14 caracteres.', gymtagInput);
    return false;
  }
  //Comprobamos que los caracteres ingresados sean válidos.
  if (!/^[a-z0-9ñ._]+$/.test(gymtagMin)) {
    mensaje('Tu GymTag solo puede tener letras, números y algunos caracteres especiales.', gymtagInput);
    return false;
  }
  //Comprobamos si el GymTag está disponible.
  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('gymtag')
      .eq('gymtag', gymtagMin);

    if (error) throw error;
    //El gymtag estará en uso si usuarios contiene algún elemento.
    if (usuarios.length > 0) {
      mensaje('El GymTag ingresado ya está en uso.', gymtagInput);
      return false;
    }
    //GymTag disponible.
    return true;
  } catch (error) {
    mensaje('Hubo un error al verificar el GymTag. Por favor, inténtalo de nuevo.', gymtagInput);
    return false;
  }
}



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
// async function guardarPublicacion(data) {
//   /*Guardamos la publicación.*/
//   const { error: insertError } = await supabase
//     .from('publicaciones')
//     .insert([{ idusuario: data[0], tematica: tematica.value, contenido: contenido.value, ruta: data[1] }]);

//   /*Avisamos al usuario en caso de error.*/
//   if (insertError) {
//     avisoImagen('Ha ocurrido un error al guardar la publicación.');
//     return false;
//   } else {
//     /*Si se ha guardado la publicación, vaciamos todos los campos.*/
//     quitar_imagen();
//     tematica.value = '';
//     contenido.value = '';
//   }
// }

/*Para que cuando se haga click en el preview de la foto se autopulse el input de la foto.*/
function triggerFileInput() {
  fileInput.value.click();
}

/*Redirigimos al usuario a home si pulsa el botón de cerrar publicar.*/
function cerrar_mi_cuenta() {
  window.location.href = "/";
}

/*Función para quitar la previsualización de la imagen.*/
function quitar_imagen() {
  hayImagen.value = false;
  imagenPreview.value.src = predeterminada;
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
    fondo_imagen.value.style.backgroundColor = 'rgba(12, 12, 12, 0.804)';
  };
  reader.readAsDataURL(file);
}

/*Cuando carga, */
onMounted(async () => {
  const id = await obtenerId();
  let { data: foto, error } = await supabase
    .from('usuarios')
    .select('fotoperfil')
    .eq('id', id);
  if (error) {
    console.log(error);
  }
  if (foto[0].fotoperfil === '/predeterminada.png' || foto[0].fotoperfil === null) {
    imagenPreview.value.src = predeterminada;
  } else {
    imagenPreview.value.src = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/' + foto[0].fotoperfil;
  }
});

function confirmacion() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  // Crear el contenedor del contenido del modal
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '5px';
  modalContent.style.textAlign = 'center';

  // Crear el texto del modal
  const modalText = document.createElement('p');
  modalText.textContent = '¿Estás seguro?';

  // Crear el botón de confirmar
  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirmar';
  confirmButton.onclick = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // Re-enable scrolling
    console.log('Confirmado');
  };

  // Crear el botón de cancelar
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.onclick = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // Re-enable scrolling
    console.log('Cancelado');
  };

  // Agregar los elementos al contenido del modal
  modalContent.appendChild(modalText);
  modalContent.appendChild(confirmButton);
  modalContent.appendChild(cancelButton);

  // Agregar el contenido del modal al overlay
  overlay.appendChild(modalContent);

  // Agregar el overlay al body
  document.body.appendChild(overlay);

  // Disable scrolling
  document.body.style.overflow = 'hidden';
}

</script>

<template>
  <div class="todo_account">
    <div class="account_container">
      <div class="titulo_account">
        <div class="cerrar_account">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="cerrar_mi_cuenta">
            <path
              d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
            </path>
          </svg>
        </div>
      </div>
      <div class="contenido_publicar">
        <div class="div_imagen">
          <div class="prev_imagen" @click="triggerFileInput" ref="fondo_imagen">
            <img id="imagen" ref="imagenPreview" src="" />
          </div>
          <div class="botones_imagen">
            <div class="contenedor_boton contendor_boton1">
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
            <div class="contenedor_boton contendor_boton2">
              <div class="div_input_imagen div_quitar_imagen">
                <div class="input_file input_file_eliminar"></div>
                <div class="anadir quitar">
                  <div class="boton_quitar_imagen">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="quitar_imagen"
                      @click="quitar_imagen">
                      <path
                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="editar_datos">
        <div class="fila1">
          <div class="fila_izquierda">
            <!-- <input type="text" id="fecha_nacimiento" class="input" required autocomplete="off"
              v-model="fecha_nacimiento" ref="fecha_nacimientoInput">
            <label class="label" for="fecha_nacimiento">Fecha de nacimiento</label> -->
          </div>
          <div class="fila_derecha">

          </div>
        </div>
        <div class="fila2">
          <div class="fila_izquierda">

          </div>
          <div class="fila_derecha">

          </div>
        </div>
        <div class="fila3">
          <div class="fila_izquierda">

          </div>
          <div class="fila_derecha">

          </div>
        </div>
        <div class="fila4">
          <div class="fila_izquierda">

          </div>
          <div class="fila_derecha">

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
.todo_account {
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

.account_container {
  width: 90%;
  margin-top: 80px;
  height: 520px;
  background-color: var(--dark-blue);
  max-width: 1326px;
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

.titulo_account {
  display: flex;
  justify-content: end;
  align-items: center;
  width: 98%;
  margin-top: 10px;
  height: 35px;
}

.cerrar_account {
  cursor: pointer;
  display: none;
}

.cerrar_account svg path {
  fill: var(--light-blue-text);
  stroke: var(--dark-blue);
  stroke-width: 2.5px;
}

.contenido_publicar {
  display: flex;
  flex-direction: column;
  height: calc(100% - 82px);
  width: 100%;
}

.div_imagen {
  width: 100%;
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
  border-radius: 50%;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
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

.botones_imagen {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
}

.div_input_imagen {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  height: 74px;
  padding-right: 10px;
}

.contenedor_boton {
  width: fit-content;
  display: flex;
  justify-content: end;
}

.div_quitar_imagen {
  padding-left: 10px;
  padding-right: 0;
}

.contendor_boton2 {
  justify-content: start;
  width: 100px;
  margin-left: 30px;
}

#div_boton_quitar_imagen button {
  width: 200px;
}

.quitar {
  padding-top: 3.5px;
}

svg.quitar_imagen {
  width: 30px !important;
  /* background-color: var(--light-blue-text); */
  height: 30px !important;
  cursor: pointer !important;
}

.div_quitar_imagen svg path {
  fill: var(--light-blue-text);
  stroke: var(--light-blue-text);
  stroke-width: 1.5px;
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

.input_file_eliminar {
  width: 40px;
}

.anadir {
  height: 37px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -18.5px;
  /* pointer-events: none; */
  cursor: pointer;
}

.anadir.quitar {
  pointer-events: auto;
}

.anadir_texto {
  width: 28%;
  min-width: 275px;
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

.boton_quitar_imagen {
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
  /* pointer-events: none; */
}

.boton_quitar_imagen{
  pointer-events: none;

}

.anadir_texto button:hover,
.anadir_texto button:active {
  border: 2px solid #eef2fa81;
}

.contenido {
  margin-bottom: 25px;
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

  .account_container {
    height: 500px;
  }

  .container {
    margin-bottom: 42px;
  }

  .container .label {
    font-size: 22px;
  }

  #tematica {
    height: 40px;
  }
}

@media(max-width: 1040px) {
  .account_container {
    width: 89%;
  }

  .div_imagen {
    min-width: 367px;
  }

  .div_contenido {
    min-width: 430px;
  }

  .account_container {
    min-width: 794px;
  }
}

@media(max-width: 875px) {
  .todo_account {
    margin-top: -6px;
    padding: 0;
    background-color: var(--dark-blue);
  }

  .cerrar_account {
    margin-right: 4px;
  }

  .account_container {
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

  .contenido {
    margin-top: 55px;
  }

  .quitar {
    padding-top: 1px;
  }

  svg.quitar_imagen {
    width: 28px !important;
    height: 28px !important;
  }

  .titulo_account {
    z-index: 400;
    position: fixed;
  }

  .cerrar_account {
    display: flex;
  }
}

@media(max-width: 600px) {
  .div_imagen {
    padding-top: 10px;
  }

  .prev_imagen {
    height: 350px;
    width: 350px;
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

  .contendor_boton1 {
    margin-right: 20px;
    width: 240px;
  }
}

@media(max-width: 440px) {

  .div_contenido {
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

  .aviso {
    transform: translateY(-120px);
  }

  .contendor_boton1 {
    width: 230px;
  }
}

@media(max-width: 380px) {

  .todo_account,
  .account_container {
    height: 920px;
  }

  .div_contenido {
    min-width: 0;
  }

  .prev_imagen {
    height: 250px;
    width: 250px;
  }

  .div_imagen {
    min-width: 0;
  }

  .publicar {
    margin-bottom: 5px;
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

  .contendor_boton1 {
    margin-right: 10px;
    width: 230px;
  }

  .quitar {
    padding-top: 2px;
  }

  svg.quitar_imagen {
    width: 26px !important;
    height: 26px !important;
  }
}

@media(max-width: 300px) {

  .todo_account,
  .account_container {
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

<!-- <script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import { supabase, logOut, userState } from "../clients/supabase";

const nombre = ref("");
const edad = ref("");
const peso = ref("");
const localidad = ref("");
const apellidos = ref("");
const sexo = ref("");
const altura = ref("");
const gym = ref("");
const gymtag = ref("");
const mostrarMensaje = ref(false);
const mensajeError = ref("");

const nombreRegex = /^[a-zñáéíóú\s]{3,14}$/i;
const apellidosRegex = /^[a-zñáéíóú\s-]{4,24}$/i;
const gymtagRegex = /^[a-z0-9ñ._]{3,14}$/i;
const localidadRegex = /^[a-zñáéíóú\s]{3,14}$/i;

const validarNombre = () => {
  if (!nombreRegex.test(nombre.value)) {
    mensajeError.value = "El nombre debe contener entre 3 y 14 letras.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarApellidos = () => {
  if (!apellidosRegex.test(apellidos.value)) {
    mensajeError.value = "Los apellidos deben contener entre 4 y 24 letras.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarLocalidad = () => {
  if (!localidadRegex.test(localidad.value)) {
    mensajeError.value = "La localidad debe contener entre 3 y 14 letras.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarGym = () => {
  if (!nombreRegex.test(gym.value)) {
    mensajeError.value = "El Gym debe contener entre 3 y 14 letras.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarGymtag = () => {
  const gymtagMin = gymtag.value.toLowerCase();
  gymtag.value = gymtagMin;

  if (gymtagMin.length >= 3 && gymtagMin.length <= 14) {
    if (!gymtagRegex.test(gymtagMin)) {
      mensajeError.value =
        "Tu GymTag solo puede tener letras, números y algunos caracteres especiales.";
      mostrarMensaje.value = true;
      gymtag.value = "";
      return true;
    }
  } else {
    mensajeError.value = "Tu GymTag debe tener entre 3 y 14 caracteres.";
    mostrarMensaje.value = true;
    gymtag.value = "";
    return true;
  }

  // Verificar si GymTag está disponible
  return false;
};

const validarEdad = () => {
  if (!edad.value) {
    mensajeError.value = "Por favor, ingrese su fecha de nacimiento.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarPeso = () => {
  const pesoNum = parseFloat(peso.value);
  if (isNaN(pesoNum) || pesoNum <= 0) {
    mensajeError.value = "Por favor, ingrese un peso válido.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarSexo = () => {
  if (!sexo.value) {
    mensajeError.value = "Por favor, ingrese su sexo.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validarAltura = () => {
  const alturaNum = parseFloat(altura.value);
  if (isNaN(alturaNum) || alturaNum <= 0) {
    mensajeError.value = "Por favor, ingrese una altura válida.";
    mostrarMensaje.value = true;
    return true;
  }
  return false;
};

const validateForm = (event) => {
  event.preventDefault();
  
  if (
    !nombre.value ||
    !edad.value ||
    !peso.value ||
    !localidad.value ||
    !apellidos.value ||
    !sexo.value ||
    !altura.value ||
    !gym.value
  ) {
    mensajeError.value = "Por favor, complete todos los campos del formulario.";
    mostrarMensaje.value = true;
    return false;
  }

  if (
    validarNombre() ||
    validarApellidos() ||
    validarGymtag() ||
    validarGym() ||
    validarLocalidad() ||
    validarEdad() ||
    validarPeso() ||
    validarSexo() ||
    validarAltura()
  ) {
    return false;
  }

  mostrarMensaje.value = false;
  mensajeError.value = "";
  return true;
};

const urlFoto = ref("../assets/img/logo.png");
console.log(urlFoto);
</script>

<template>
  <div class="container">
    <div class="container_formulario">
      <div class="img_perfil">
        <div class="image-container"></div>
        <img src="../assets/img/logo.png" alt="img-perfil" class="imgPerfil" />
        <img
          src="../assets/icons/imgUpload.png"
          alt="upload IMG"
          class="img-icon"
        />
        <br />
        <input type="file" />
        <br />
        <label for="gymtag"></label>
        <input
          v-model="gymtag"
          name="gymtag"
          type="text"
          class="gym_tag inputs"
          placeholder="GymTag..."
        />
      </div>
      <form
        action="Profile.vue"
        method="POST"
        class="fuera-formulario"
        novalidate
        @submit.prevent="validateForm"
      >
      <div class="formulario">
        <div class="column">
          <label for="nombre">Nombre:</label>
          <input
            v-model="nombre"
            class="inputs"
            type="text"
            name="nombre"
            placeholder="Nombre"
            autocomplete="off"
          />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
          <label for="edad">Fecha de Nacimiento:</label>
          <input v-model="edad" type="date" class="inputs" name="edad" autocomplete="off" />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
          <label for="peso">Peso:</label>
          <input
            v-model="peso"
            type="number"
            class="inputs"
            name="peso"
            placeholder="Escriba su peso"
            autocomplete="off"
          />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
          <label for="localidad">Localidad:</label>
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
          <label for="apellidos">Apellidos:</label>
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
          <label for="sexo">Sexo:</label>
          <input
            v-model="sexo"
            type="text"
            class="inputs"
            name="sexo"
            placeholder="Escriba su sexo"
            autocomplete="off"
          />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
          <label for="altura">Altura:</label>
          <input
            v-model="altura"
            type="text"
            class="inputs"
            name="altura"
            placeholder="Escriba su altura"
            autocomplete="off"
          />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
          <label for="gym">Gym:</label>
          <input
            v-model="gym"
            type="text"
            class="inputs"
            name="gym"
            placeholder="¿Dónde entrenas?"
            autocomplete="off"
          />
          <div class="container_lapiz">
            <img src="../assets/icons/pen.png" alt="Lapiz" class="lapiz" />
          </div>
        </div>
      </div>
        <button type="submit" class="actualizar">
          Actualizar
        </button>
      </form>
      <div v-if="mostrarMensaje" class="mensaje-error-container">
          <div class="mensaje-error">{{ mensajeError }}</div>
      </div>
    </div>
    <button class="cerrar-sesion" v-if="!userActive">
      <RouterLink to="/" @click="logOut"><i>Cerrar Sesión</i></RouterLink>
    </button>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 120px;
}

.img_perfil {
  text-align: center;
}

.imgPerfil {
  width: 35%;
  cursor: pointer;
}

.img-container {
  display: flex;
  align-items: center;
}

.img-icon {
  margin-bottom: 14%;
  width: 25px;
  height: auto;
  cursor: pointer;
}

.container_formulario {
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 15px auto 30px;
  padding: 20px 30px;
  background-color: var(--dark-blue);
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
  width: 75vw;
  height: fit-content;
  max-width: 1050px;
  display: flex;
  flex-direction: column;
}

.fuera-formulario{
  display: flex;
  flex-direction: column;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 55px;
  flex-direction: column;
  color: aliceblue;
  text-align: center;
  align-items: center;
  font-size: 20px;
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

input, .gym_tag {
  background-color: var(--blue);
  color: rgba(240, 248, 255, 0.705);
}

.inputs{
  height: 30px;
  width: 220px;
}

input::placeholder, .gym_tag::placeholder {
  color: rgba(240, 248, 255, 0.596);
}

input[type="file"] {
  margin: 4%;
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
  width: 17px;
  height: auto;
  cursor: pointer;
  position: relative;
  top: -21px;
  right: 20px;
}

.column {
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

.mensaje-error-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mensaje-error {
  color: aliceblue;
}

button {
  color: aliceblue;
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

.cerrar-sesion,
.actualizar {
  font-weight: 600;
  color: aliceblue;
  padding: 1.25em 2em;
  background: var(--blue);
  border: 2px solid var(--alt-black);
  border-radius: 0.75em;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: background 150ms,
    -webkit-transform 150ms;
  transition: transform 150ms,
    background 150ms,
    -webkit-transform 150ms;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2%;
  display: block;
}

.cerrar-sesion::before,
.actualizar::before {
  color: aliceblue;
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
  box-shadow: none;
  -webkit-transform: translate3d(0, 0.75em, -1em);
  transform: translate3d(0, 0.75em, -1em);
  transition: transform 150ms,
    box-shadow 150ms,
    -webkit-transform 150ms,
    -webkit-box-shadow 150ms;
}

.cerrar-sesion:hover,
.actualizar:hover {
  color: black;
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

.cerrar-sesion:hover::before,
.actualizar:hover::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: none;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

.cerrar-sesion:active,
.actualizar:active {
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

.cerrar-sesion:active::before,
.actualizar:active::before {
  -webkit-box-shadow: 0 0 0 2px grey, 0 0 rgb(95, 88, 88);
  box-shadow: none;
  -webkit-transform: translate3d(0, 0, -1em);
  transform: translate3d(0, 0, -1em);
}
button a {
  color: white;
}
button:hover a {
  color: black;
}

.cerrar-sesion {
  margin-bottom: 2%;
  box-shadow: none;
}

.actualizar, .mensaje-error-container{
  display:flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .container_formulario {
    margin-bottom: 2%;
  }

  .img-icon {
    width: 25px;
  }

  input{
    width: 320px;
    margin: 2%;
  }

  .formulario {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .img-icon {
    width: 25px;
  }

  input[type="file"] {
    margin: 5vw;
    width: 60vw;
  }

  .formulario {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-right: 5%;
  }

  .inputs {
    width: 55vw;
    margin-right: 5%;
  }

  .gym_tag{
    margin: 2.5%;
  }

  .lapiz {
    height: auto;
    cursor: pointer;
    position: relative;
    top: -25px;
  }
}

@media (max-width: 375px) {
  .formulario {
    margin-right: 5%;
  }
}
</style> -->
