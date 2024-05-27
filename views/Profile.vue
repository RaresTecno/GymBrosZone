<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, defineProps } from "vue";
import { useRouter } from 'vue-router';
import { usandoMovil, disponible } from "../main";
import Publicacion from "../components/Publicacion.vue";
import editProfile from "../components/EditProfile.vue";
import { supabase, userId } from "../clients/supabase";

const props = defineProps({
  gymtag: {
    type: String
  }
});

const profileId = ref()
const siguiendo = ref()
const perfilPropio = ref()
const editando = ref(false)
const todasPublicaciones = ref()
const cantidadPublicaciones = ref()
const gymTag = ref();
const nombreCompleto = ref();
const sobreMi = ref();
const numSeguidores = ref();
const numSeguidos = ref();
const seguidos = ref();
const fotoPerfil = ref("https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg");

const router = useRouter();

async function mostrarp() {

  const { data: usuario, errorUsuario } = await supabase
    .from('usuarios')
    .select("*")
    .eq('gymtag', props.gymtag);

  if (usuario.length == 0) {
    router.push('/NotFound');
  }
  if (usuario[0].fotoperfil != "/predeterminada.png") {
    fotoPerfil.value = "https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + usuario[0].fotoperfil;

  }
  gymTag.value = usuario[0].gymtag

  nombreCompleto.value = usuario[0].nombre + " " + usuario[0].apellidos
  profileId.value = usuario[0].id;

  const { data: publicaciones, errorPublicaciones } = await supabase
    .from('publicaciones')
    .select('*')
    .eq('idusuario', usuario[0].id);
  todasPublicaciones.value = publicaciones.reverse()
  cantidadPublicaciones.value = publicaciones.length

  if (profileId.value == userId.value) {
    perfilPropio.value = true
  } else {
    perfilPropio.value = false
  }

  const { data: seguidores, errorSeguidores } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguidor', userId.value)
    .eq('idseguido', profileId.value);

  if (seguidores.length == 0) {
    siguiendo.value = false
  } else {
    siguiendo.value = true
  }
  const { data: seguidoresPerfil, errorSeguidoresPerfil } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguido', profileId.value);
  numSeguidores.value = seguidoresPerfil.length
  const { data: seguidosPerfil, errorSeguidosPerfil } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguidor', profileId.value);
  numSeguidos.value = seguidosPerfil.length

}
mostrarp()
disponible.value = true;

function arriba() {
  window.scrollTo(0, 0);
}


const vista = ref(sessionStorage.getItem("vista") || "Publicaciones");
function cambiarVista(tipo) {
  editando.value = false
  vista.value = tipo;
  sessionStorage.setItem("vista", tipo); // Guardar la vista seleccionada en el almacenamiento local
}
onMounted(() => {
  if (!sessionStorage.getItem("vista")) {
    sessionStorage.setItem("vista", "Publicaciones"); // Establecer la vista predeterminada si no hay una vista almacenada
  }
});


async function seguir() {
  const { error: insertError } = await supabase
    .from('seguidores')
    .insert([{ idseguidor: userId.value, idseguido: profileId.value }]);
  siguiendo.value = true
  mostrarp()

}
async function dejarSeguir() {
  const { error: deleteError } = await supabase
    .from('seguidores')
    .delete()
    .eq('idseguidor', userId.value)
    .eq('idseguido', profileId.value);
  siguiendo.value = false
  mostrarp()

}
function editandoPerfil() {
  editando.value = true
  document.body.style.overflow = "hidden";
}
function cerrar() {
  editando.value = false
  document.body.style.overflow = "hidden";
}
// const texto = ref()
function obtenerDatos() {
    console.log(sobreMi.value)
}

const maxLines = 5;
const maxCharsPerLine = 40;

function checkInput() {
  let lines = sobreMi.value.split('\n');

  // Limita el número de líneas
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  // Limita los caracteres por línea
  lines = lines.map(line => {
    if (line.length > maxCharsPerLine) {
      return line.slice(0, maxCharsPerLine);
    }
    return line;
  });

  // Actualiza el valor de sobreMi
  sobreMi.value = lines.join('\n');
}
const mostrarBoton = ref();
const mostrarCompleto = ref(false);

function mostrarMas() {
  mostrarCompleto.value = !mostrarCompleto.value;
}
</script>

