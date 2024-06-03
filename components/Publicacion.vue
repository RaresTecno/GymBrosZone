<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { supabase, userId } from "@/clients/supabase";
import fotoPredeterminada from "../assets/img/foto-predeterminada.avif"

const perfilPropio = ref();
const siguiendo = ref();
const fotoPerfil = ref();

const gymTag = ref();
const foto = ref('');

const likes = ref({});
const guardados = ref({});

const animatingLike = ref(false);
const animatingLike2 = ref({});
const animatingSave = ref({});
const likeAnimationStyle = ref({ top: '50%', left: '50%' });
const numeroLikes = ref();

const likeText = computed(() => {
  return numeroLikes.value === 1 ? ' Like' : ' Likes';
});

const deshabilitado = computed(() => comentarioTexto.value.length === 0);
const comentarioTexto = ref('');
const comentarioInput = ref(null);
const comentarios = ref([]);

const mostrarFinal = ref(false);

const isCover = ref(true);
const esCover = ref(true);

const windowWidth = ref(window.innerWidth);

const props = defineProps({
  publicacionUnica: {
    type: Object,
    required: true,
  },
  ProfileView: {
    type: Boolean,
    default: false
  },
  fotoTuPerfilMostrar: {
    type: String,
    required: false
  }
});

const isProfile = ref(props.ProfileView);
const tematica = ref(props.publicacionUnica.tematica);
const descripcion = ref(props.publicacionUnica.contenido);

