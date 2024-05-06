<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/clients/supabase";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const mostrarFinal = ref(false);
const gymTag = ref("Rares");
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

const ruta = ref("https://s1.elespanol.com/2023/11/30/elandroidelibre/tutoriales/trucos/813679012_238049061_1706x960.jpg");
// :style="{ backgroundImage: 'url(' + ruta + ')' }"
</script>
<template>
  <div id="publicacion">
    <div class="header-publicacion" v-if="(windowWidth < 1100)">
      <div class="header-publicacion-izq">
        <img :src="ruta" alt="">
        <h2 class="gymtag">{{ gymTag }}</h2>
      </div>
      <div class="header-publicacion-der">
        <font-awesome-icon class="icon" :icon="['fas', 'ellipsis-vertical']" />
      </div>
    </div>
    <div @click="mostrar" id="inicial">
      <img :src="ruta" />
    </div>
    <div class="footer-publicacion" v-if="(windowWidth < 1100)">
      <div class="footer-publicacion-izq">
        <img :src="ruta" alt="">
        <h2 class="gymtag">{{ gymTag }}</h2>
      </div>
      <div class="footer-publicacion-der">
        <font-awesome-icon class="icon" :icon="['fas', 'ellipsis-vertical']" />
      </div>
    </div>
    <div id="final" v-if="mostrarFinal">
      <div id="contenido">
        <div @click="cerrar" id="cerrar">X</div>
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
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  max-height: fit-content;
  max-width: 600px;
  border: 2px solid black;
  border-radius: 7px;
  margin: 5px;
}
.header-publicacion{
  background-color: var(--dark-blue);
  height: 10%;
  display: flex;
  align-items: center;
  /* border-radius: 7px 7px 0px 0px; */
}
.header-publicacion-izq{
  display:flex;
  align-items: center;
  width: 90%;
  margin-left: 10px;
}
.header-publicacion-izq img{
  width: 9.6%;
  object-fit: cover;
  aspect-ratio: 1;

  border-radius: 50%;
  border: 2px solid var(--light-blue-text);
}
.header-publicacion-izq .gymtag {
  color: var(--light-blue-text);
  margin-left: 10px;
}
.header-publicacion-der{
  width: 10%;
  display:flex;
  align-items: center;
  justify-content: center;
}
.footer-publicacion{
  background-color: var(--dark-blue);
  height: 10%;
  display: flex;
  align-items: center;
  /* border-radius: 0px 0px 7px 7px; */
}
.footer-publicacion-izq{
  display:flex;
  align-items: center;
  width: 90%;
  margin-left: 10px;
}
.footer-publicacion-izq img{
  width: 9.6%;
  object-fit: cover;
  aspect-ratio: 1;

  border-radius: 50%;
  border: 2px solid var(--light-blue-text);
}
.footer-publicacion-izq .gymtag {
  color: var(--light-blue-text);
  margin-left: 10px;
}
.footer-publicacion-der{
  width: 10%;
  display:flex;
  align-items: center;
  justify-content: center;
}
.icon{
  font-size: 2em;
  color: var(--light-blue-text);
}
#inicial {
  background: rgb(78, 78, 78);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 100%;
  width: 100%;
  /* border: 3px solid black; */
  position: relative;
}
#inicial img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  z-index: 10;
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

}
@media (max-width: 940px) {

}
</style>
