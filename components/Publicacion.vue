<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, onUnmounted } from "vue";
import { supabase, userId } from "@/clients/supabase";
import fotoPredeterminada from "../assets/img/foto-predeterminada.avif"

const perfilPropio = ref();
const siguiendo = ref();
const like = ref(false);
const guardado = ref(false);

const props = defineProps({
  publicacionUnica: {
    type: Object,
    required: true,
  },
  ProfileView: {
    type: Boolean,
    default: false
  }
});

async function seguir() {
  const { data: seguidores, error: errorSeguidores } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguidor', userId.value)
    .eq('idseguido', props.publicacionUnica.idusuario);

  if (seguidores.length == 0) {
    const { data: inserted, error: insertError } = await supabase
      .from('seguidores')
      .insert([{ idseguidor: userId.value, idseguido: props.publicacionUnica.idusuario }]);
    siguiendo.value = true
  }
}

async function dejarSeguir() {
  const { error: deleteError } = await supabase
    .from('seguidores')
    .delete()
    .eq('idseguidor', userId.value)
    .eq('idseguido', props.publicacionUnica.idusuario);
  siguiendo.value = false;
}

const ruta = ref("https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + props.publicacionUnica.ruta);
const tematica = ref(props.publicacionUnica.tematica);
const descripcion = ref(props.publicacionUnica.contenido);
const fotoPerfil = ref();
const gymTag = ref();
const isCover = ref(true);
const esCover = ref(true);

const mostrarFinal = ref(false);
const foto = ref('');
const windowWidth = ref(window.innerWidth);
const isProfile = ref(props.ProfileView);

const fotoPerfilMostrada = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

const combrobarImagen = () => {
  ruta.value = fotoPredeterminada;
}

if (props.publicacionUnica.resolucion == "cover") {
  isCover.value = true;
  esCover.value = true;
} else {
  esCover.value = false;
  if (windowWidth < 1100) {
    isCover.value = false;
  }
}


async function cargarPublicacion() {
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select("*")
    .eq('id', props.publicacionUnica.idusuario);
  if (errorUsuario) {

  } else {
    gymTag.value = usuario[0].gymtag;
    fotoPerfil.value = usuario[0].fotoperfil;
    if (fotoPerfil.value === '/predeterminada.png' || fotoPerfil.value === null || fotoPerfil.value === '') {
      fotoPerfilMostrada.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg';
    } else {
      /*De lo contrario mostramos la foto de perfil actual del usuario.*/
      fotoPerfilMostrada.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/' + fotoPerfil.value;
    }

    if (props.publicacionUnica.idusuario === userId.value) {
      perfilPropio.value = true;
    } else {
      perfilPropio.value = false;
      const { data: seguidores, error: errorSeguidores } = await supabase
        .from('seguidores')
        .select('*')
        .eq('idseguidor', userId.value)
        .eq('idseguido', props.publicacionUnica.idusuario);
      if (errorSeguidores) {

      }

      if (seguidores.length == 0) {
        siguiendo.value = false;
      } else {
        siguiendo.value = true;
      }
    }
  }
}

cargarPublicacion();

function updateWidth() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value <= 875) {
    document.body.style.overflow = "visible";
    mostrarFinal.value = false;
    foto.value.style.cursor = 'default';
  }

  if (windowWidth.value > 875) {
    foto.value.style.cursor = 'pointer';
  }
}

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

function mostrar() {
  if (windowWidth.value > 875) {
    document.body.style.overflow = "hidden";
    mostrarFinal.value = true;
  }
};

function cerrar() {
  document.body.style.overflow = "visible";
  mostrarFinal.value = false;
};