const ruta = ref("https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + props.publicacionUnica.ruta);
const fotoPerfilMostrada = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');
const fotoPerfilComentarioMostrada = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

cargarPublicacion();

if (props.publicacionUnica.resolucion == "cover") {
  isCover.value = true;
  esCover.value = true;
} else {
  esCover.value = false;
  if (windowWidth < 1100) {
    isCover.value = false;
  }
}

/*Función para seguir a un usuario.*/
async function seguir() {
  /*Se sigue al usuario, de manera visual.*/
  siguiendo.value = true;
  /*Comprobamos si el usuario sigue al usuario que quiere seguir.*/
  const { data: seguidores, errorSeguidores } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguidor', userId.value)
    .eq('idseguido', props.publicacionUnica.idusuario);
  /*En caso de error no se sigue al usuario, se vuelve al estado anterior visualmente.*/
  if (errorSeguidores) {
    siguiendo.value = false;
    return;
  }
  /*Se guarda en la tabla seguidores si no existe la relación.*/
  if (seguidores.length == 0) {
    const { error: insertError } = await supabase
      .from('seguidores')
      .insert([{ idseguidor: userId.value, idseguido: props.publicacionUnica.idusuario }]);
    /*En caso de error no se sigue al usuario, se vuelve al estado anterior visualmente.*/
    if (insertError) {
      siguiendo.value = false;
      return;
    }
  } else {
    siguiendo.value = true;
  }
}

/*Función para dejar de seguir a un usuario.*/
async function dejarSeguir() {
  /*Se deja de seguir al usuario, de manera visual.*/
  siguiendo.value = false;
  /*Hacemos la consulta para eliminarle de seguidor.*/
  const { error: deleteError } = await supabase
    .from('seguidores')
    .delete()
    .eq('idseguidor', userId.value)
    .eq('idseguido', props.publicacionUnica.idusuario);
  /*En caso de error no deja de seguir al usuario, se vuelve al estado anterior visualmente.*/
  if (deleteError) {
    siguiendo.value = true;
    return;
  }
}

function handleDoubleClick(event) {
  const rect = event.target.getBoundingClientRect();
  likeAnimationStyle.value = {
    top: `${event.clientY - rect.top}px`,
    left: `${event.clientX - rect.left}px`,
  };

  if (!animatingLike.value) {
    animatingLike.value = true;
    setTimeout(() => {
      animatingLike.value = false;
    }, 600); // Duración de la animación
  }
  darLike();
}







async function obtenerComentarios(idpublicacion) {
  // const { data: comentariosData, error } = await supabase
  //   .from('comentarios')
  //   .select('*')
  //   .eq('idpublicacion', idpublicacion);
  //   // .order('fechacreacion', { ascending: true });

  const { data: comentariosData, error } = await supabase
    .from('comentarios')
    .select('*, usuarios(gymtag)')
    .eq('idpublicacion', idpublicacion)
    .order('fechacreacion', { ascending: false });

  if (error) {
    console.error('Error al obtener los comentarios:', error);
    return;
  }

  // Mapear sobre los datos de los comentarios para obtener la foto de perfil de cada usuario
  const comentariosConFotoPerfil = await Promise.all(comentariosData.map(async comentario => {
    // Realizar una consulta adicional para obtener la foto de perfil del usuario
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('fotoperfil')
      .eq('id', comentario.idusuario);

    // Manejar cualquier error que ocurra durante la consulta de la foto de perfil
    if (usuarioError) {
      console.error('Error al obtener la foto de perfil del usuario:', usuarioError);
      fotoPerfilComentarioMostrada.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg';
    } else {
      // Asignar la URL completa de la foto de perfil si está disponible, de lo contrario asignar la foto predeterminada
      if (usuarioData[0].fotoperfil === '/predeterminada.png' || usuarioData[0].fotoperfil === null || usuarioData[0].fotoperfil === '') {
        fotoPerfilComentarioMostrada.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg';
      } else {
        fotoPerfilComentarioMostrada.value = `https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/${usuarioData[0].fotoperfil}`;
      }
    }
    return comentario;
  }));

  // Actualizar el estado de comentarios con los datos obtenidos
  comentarios.value = comentariosConFotoPerfil;
}

async function darLike() {
  const idpublicacion = props.publicacionUnica.idpublicacion;

  if (likes.value[props.publicacionUnica.idpublicacion]) {
    return;
  }
  animatingLike2.value[props.publicacionUnica.idpublicacion] = true;
  setTimeout(() => animatingLike2.value[props.publicacionUnica.idpublicacion] = false, 600);

  likes.value[idpublicacion] = true;
  numeroLikes.value++;
  const { data, errorLike } = await supabase
    .from('likes')
    .select('*')
    .eq('idusuario', userId.value)
    .eq('idpublicacion', idpublicacion);

  if (errorLike) {
    likes.value[idpublicacion] = false;
    numeroLikes.value--;
    return;
  }

  if (data.length == 0) {
    const { error: insertError } = await supabase
      .from('likes')
      .insert([{ idusuario: userId.value, idpublicacion: idpublicacion }]);

    if (insertError) {
      likes.value[idpublicacion] = false;
      numeroLikes.value--;
      return;
    }
  } else {
    likes.value[idpublicacion] = true;
  }
}

/*Función para quitar like a la publicación.*/
async function quitarLike() {
  const idpublicacion = props.publicacionUnica.idpublicacion;
  /*Se quita el like de la publicación, de manera visual.*/
  likes.value[idpublicacion] = !likes.value[idpublicacion];
  numeroLikes.value--;
  /*Hacemos la consulta para quitar el like.*/
  const { error: quitarLikeError } = await supabase
    .from('likes')
    .delete()
    .eq('idusuario', userId.value)
    .eq('idpublicacion', idpublicacion);
  /*En caso de error no se quita el like a la publicación, se vuelve al estado anterior visualmente.*/
  if (quitarLikeError) {
    numeroLikes.value++;
    likes.value[idpublicacion] = !likes.value[idpublicacion];
    return;
  }
}

/*Función para guardar a una publicación.*/
async function guardar() {
  // const idpublicacion = props.publicacionUnica.idpublicacion;
  // /*Se guarda la publicación, de manera visual.*/
  // guardados.value[idpublicacion] = !guardados.value[idpublicacion];
  // /*Comprobamos si el usuario ha guardado la publicación anteriormente.*/
  const idpublicacion = props.publicacionUnica.idpublicacion;
  if (guardados.value[idpublicacion]) return;
  animatingSave.value[idpublicacion] = true;
  setTimeout(() => animatingSave.value[idpublicacion] = false, 400);

  guardados.value[idpublicacion] = true;
  const { data, errorGuardado } = await supabase
    .from('guardados')
    .select('*')
    .eq('idusuario', userId.value)
    .eq('idpublicacion', idpublicacion);
  /*En caso de error no se guarda la publicación, se vuelve al estado anterior visualmente.*/
  if (errorGuardado) {
    guardados.value[idpublicacion] = !guardados.value[idpublicacion];
    return;
  }
  /*Se guarda en la tabla guardados si no se había guardado antes.*/
  if (data.length == 0) {
    const { error: insertError } = await supabase
      .from('guardados')
      .insert([{ idusuario: userId.value, idpublicacion: idpublicacion }]);
    /*En caso de error no se guarda la publicación, se vuelve al estado anterior visualmente.*/
    if (insertError) {
      guardados.value[idpublicacion] = !guardados.value[idpublicacion];
      return;
    }
  } else {
    guardados.value[idpublicacion] = true;
  }
}

/*Función para quitar el guardado de la publicación.*/
async function eliminarGuardado() {
  const idpublicacion = props.publicacionUnica.idpublicacion;
  /*Se quita el guardado de la publicación, de manera visual.*/
  guardados.value[idpublicacion] = !guardados.value[idpublicacion];
  /*Hacemos la consulta para quitar el guardado.*/
  const { error: quitarGuardadoError } = await supabase
    .from('guardados')
    .delete()
    .eq('idusuario', userId.value)
    .eq('idpublicacion', idpublicacion);
  /*En caso de error no se quita el guardado a la publicación, se vuelve al estado anterior visualmente.*/
  if (quitarGuardadoError) {
    guardados.value[idpublicacion] = !guardados.value[idpublicacion];
    return;
  }
}

function combrobarImagen() {
  ruta.value = fotoPredeterminada;
}

async function cargarPublicacion() {
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select("*")
    .eq('id', props.publicacionUnica.idusuario);
  if (errorUsuario) {
    return;
  }
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
      return;
    }

    siguiendo.value = seguidores.length !== 0;
  }

  const { data: likeData, error: errorLike } = await supabase
    .from('likes')
    .select('*')
    .eq('idusuario', userId.value)
    .eq('idpublicacion', props.publicacionUnica.idpublicacion);

  if (errorLike) {
    return;
  }

  likes.value[props.publicacionUnica.idpublicacion] = likeData.length !== 0;

  const { data: guardadoData, error: errorGuardado } = await supabase
    .from('guardados')
    .select('*')
    .eq('idusuario', userId.value)
    .eq('idpublicacion', props.publicacionUnica.idpublicacion);

  if (errorGuardado) {
    return;
  }
  guardados.value[props.publicacionUnica.idpublicacion] = guardadoData.length !== 0;

  await obtenerCantidadLikes(props.publicacionUnica.idpublicacion);
}

