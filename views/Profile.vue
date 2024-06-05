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
  const nombre = usuario[0].nombre !== null ? usuario[0].nombre : "";
  const apellido = usuario[0].apellidos !== null ? usuario[0].apellidos : "";
  nombreCompleto.value = nombre + " " + apellido
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
  const { data: seguidores, errorSeguidores } = await supabase
    .from('seguidores')
    .select('*')
    .eq('idseguidor', userId.value)
    .eq('idseguido', profileId.value);

  if (seguidores.length == 0) {
    const { error: insertError } = await supabase
      .from('seguidores')
      .insert([{ idseguidor: userId.value, idseguido: profileId.value }]);
    siguiendo.value = true

    mostrarp()
  }

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
  prueba()
}

const maxLines = 5;
const maxCharsPerLine = 40;
const maxTotalChars = 200;

function checkInput() {
  let lines = sobreMi.value.split('\n');

  // Limita el número de líneas
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  // Limita los caracteres por línea
  // lines = lines.map(line => {
  //   if (line.length > maxCharsPerLine) {
  //     return line.slice(0, maxCharsPerLine);
  //   }
  //   return line;
  // });

  // Concatenar las líneas y limitar el total de caracteres
  const text = lines.join('\n');
  if (text.length > maxTotalChars) {
    sobreMi.value = text.slice(0, maxTotalChars);
  } else {
    sobreMi.value = text;
  }
}

const { edad, sexo, peso, altura, actividad, objetivo } = {
  edad: ref(19),
  sexo: ref("hombre"),
  peso: ref(84),
  altura: ref(180),
  actividad: ref("sedentario"),
  objetivo: ref("bajar")
};

const resultado = ref({
  mantenimiento: null,
  superavit: [],
  deficit: []
});

function calcularCalorias() {
  let tmb;

  if (sexo.value === 'hombre') {
    tmb = 10 * peso.value + 6.25 * altura.value - 5 * edad.value + 5;
  } else {
    tmb = 10 * peso.value + 6.25 * altura.value - 5 * edad.value - 161;
  }

  let factorActividad;
  switch (actividad.value) {
    case 'sedentario':
      factorActividad = 1.2;
      break;
    case 'ligero':
      factorActividad = 1.375;
      break;
    case 'moderado':
      factorActividad = 1.55;
      break;
    case 'intenso':
      factorActividad = 1.725;
      break;
    case 'muy_intenso':
      factorActividad = 1.9;
      break;
  }

  let caloriasMantenimiento = tmb * factorActividad;
  resultado.value.mantenimiento = Math.round(caloriasMantenimiento);

  if (objetivo.value === 'aumentar') {
    resultado.value.superavit = [
      { nivel: 'Superávit ligero', kcal: Math.round(caloriasMantenimiento * 1.10) },
      { nivel: 'Superávit moderado', kcal: Math.round(caloriasMantenimiento * 1.15) },
      { nivel: 'Superávit agresivo', kcal: Math.round(caloriasMantenimiento * 1.20) },
      { nivel: 'Superávit muy agresivo', kcal: Math.round(caloriasMantenimiento * 1.25) }
    ];
    resultado.value.deficit = [];
  } else if (objetivo.value === 'bajar') {
    resultado.value.deficit = [
    { nivel: 'Déficit ligero', kcal: Math.round(caloriasMantenimiento * 0.90) },
    { nivel: 'Déficit moderado', kcal: Math.round(caloriasMantenimiento * 0.80) },
    { nivel: 'Déficit agresivo', kcal: Math.round(caloriasMantenimiento * 0.70) },
    { nivel: 'Déficit muy agresivo', kcal: Math.round(caloriasMantenimiento * 0.60) }
  ];
    resultado.value.superavit = [];
  } else {
    resultado.value.superavit = [];
    resultado.value.deficit = [];
  }
}
</script>