function quitarOverflow() {
  document.body.style.overflow = "visible";
}

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
<template>
  <div class="publicacion" id="forzar-publicacion">
    <div class="header-publicacion" v-if="(windowWidth <= 875 && !isProfile)">
      <div class="header-publicacion-izq">
        <RouterLink v-if="gymTag" :to="{ name: 'profile', params: { gymtag: gymTag } }" class="RouterLink">
          <img :src="fotoPerfil" alt="">
          <h2 class="gymtag">@{{ gymTag }}</h2>
        </RouterLink>
      </div>
      <div class="header-publicacion-der">
        <font-awesome-icon class="icon" :icon="['fas', 'ellipsis-vertical']" />
      </div>
    </div>
    <div @click="mostrar" class="inicial" id="forzar-inicial">
      <img :src="ruta" @error="combrobarImagen" :class="isCover ? 'cover' : 'normal'" ref="foto" />
      <!-- <img :src="ruta" @error="combrobarImagen" :class="true ? 'cover' : 'normal'" /> -->
    </div>
    <div class="footer-publicacion" v-if="(windowWidth <= 875 && !isProfile)">
      <h2 class="tematica">{{ tematica }}</h2>
    </div>
    <div class="final" v-if="mostrarFinal" @click="cerrar">
      <div class="contenido" @click.stop>
        <div class="imagen">
          <img :src="ruta" :class="{ 'custom-image-style': !esCover }" />
        </div>
        <div class="cuerpo">
          <div class="cerrar"><font-awesome-icon :icon="['fas', 'xmark']" @click="cerrar" /></div>
          <div class="encabezado">
            <RouterLink v-if="gymTag" :to="{ name: 'profile', params: { gymtag: gymTag } }" class="RouterLink"
              @click="quitarOverflow">
              <div class="foto_gymtag">
                <div class="foto_encabezado">
                  <img :src="fotoPerfilMostrada" alt="">
                </div>
                <div class="gymtag_encabezado">
                  @{{ gymTag }}
                </div>
              </div>
            </RouterLink>
            <div class="botones_seguir">
              <button v-if="siguiendo == false && perfilPropio == false" @click="seguir()">Seguir</button>
              <button v-if="siguiendo == true && perfilPropio == false" @click="dejarSeguir()">Siguiendo</button>
            </div>
          </div>
          <div class="contenedor_tematica">
            <div class="tematica">{{ tematica }}</div>
          </div>
          <div class="contenedor_descripcion">
            <div class="descripcion">{{ descripcion }}</div>
          </div>
          <div class="todo_botones_publicacion_grande">
            <div class="botones_publicacion_grande">
              <div class="megusta">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                </svg>
              </div>
              <div class="megusta" v-if="like">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
              </div>
              <div class="guardar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
                </svg>
              </div>
              <div class="guardar" v-if="guardado">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                </svg>
              </div>
              <div class="comentar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenido {
  cursor: default;
}

.custom-image-style {
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: fill !important;
  width: auto !important;
  height: auto !important;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
  margin-top: 10px;
}

.foto_gymtag {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  font-size: 26px;
  color: var(--light-blue-text);
  transition: text-shadow 0.3s;
}

.gymtag_encabezado {
  max-width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foto_gymtag:hover,
.foto_gymtag:active {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.575), 0 0 6px rgba(255, 255, 255, 0.301);
}

.foto_encabezado {
  height: 60px;
  width: 60px;
  overflow: hidden;
  margin-right: 10px;
}

.foto_encabezado img {
  border-radius: 50%;
  height: 100%;
  width: 100%;
  border: 1px solid black;
  transition: border 0.3s;
  object-fit: cover;
}

.foto_gymtag:hover img,
.foto_gymtag:active img {
  border: 1px solid rgb(109, 109, 109);
}

.botones_seguir {
  padding-right: 22px;
}

.botones_seguir button {
  font-weight: bold;
  text-decoration: none;
  background-color: #3d5a98;
  color: var(--light-blue-text);
  border: 2px solid var(--black);
  cursor: pointer;
  border-radius: 25px;
  text-align: center;
  transition: border 0.5s;
  padding: 5px 8px;
  width: 84.44px;
}

.botones_seguir button:hover,
.botones_seguir button:active {
  border-color: #eef2fa81;
}

.contenedor_tematica,
.contenedor_descripcion {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  background-color: green;
}

.contenedor_tematica{
  margin-top: 20px;
  margin-bottom: 20px;
}