async function obtenerCantidadLikes(idpublicacion) {
  const { count, error } = await supabase
    .from('likes')
    .select('idpublicacion', { count: 'exact', head: true })
    .eq('idpublicacion', idpublicacion);

  if (error) {
    return;
  }

  numeroLikes.value = count;
}

function updateWidth() {
  windowWidth.value = window.innerWidth;
  foto.value.style.cursor = 'pointer';
}

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

async function mostrar(bool) {
  if ((!bool && windowWidth.value > 875) || (bool && windowWidth.value <= 875)) {
    document.body.style.overflow = "hidden";
    mostrarFinal.value = true;
    await obtenerComentarios(props.publicacionUnica.idpublicacion);
  }
};

function cerrar() {
  document.body.style.overflow = "visible";
  mostrarFinal.value = false;
};

function quitarOverflow() {
  document.body.style.overflow = "visible";
}

function enfocarInput() {
  comentarioInput.value.focus();
}

function actualizarComentario(event) {
  comentarioTexto.value = event.target.value;
}

async function publicar() {
  if (!deshabilitado.value) {
    const { error } = await supabase
      .from('comentarios')
      .insert([{
        idpublicacion: props.publicacionUnica.idpublicacion,
        idusuario: userId.value,
        comentario: comentarioTexto.value
      }]);

    if (error) {
      console.error("Error al publicar el comentario:", error);
      return;
    }
    comentarioTexto.value = '';
    comentarioInput.value.value = '';
  }
  await obtenerComentarios(props.publicacionUnica.idpublicacion);
}


onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
<template>
  <div class="publicacion" id="forzar-publicacion">
    <div class="header-publicacion" v-if="(windowWidth <= 875 && !isProfile)">
      <!-- <div class="header-publicacion-izq">
        <RouterLink v-if="gymTag" :to="{ name: 'profile', params: { gymtag: gymTag } }" class="RouterLink">
          
          <img :src="fotoPerfilMostrada" alt="">
          <h2 class="gymtag">@{{ gymTag }}</h2>
        </RouterLink>
      </div>
      <div class="header-publicacion-der">
        <font-awesome-icon class="icon" :icon="['fas', 'ellipsis-vertical']" />
      </div> -->
      <div class="encabezado encabezado_p">
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
      </div>
    </div>
    <div @click="mostrar(false)" class="inicial" id="forzar-inicial">
      <img :src="ruta" @error="combrobarImagen" :class="isCover ? 'cover' : 'normal'" ref="foto"
        @dblclick="handleDoubleClick" />
      <font-awesome-icon v-if="animatingLike" :icon="['fas', 'heart']" class="like-animation"
        :style="likeAnimationStyle" />
      <!-- <img :src="ruta" @error="combrobarImagen" :class="true ? 'cover' : 'normal'" /> -->
    </div>
    <div class="footer-publicacion" v-if="(windowWidth <= 875 && !isProfile)">
      <div class="todo_botones_publicacion_grande todo_botones_publicacion_p">
        <div class="botones_publicacion_grande">
          <div class="megusta" v-if="!likes[props.publicacionUnica.idpublicacion]" @click="darLike()">
            <font-awesome-icon :icon="['far', 'heart']" class="heart" />
          </div>
          <div class="megusta" v-if="likes[props.publicacionUnica.idpublicacion]" @click="quitarLike">
            <font-awesome-icon :icon="['fas', 'heart']" class="heart rojo"
              :class="{ 'like-animation2': animatingLike2[props.publicacionUnica.idpublicacion] }" />
          </div>
          <div class="guardar" v-if="!guardados[props.publicacionUnica.idpublicacion]" @click="guardar">
            <font-awesome-icon :icon="['far', 'bookmark']" class="save"
              :class="{ 'save-animation': animatingSave[props.publicacionUnica.idpublicacion] }" />
          </div>
          <div class="guardar" v-if="guardados[props.publicacionUnica.idpublicacion]" @click="eliminarGuardado">
            <font-awesome-icon :icon="['fas', 'bookmark']" class="save"
              :class="{ 'save-animation': animatingSave[props.publicacionUnica.idpublicacion] }" />
          </div>
          <div class="comentar" @click="mostrar(true)" @click.stop>
            <font-awesome-icon :icon="['far', 'comment']" class="comment" />
          </div>
        </div>
      </div>
      <!-- <h2 class="tematica">{{ tematica }}</h2> -->
    </div>
    <div class="final" v-if="mostrarFinal" @click="cerrar">
      <div class="contenido" @click.stop>
        <div class="imagen">
          <img :src="ruta" class="cover" @dblclick="handleDoubleClick" />
          <font-awesome-icon v-if="animatingLike" :icon="['fas', 'heart']" class="like-animation"
            :style="likeAnimationStyle" />
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
              <button v-if="!siguiendo && perfilPropio == false" @click="seguir">Seguir</button>
              <button v-if="siguiendo && perfilPropio == false" @click="dejarSeguir">Siguiendo</button>
            </div>
          </div>
          <div class="contenedor_tematica">
            <div class="tematica">{{ tematica }}</div>
          </div>
          <div class="contenedor_descripcion">
            <div class="descripcion">{{ descripcion }}</div>
          </div>


          <div class="comentarios">
            <div v-for="comentario in comentarios" :key="comentario.id" class="comentario">
              <div class="comentario-header">
                <!-- <img :src="fotoTuPerfilMostrar" class="comentario-foto" /> -->
                <img :src="fotoPerfilComentarioMostrada" class="comentario-foto" />
                <!-- <span class="comentario-usuario">{{ comentario.idusuario }}</span> -->
                <span class="comentario-usuario">@{{ comentario.usuarios.gymtag }}</span>

              </div>
              <div class="comentario-contenido">
                {{ comentario.comentario }}
              </div>
              <div class="comentario-fecha">
                {{ new Date(comentario.fechacreacion).toLocaleString() }}
              </div>
            </div>
          </div>


          <div class="todo_botones_publicacion_grande">
            <div class="borde"></div>
            <div class="botones_publicacion_grande">
              <div class="megusta_comentario">
                <div class="megusta" v-if="!likes[props.publicacionUnica.idpublicacion]" @click="darLike()">
                  <font-awesome-icon :icon="['far', 'heart']" class="heart" />
                </div>
                <div class="megusta" v-if="likes[props.publicacionUnica.idpublicacion]" @click="quitarLike">
                  <font-awesome-icon :icon="['fas', 'heart']" class="heart rojo"
                    :class="{ 'like-animation2': animatingLike2[props.publicacionUnica.idpublicacion] }" />
                </div>
                <div class="comentar" @click="enfocarInput">
                  <font-awesome-icon :icon="['far', 'comment']" class="comment" />
                </div>
              </div>
              <div class="guardar" v-if="!guardados[props.publicacionUnica.idpublicacion]" @click="guardar">
                <font-awesome-icon :icon="['far', 'bookmark']" class="save"
                  :class="{ 'save-animation': animatingSave[props.publicacionUnica.idpublicacion] }" />
              </div>
              <div class="guardar" v-if="guardados[props.publicacionUnica.idpublicacion]" @click="eliminarGuardado">
                <font-awesome-icon :icon="['fas', 'bookmark']" class="save"
                  :class="{ 'save-animation': animatingSave[props.publicacionUnica.idpublicacion] }" />
              </div>
            </div>
            <div class="numero_likes">
              {{ numeroLikes }} {{ likeText }}
            </div>
          </div>
          <div class="borde borde2"></div>
          <div class="div_comentar">
            <div class="anadir">
              <div class="foto_anadir">
                <img :src="props.fotoTuPerfilMostrar" />
              </div>
              <div class="input_anadir">
                <textarea class="input" ref="comentarioInput" required autocomplete="off"
                  placeholder="Añade un comentario..." maxlength="100" @input="actualizarComentario"></textarea>
              </div>
            </div>
            <div class="publicar">
              <div class="publicar_div">
                <button @click="publicar"
                  :class="deshabilitado ? 'boton_deshabilitado' : 'publicar_boton'">Publicar</button>
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
}