<template>
  <!-- <button @click="arriba" id="arriba">Volver arriba</button> -->
  <div class="perfil" :class="{ usandoMovil: usandoMovil }">
    <div id="info">
      <div id="info-top">
        <div id="foto-gymTag">
          <div id="foto">
            <img :src="fotoPerfil" id="imagen" />
          </div>
          <h2 id="gymTag">
            {{ gymTag }}
          </h2>
          <button v-if="siguiendo == false && perfilPropio == false" @click="seguir()">Seguir</button>
          <button v-if="siguiendo == true && perfilPropio == false" @click="dejarSeguir()">Dejar de seguir</button>
        </div>
        <div id="sobre-mi">
          <h2>{{ nombreCompleto }}</h2>
          <p :class="{ 'texto-recortado': !mostrarCompleto }">{{ sobreMi }}</p>
          <button v-if="perfilPropio" @click="mostrarMas">Ver mas...</button>
          <button class="btn-edit" v-if="perfilPropio == true" @click="editandoPerfil()"><font-awesome-icon :icon="['fas', 'pen']"
              class="icono-pen" /></button>
        </div>
      </div>
      <div id="info-bot">
        <div id="seguidores">
          <h2>Seguidores</h2>
          {{ numSeguidores }}
        </div>
        <div id="seguidos">
          <h2>Seguidos</h2>
          {{ numSeguidos }}
        </div>
        <div id="publicaciones">
          <h2>Publicaciones</h2>
          {{ cantidadPublicaciones }}
        </div>
      </div>
    </div>
    <div id="contenido">
      <div id="botones">
        <button @click="cambiarVista('Publicaciones')">Publicaciones</button>
        <button @click="cambiarVista('Estadisticas')">Estadisticas</button>
      </div>
      <div v-if="vista == 'Publicaciones'" id="publicaciones" class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion.idpublicacion">
          <Publicacion :id="publicacion.idpublicacion" :ProfileView="true" />
        </template>
      </div>
      <div v-if="vista == 'Estadisticas'" id="estadisticas" class="vista">
        aaaa
      </div>
    </div>
  </div>
  <div v-if="editando == true" class="edit">
    <div class="edit-sobreMi">
      <div @click="cerrar()" class="cerrar"><font-awesome-icon :icon="['fas', 'xmark']" /></div>
      <div>
        <textarea v-model="sobreMi" @input="checkInput"></textarea>
    <button @click="obtenerDatos">Obtener Datos</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#arriba {
  position: fixed;
  top: 40px;
  right: 20px;
}

.perfil {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  overflow-y: visible;
}

#info {
  background-color: var(--dark-blue);
  min-height: fit-content;
  width: 70%;
  color: white;
}

#info-top {
  display: flex;
  justify-content: center;
  margin: 10px;
}

#foto-gymTag {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  width: 40%;
}

#foto-gymTag button {
  margin-top: 10px;
  padding: 3px;
}

#foto {
  background-color: rgb(0, 0, 0);
  min-width: 50px;
  min-height: 50px;
  width: 20vw;
  height: 20vw;
  max-width: 250px;
  max-height: 250px;
  border: 2px solid black;
  border-radius: 50%;
}

#imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

#sobre-mi {
  position: relative;
  margin-top: 25px;
  width: 60%;
  max-width: 500px;
  height: fit-content;
  padding-bottom: 20px;
}

#sobre-mi p {
  margin-top: 10px;
  margin-bottom: 20px;
  word-wrap: break-word;
  /* Para navegadores antiguos */
  overflow-wrap: break-word;
  /* max-height: calc(1.2em * 7); */
  /* Aproximadamente 7 líneas */
  overflow: hidden;
  white-space: pre-line;
}
.texto-recortado {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* Número de líneas a mostrar antes de recortar */
  -webkit-box-orient: vertical;
}
#sobre-mi .btn-edit {
  position: absolute;
  right: 0;
  margin: 0;
  background-color: transparent;
  border: 0;
  color: white;
}

#sobre-mi .btn-edit .icono-pen {
  width: 20px;
  height: 20px;
}

#gymTag {
  margin-top: 10px;
}

#info-bot {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  margin-bottom: 20px;
}

#contenido {
  width: 70%;
}

#botones {
  width: 100%;
  position: sticky;
}

#botones button {
  width: 50%;
  padding: 10px;
}

.vista {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  /* Centra el contenido horizontalmente */
  justify-content: center;
  /* Centra el contenido verticalmente */
}

.vista #publicacion {
  padding: 0;
}
.edit{
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(174, 174, 174, 0.294);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-sobreMi{
  z-index: 501;
  margin-top: 200px;
  width: 200px;
  background-color: aqua
}
@media (max-width: 875px) {
  .perfil {
    margin: 60px 0 0 0;
  }

  #info {
    width: 100%;
  }

  #contenido {
    width: 100%;
  }
}

@media (max-width: 1100px) {
  #forzar-publicacion {
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
    border-radius: 0;
    margin-top: 0;
    /* overflow-clip-margin: content-box;
  overflow: clip; */
  }

  #forzar-inicial {
    display: flex;
    /* background: rgb(255, 7, 7); */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    /* height: 100%; */
    width: 100%;
  }

}

@media (max-width: 625px) {
  .publicacion {
    border-radius: 0;
    margin: 2px;

  }
}

.usandoMovil {
  margin: 0;
}
</style>