.tematica {
  width: 450px;
  max-width: 450px;
  background-color: red;
  height: fit-content;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 19px;
  color: var(--light-blue-text);
}

.descripcion {
  width: 450px;
  max-width: 450px;
  background-color: red;
  height: fit-content;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 15px;
  color: var(--light-blue-text);
}

.todo_botones_publicacion_grande{
  display: flex;
}

.botones_publicacion_grande {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60px;
  width: 80%;
  background-color: grey;
}

.botones_publicacion_grande svg {
  height: 40px;
  width: 40px;
  fill: var(--light-blue-text);
  margin: 0 20px;
}

.publicacion {
  background-color: var(--black);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  max-height: fit-content;
  /* max-width: 500px; */
  border: 1px solid black;
  /* overflow-clip-margin: content-box;
  overflow: clip; */
  overflow: hidden;
  cursor: pointer;
  /* cursor: url('../assets/img/corazonp.png'), auto; */
}

.header-publicacion {
  background-color: var(--dark-blue);
  height: 10%;
  display: flex;
  align-items: center;
}

.header-publicacion-izq {
  display: flex;
  align-items: center;
  width: 90%;
  margin-left: 10px;
}

.header-publicacion-izq img {
  margin: 5px 0;
  width: 9%;
  object-fit: cover;
  aspect-ratio: 1;

  border-radius: 50%;
  border: 2px solid var(--light-blue-text);
}

.header-publicacion-izq .gymtag {
  color: var(--light-blue-text);
  margin-left: 10px;
}

.header-publicacion-der {
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-publicacion {
  background-color: var(--dark-blue);
  display: flex;
  align-items: center;
}

.footer-publicacion .tematica {
  color: white;
}

.icon {
  font-size: 2em;
  color: var(--light-blue-text);
}

.inicial {
  display: flex;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 100%;
  width: 100%;
}

.cover {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.normal {
  max-height: 100%;
  max-width: 100%;
}

.final {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(96, 96, 96, 0.507);
  z-index: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contenido {
  display: flex;
  background-color: black;
  border-radius: 4px;
  border: var(--black) 2px solid;
  overflow: hidden;
  position: relative;
}

.cerrar {
  display: flex;
  justify-content: end;
}

.fa-xmark {
  cursor: pointer;
  height: 25px;
  margin: 4px 7px 0 0;
  color: var(--light-blue-text);
}

.imagen {
  background-color: black;
  width: 600px;
  height: 600px;
  border-right: var(--black) 1px solid;
}

.imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cuerpo {
  position: relative;
  background: var(--dark-blue);
  width: 500px;
}

@media (max-width: 1200px) {
  .imagen {
    width: 500px;
    height: 500px;
  }

  .cuerpo {
    width: 400px;
  }

  .foto_gymtag {
    font-size: 24px;
  }

  .foto_gymtag {
    margin-left: 10px;
  }

  .foto_encabezado {
    margin-right: 8px;
  }

  .botones_seguir button {
    font-size: 12px;
    padding: 4px 6px;
  }

  .gymtag_encabezado {
    max-width: 220px;
  }

  .botones_seguir {
    padding-right: 10px;
    padding-left: 5px;

  }

  /* .botones_seguir{
    padding-right: 10px;
  } */
  /* .foto_encabezado {
    height: 50px;
    width: 50px;
  } */
}

@media (max-width: 985px) {
  .imagen {
    width: 450px;
    height: 450px;
  }

  .cuerpo {
    width: 380px;
  }

  .foto_gymtag {
    font-size: 22px;
  }

  .foto_encabezado {
    height: 50px;
    width: 50px;
  }

  .gymtag_encabezado {
    max-width: 210px;
  }
}

@media (max-width: 875px) {
  .publicacion {
    height: fit-content;
    aspect-ratio: 0;
    border: 2px solid black;
    border-radius: 12px;
    margin: 5px;
    overflow: hidden;
  }

  .final {
    display: none;
  }
}

@media (max-width: 625px) {
  .publicacion {
    border-radius: 0;
    margin: 2px;
  }
}
</style>