.encabezado_p {
  padding: 7px 0 7px 3px;
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

.contenedor_tematica {
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











.comentarios {
  margin-top: 20px;
  height: 300px;
  overflow-y: auto;
  /* Habilitar el scroll vertical */
  overflow-x: hidden;
  border: 1px solid #ebebebd3;
  /* Opcional: para visualizar mejor el contenedor */
  margin: 10px;

}

.comentarios::-webkit-scrollbar {
  width: 8px;
}

.comentarios::-webkit-scrollbar-track {
  background: var(--dark-blue);
  background: #b8c1d346;
  border-left: var(--light-blue-text) solid 1px;
}

.comentarios::-webkit-scrollbar-thumb {
  /* border-radius: 20px; */
  background-color: var(--light-blue-text);

}

.comentario {
  border-bottom: 1px solid #cccccc4d;
  padding: 10px 5px;
}

.comentario-header {
  display: flex;
  align-items: center;
  color: var(--light-blue-text);
  /* background-color: red; */
  width: fit-content;
  padding: 0 5px;
  cursor: pointer;
}

.comentario-header:hover, .comentario-header:active{

}

.comentario-foto {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  margin-left: 5px;
  border: 1px solid black;
  transition: border 0.3s;
}

.foto_encabezado img {
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.comentario-header .comentario-foto:hover,
.comentario-header .comentario-foto:active{
  border: 1px solid rgb(109, 109, 109);
}

.comentario-usuario {
  font-weight: bold;
}

.comentario-contenido {
  margin: 10px 0;
  color: var(--light-blue-text);
  word-wrap: break-word; 
  overflow-wrap: break-word; 
  white-space: pre-wrap; 
  margin-left: 12px;
  margin-right: 12px;
}

.comentario-fecha {
  font-size: 13px;
  margin-left: 12px;
  color: #999;
  margin-top: 5px;
  /* text-align: end; */
}

.comentario:last-child {
  border: none;
}

.comentario:first-child {
  /* padding-top: 0; */
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
  cursor: pointer;
}

.cuerpo {
  position: relative;
  background: var(--dark-blue);
  width: 500px;
}

.publicar_div {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  justify-content: end;
}

.publicar_boton {
  cursor: pointer;
  background-color: var(--blue-buttons);
  /* width: 50px; */
  border: solid var(--black) 2px;
  border-radius: 2px;
  font-size: 18px;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
  height: 42px;
  padding: 0 10px;
  margin-top: 8px;
}

.publicar_boton:hover,
.publicar_boton:active {
  background-color: var(--very-dark-blue);
  color: var(--light-blue-text);
  border: 2px solid var(--grey-buttons-inputs-border);
}

.boton_deshabilitado {
  cursor: not-allowed;
  background-color: #4e6368;
  color: rgba(0, 0, 0, 0.76);
  border: solid rgba(0, 0, 0, 0.76) 2px;
  border-radius: 2px;
  height: 42px;
  font-size: 18px;
  padding: 0 10px;
  margin-top: 8px;
}

.boton_deshabilitado:hover,
.boton_deshabilitado:active {
  background-color: #4e6368;
  color: rgba(0, 0, 0, 0.76);
  border: solid rgba(0, 0, 0, 0.76) 2px;
}

.div_comentar {
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: space-between;
  bottom: 0;
  height: 65px;
  width: 100%;
}

.anadir {
  display: flex;
  align-items: center;
}

.input_anadir {
  margin-left: 20px;
}

.input_anadir .input {
  height: 42px;
  border: none;
  outline: none;
  padding: 0 4px;
  border-radius: 2px;
  color: var(--light-blue-text);
  font-size: 16px;
  background-color: var(--blue-inputs);
  border: 2px solid transparent;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
  cursor: pointer;
  width: 290px;
  resize: none;
  overflow-y: auto;
  margin-top: 12px;
  word-spacing: -4px;
}

.input_anadir .input:focus {
  border: 2px solid var(--grey-buttons-inputs-border);
  color: var(--light-blue-text);
}

.input_anadir .input::placeholder {
  color: var(--light-blue-text);
}


.foto_anadir {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border-right: var(--black) 1px solid;
  margin-left: 20px;
  margin-top: 7px;
}

.foto_anadir img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.todo_botones_publicacion_grande {
  display: flex;
  flex-direction: column;
}

.borde {
  width: 100%;
  background-color: #eef2fa;
  height: 1px;
  transform: scaleY(0.4);
  transform-origin: top;
  position: absolute;
  bottom: 130px;
}

.borde2 {
  bottom: 58px;
  z-index: 100;
}

.botones_publicacion_grande {
  display: flex;
  align-items: bottom;
  position: absolute;
  justify-content: space-between;
  bottom: 81px;
  padding-top: 5px;
  height: 50px;
  width: 100%;
  /* background-color: grey; */
  z-index: 100;
  overflow: visible;
}

.numero_likes {
  position: absolute;
  bottom: 62px;
  height: 21px;
  width: 100%;
  /* background-color: lightcoral; */
  padding-left: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  color: var(--light-blue-text);
  font-size: 17px;
}

.megusta_comentario {
  display: flex;
}

.megusta_comentario div {
  width: 55px;
}

.megusta {
  margin-left: 0px !important;
}

.comentar,
.megusta,
.guardar {
  height: 45px;
}

.todo_botones_publicacion_p .botones_publicacion_grande {
  position: static;
}

.botones_publicacion_grande * {
  font-size: 35px;
  margin: 0 10px;
}

.guardar {
  margin-right: 15px;
  margin-top: 3px;
}

.heart,
.save,
.comment {
  color: var(--light-blue-text);
  cursor: pointer;
}

.heart,
.comment {
  font-size: 40px;
}

.heart.rojo {
  color: rgb(235, 4, 4);
}

@keyframes likeBounce {
  0% {
    transform: scale(1);
    color: rgb(238, 70, 70);
  }

  50% {
    transform: scale(1.5);
    color: rgb(235, 4, 4);
  }

  70% {
    transform: scale(1.2);
    color: rgb(235, 4, 4);
  }

  100% {
    transform: scale(1);
    color: rgb(238, 70, 70);
  }
}


.like-animation2 {
  animation: likeBounce 0.6s ease-in-out;
}

.image-container {
  position: relative;
}

.like-animation {
  position: absolute;
  font-size: 100px;
  color: rgba(255, 0, 0, 0.75);
  animation: like-animation 0.6s forwards;
  transform: translate(-50%, -50%);
}

@keyframes like-animation {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }

  50% {
    transform: translate(-50%, -80%) scale(1.2);
    opacity: 0.9;
  }

  100% {
    transform: translate(-50%, -190%) scale(0.8);
    opacity: 0;
  }
}

.heart {
  color: var(--light-blue-text);
  cursor: pointer;
  transition: transform 0.2s;
}

.heart:hover {
  transform: scale(1.1);
}

@keyframes saveGlow {
  0% {
    transform: scale(1);
    color: rgb(171, 153, 16);
  }

  50% {
    transform: scale(1.2);
    color: rgb(230, 196, 28);
  }

  100% {
    transform: scale(1);
    color: rgb(171, 153, 16);
  }
}

.save-animation {
  animation: saveGlow 0.4s ease-in-out;
}

.save {
  transition: transform 0.2s;
  cursor: pointer;
}

.save:hover {
  transform: scale(1.1);
}

::placeholder {
  padding-top: 2px;
  padding-left: 2px;
  font-size: 14px;
  word-spacing: -2px;
}

::-moz-placeholder {
  padding-left: 2px;
  padding-top: 2px;
  font-size: 14px;
  word-spacing: -2px;
}

:-ms-input-placeholder {
  padding-left: 2px;
  padding-top: 2px;
  font-size: 14px;
  word-spacing: -2px;
}

::-ms-input-placeholder {
  padding-left: 2px;
  padding-top: 2px;
  font-size: 14px;
  word-spacing: -2px;
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

  .input_anadir .input {
    width: 210px;
  }

  .foto_anadir {
    margin-left: 10px;
  }

  .input_anadir {
    margin-left: 12px;
  }
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

  .input_anadir .input {
    width: 200px;
  }

  .publicar button {
    transform: translate(8px);
  }
}

@media (max-width: 875px) {
  .publicacion {
    height: fit-content;
    aspect-ratio: 0;
    border: 2px solid black;
    border-radius: 12px;
    margin: 25px 0 25px 0;
    overflow: hidden;
  }

  /*.final {
    display: none;
  }*/

  .imagen {
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