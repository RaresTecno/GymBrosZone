<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "@/clients/supabase";
import fotoPredeterminada from "../assets/img/foto-predeterminada.avif"

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


const ruta = ref("https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + props.publicacionUnica.ruta);
const tematica = ref(props.publicacionUnica.tematica);
const descripcion = ref(props.publicacionUnica.contenido);
const fotoPerfil = ref();
const gymTag = ref();
const isCover = ref(true);

const mostrarFinal = ref(false);
const foto = ref('');
const windowWidth = ref(window.innerWidth);
const isProfile = ref(props.ProfileView);

const combrobarImagen = () => {
  ruta.value = fotoPredeterminada;
}

if (props.publicacionUnica.resolucion == "cover") {
  isCover.value = true;
} else {
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
          <h2 class="gymtag">{{ gymTag }}</h2>
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
          <img :src="ruta" />
        </div>
        <div class="cuerpo">
          <div class="cerrar"><font-awesome-icon :icon="['fas', 'xmark']" @click="cerrar" /></div>
          <div class="encabezado"></div>
          <div class="descripcion">a</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  /* border-radius: 0px 0px 7px 7px; */
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
  /* background-color: grey; */
  display: flex;
  justify-content: end;
}

.fa-xmark {
  cursor: pointer;
  /* background-color: yellow; */
  height: 25px;
  margin: 4px 7px 0 0;
  color: var(--light-blue-text);
}

.imagen {
  background-color: burlywood;
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
}

@media (max-width: 985px) {
  .imagen {
    width: 450px;
    height: 450px;
  }

  .cuerpo {
    width: 350px;
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