<template>
  <!-- <button @click="arriba" id="arriba">Volver arriba</button> -->
  <div class="perfil" :class="{ usandoMovil: usandoMovil }">
    <div id="info">
      <div id="info-top">
        <div class="foto">
          <img :src="fotoPerfil" class="imagen" />
        </div>
        <div class="informacion">

          <h2 class="gymTag">@{{ gymTag }}</h2>
          <div class="info-basica">
            <div id="seguidores">
              <h2>Seguidores</h2>
              <h3>{{ numSeguidores }}</h3>
            </div>
            <div id="seguidos">
              <h2>Seguidos</h2>
              <h3>{{ numSeguidos }}</h3>
            </div>
            <div id="publicaciones">
              <h2>Posts</h2>
              <h3>{{ cantidadPublicaciones }}</h3>
            </div>

          </div>
          <button v-if="siguiendo == false && perfilPropio == false" @click="seguir()">Seguir</button>
          <button v-if="siguiendo == true && perfilPropio == false" @click="dejarSeguir()">Dejar de seguir</button>
        </div>
      </div>
      <div class="div-nombre">
        <h2 class="nombre">{{ nombreCompleto }}</h2>
      </div>
      <div id="info-bot">
        <div id="sobre-mi">
          <p>{{ sobreMi }}</p>
          <button class="btn-edit" v-if="perfilPropio == true" @click="editandoPerfil()">Editar
            Descripción<font-awesome-icon :icon="['fas', 'pen']" class="icono-pen" /></button>
        </div>
      </div>
    </div>
    <div id="contenido">
      <div id="botones">
        <button @click="cambiarVista('Publicaciones')"
          :class="{ vistaBoton: vista === 'Publicaciones', vistaNormal: vista !== 'Publicaciones' }">Posts</button>
        <button @click="cambiarVista('Estadisticas')"
          :class="{ vistaBoton: vista === 'Estadisticas', vistaNormal: vista !== 'Estadisticas' }">Estadisticas</button>
      </div>
      <div v-if="vista == 'Publicaciones'" id="publicaciones" class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion">
          <Publicacion :publicacionUnica="publicacion" :ProfileView="true" />
        </template>
      </div>
      <div v-if="vista == 'Estadisticas'" id="estadisticas" class="vista">
        <form calss="formulario-estadisticas">
          <label>Tu Sexo</label>
          <select class="sexo" v-model="sexo" required>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>

          <label>Tu Edad</label>
          <input type="number" class="edad" v-model="edad" min="1" max="150" step="1" required>

          <label>Tu peso (kg)</label>
          <input type="number" class="peso" v-model="peso" min="1" max="300" step="0.01" required>

          <label>Tu altura (cm)</label>
          <input type="number" class="altura" v-model="altura" min="1" max="300" step="1" required>

          <label>¿Cuál es tu nivel de actividad física diaria?</label>
          <select class="actividad" v-model="actividad">
            <option value="sedentario">Sedentario: poco o ningún ejercicio</option>
            <option value="ligero">Ligero: ejercicio ligero o deportes 1-3 días/semana</option>
            <option value="moderado">Moderado: ejercicio moderado o deportes 3-5 días/semana</option>
            <option value="intenso">Intenso: ejercicio intenso o deportes 6-7 días/semana</option>
            <option value="muy_intenso">Muy intenso: ejercicio muy intenso o trabajo físico y ejercicio 2 veces/día
            </option>
          </select>

          <label>¿Cuál es tu objetivo?</label>
          <select class="objetivo" v-model="objetivo">
            <option value="mantener">Mantener el peso actual</option>
            <option value="bajar">Bajar grasa corporal</option>
            <option value="aumentar">Aumentar masa muscular</option>
          </select>

          <button type="button" @click="calcularCalorias()">Calcular</button>
        </form>
        <div v-if="resultado.mantenimiento">
          <h3>Tus calorías para estar en balance energético:</h3>
          <p>{{ resultado.mantenimiento }} kcal/día</p>
        </div>

        <div v-if="resultado.superavit.length">
          <h3>Tus calorías para estar en superávit calórico:</h3>
          <table>
            <tr>
              <th>Nivel</th>
              <th>kcal/día</th>
            </tr>
            <tr v-for="nivel in resultado.superavit" :key="nivel.nivel">
              <td>{{ nivel.nivel }}</td>
              <td>{{ nivel.kcal }}</td>
            </tr>
          </table>
        </div>

        <div v-if="resultado.deficit">
          <h3>Tus calorías para estar en déficit calórico:</h3>
          <table>
            <tr>
              <th>Nivel</th>
              <th>kcal/día</th>
            </tr>
            <tr v-for="nivel in resultado.deficit" :key="nivel.nivel">
              <td>{{ nivel.nivel }}</td>
              <td>{{ nivel.kcal }}</td>
            </tr>
          </table>
        </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  overflow-y: visible;
}

