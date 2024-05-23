<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";
import { supabase } from "@/clients/supabase";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const gymTag = ref();
const ruta = ref();
const fotoPerfil = ref();
const tematica = ref();
const descripcion = ref();
const isCover = ref(true);

async function cargarPublicacion() {
  try {
    const { data: publicacion, error } = await supabase
      .from('publicaciones')
      .select("*")
      .eq('idpublicacion', props.id);

    const { data: usuario, error2 } = await supabase
      .from('usuarios')
      .select("*")
      .eq('id', publicacion[0].idusuario);

    gymTag.value = usuario[0].gymtag;
    fotoPerfil.value = usuario[0].fotoperfil;
    ruta.value = "https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + publicacion[0].ruta;
    tematica.value = publicacion[0].tematica
    if (publicacion[0].resolucion == "cover") {

      console.log("cover")
      isCover.value = true;
    } else {
      if (windowWidth < 1100) {
        isCover.value = false;

      }
      console.log("no cover")

    }

  } catch (error) {

  }
}
cargarPublicacion()

const mostrarFinal = ref(false);
const windowWidth = ref(window.innerWidth);

function updateWidth() {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener("resize", updateWidth);
});
const mostrar = () => {
  document.body.style.overflow = "hidden";
  mostrarFinal.value = true;
};
const cerrar = () => {
  document.body.style.overflow = "visible";
  mostrarFinal.value = false;
};

const foto = supabase.storage
  .from("archivos-usuarios")
  .getPublicUrl("imagen.jpg");

// :style="{ backgroundImage: 'url(' + ruta + ')' }"

</script>
<template>
  <div id="publicacion">
    <div class="header-publicacion" v-if="(windowWidth < 1100)">
      <div class="header-publicacion-izq">
        <img :src="fotoPerfil" alt="">
        <h2 class="gymtag">{{ gymTag }}</h2>
      </div>
      <div class="header-publicacion-der">
        <font-awesome-icon class="icon" :icon="['fas', 'ellipsis-vertical']" />
      </div>
    </div>
    <div @click="mostrar" id="inicial">
      <img :src="ruta" :class="isCover ? 'cover' : 'normal'" />
    </div>
    <div class="footer-publicacion" v-if="(windowWidth < 1100)">
      <h2 class="tematica">{{ tematica }}</h2>
    </div>
    <div id="final" v-if="mostrarFinal">
      <div id="contenido">
        <div @click="cerrar" id="cerrar"><font-awesome-icon :icon="['fas', 'xmark']" /></div>
        <div id="imagen">
          <img :src="ruta" />
        </div>
        <div id="cuerpo">
          <div id="encabezado"></div>

          <div id="descripcion">a</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#publicacion {
  background-color: var(--dark-blue);
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

#inicial {
  display: flex;
  background: rgb(255, 7, 7);
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

#final {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(96, 96, 96, 0.507);
  z-index: 200;
}

#contenido {
  background-color: rgb(255, 255, 255);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}

#cerrar {
  position: absolute;
  top: 5px;
  left: 5px;
}

#imagen {
  background-color: burlywood;
  width: 500px;
  height: 500px;
}

#imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#cuerpo {
  background: rgb(248, 59, 59);
  width: 400px;
}

@media (max-width: 1100px) {
  #publicacion {
    height: fit-content;
    aspect-ratio: 0;
    border: 2px solid black;
    border-radius: 12px;
    margin: 5px;
    overflow: hidden;
  }

  #inicial {
    height: fit-content;
  }

}

@media (max-width: 625px) {
  #publicacion {
    border-radius: 0;
    margin: 2px;

  }
}
</style>