#info {
  padding-top: 80px;
  background-color: var(--dark-blue);
  min-height: fit-content;
  width: 73%;
  color: var(--light-blue-text);
  font-size: clamp(8px, 4vw, 24px)
}

#info-top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  gap: 5%
}

.foto {
  background-color: rgb(0, 0, 0);
  min-width: 150px;
  min-height: 150px;
  width: 20vw;
  height: 20vw;
  max-width: 250px;
  max-height: 250px;
  border: 2px solid black;
  border-radius: 50%;
  /* width: 30%; */
}

.imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

.informacion {}

.div-nombre {
  margin-left: 4%;
}

.nombre {
  font-size: clamp(30px, 4vw, 24px);
  text-align: center;

}

.info-basica {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(9px, 0.8em, 24px);
  font-weight: bold;
  gap: 5%;
}

.info-basica div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 7px;

}

#sobre-mi {
  position: relative;
  margin-right: 10px;
  width: 90%;
  max-width: 500px;
  height: fit-content;
  padding-bottom: 20px;
}

#sobre-mi p {
  margin-top: 10px;
  word-wrap: break-word;
  text-align: left;
  white-space: pre-line;

}

/* .texto-recortado {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
} */

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

.gymTag {
  margin-top: 10px;
  margin-left: -10px;
  font-size: clamp(8px, 1.6em, 40px);

}

#info-bot {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  margin-bottom: 20px;
}

#contenido {
  width: 73%;
}

#botones {
  width: 100%;
}

.vistaNormal {
  width: 50%;
  padding: 10px;
  font-weight: bold;
  color: var(--dark-blue);
  background-color: var(--light-blue-text);
  border: 1px solid black;
}

.vistaBoton {
  width: 50%;
  padding: 10px;
  font-weight: bold;
  color: var(--light-blue-text);
  background-color: var(--blue-inputs);
  border: 1px solid rgb(255, 255, 255);

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

.edit {
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

.edit-sobreMi {
  z-index: 501;
  margin-top: 200px;
  width: 200px;
  background-color: aqua
}

@media (max-width: 875px) {
  .perfil {
    margin: 0;
  }

  #info {
    width: 100%;
    padding-top: 60px;

  }

  #contenido {
    width: 100%;
  }
}

@media (min-width: 875px) and (max-width: 1100px) {
  .foto {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 1100px) {
  #forzar-publicacion {
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

  .nombre {
    font-size: clamp(22px, 4vw, 24px);
    text-align: left;
  }
}

@media (max-width: 625px) {
  .publicacion {
    border-radius: 0;
    margin: 2px;
  }

  #info-top {
    gap: 0px;
  }

  .gymTag {
    margin-left: 7px;
  }

  .info-basica {
    gap: 0px;

  }
}

@media (max-width: 450px) {
  .foto {
    min-width: 100px;
    min-height: 100px;
  }
}

@media(max-width: 350px) {
  .gymTag {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.usandoMovil {
  margin: 0;
}
</style>
