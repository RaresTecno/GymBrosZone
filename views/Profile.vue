<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, onUnmounted, defineProps, watch } from "vue";
import { useRouter } from 'vue-router';
import { usandoMovil, disponible } from "../main";
import Publicacion from "../components/Publicacion.vue";
import editProfile from "../components/EditProfile.vue";
import { supabase, userId, userActive } from "../clients/supabase";

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
const esPrivado = ref(true)
const router = useRouter();
const edad = ref()

watch(() => props.gymtag, (newGymtag, oldGymtag) => {
  if (newGymtag !== oldGymtag) {
    mostrarp();
  }
});

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
  edad.value = calcularEdad(usuario[0].fechanacimiento);

  cargarEstadisticas();


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
const fotoTuPerfilMostrar = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

async function obtenerTuFotoPerfil() {
  if (userActive.value == true) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select("*")
      .eq('id', userId.value);
    fotoTuPerfilMostrar.value = usuario[0].fotoperfil;
    if (fotoTuPerfilMostrar.value === '/predeterminada.png' || fotoTuPerfilMostrar.value === null || fotoTuPerfilMostrar.value === '') {
      fotoTuPerfilMostrar.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg';
    } else {
      /*De lo contrario mostramos la foto de perfil actual del usuario.*/
      fotoTuPerfilMostrar.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/' + fotoTuPerfilMostrar.value;
    }
  }
}
obtenerTuFotoPerfil();

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
  window.addEventListener('ocultar-publicacion', (event) => {
    ocultarPublicacion(event.detail.idPublicacion);
  });
});

onUnmounted(() => {
  window.removeEventListener('ocultar-publicacion', (event) => {
    ocultarPublicacion(event.detail.idPublicacion);
  });
});

function ocultarPublicacion(idPublicacion) {
  const publicacionElement = document.querySelector(`[data-publicacion-id="${idPublicacion}"]`);
  if (publicacionElement) {
    publicacionElement.style.display = 'none';
  }
}

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
    siguiendo.value = true;

    mostrarp();
  }
}

async function dejarSeguir() {
  const { error: deleteError } = await supabase
    .from('seguidores')
    .delete()
    .eq('idseguidor', userId.value)
    .eq('idseguido', profileId.value);
  siguiendo.value = false;
  mostrarp();
}

function editandoPerfil() {
  editando.value = true
  document.body.style.overflow = "hidden";
}

function cerrar() {
  editando.value = false
  document.body.style.overflow = "hidden";
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

const mensajeAviso = ref(false);
const mostrarAviso = ref();
function mensaje(mensaje) {
  mensajeAviso.value = mensaje;
  mostrarAviso.value = true;
}
const { sexo, peso, altura, actividad, resActividad, resIMC, nivelIMC, pesoValido, alturaValida } = {
  sexo: ref(),
  peso: ref(),
  altura: ref(),
  actividad: ref(),
  resActividad: ref(),
  resIMC: ref(),
  nivelIMC: ref(),
  pesoValido: ref(),
  alturaValida: ref()
};

const validarPeso = () => {
  const pesoValue = parseFloat(peso.value);

  if (!isNaN(pesoValue) && pesoValue >= 30 && pesoValue <= 650 && (pesoValue * 100) % 1 === 0) {
    pesoValido.value = true; // Valor válido
    calcularIMC()
    calcularCalorias()
    mostrarAviso.value = false;

  } else {
    pesoValido.value = false;
    mensaje('Por favor, ingrese un valor válido para el peso entre 30 y 650 kg (max 2 decimales).'); // Valor no válido
  }
};
const validarAltura = () => {
  const alturaValue = parseFloat(altura.value);

  if (!isNaN(alturaValue) && alturaValue >= 30 && alturaValue <= 650 && (alturaValue * 100) % 1 === 0) {
    alturaValida.value = true; // Valor válido
    calcularIMC()
    calcularCalorias()
    mostrarAviso.value = false;

  } else {
    alturaValida.value = false;
    mensaje('Por favor, ingrese un valor válido para la altura entre 30 y 300 cm.'); // Valor no válido
  }
};
const resultado = ref({
  mantenimiento: null,
  superavit: [],
  deficit: []
});

async function cargarEstadisticas() {
  const { data: estadisticas, errorEstadisticas } = await supabase
    .from('estadisticas')
    .select('*')
    .eq('idusuario', profileId.value);

  esPrivado.value = estadisticas[0].esprivado;
  peso.value = estadisticas[0].pesokg;
  altura.value = estadisticas[0].alturacm;
  sexo.value = estadisticas[0].sexo;
  actividad.value = estadisticas[0].actividad;

  calcularIMC()
  calcularCalorias()
}
function calcularIMC() {
  let alturaMetros = altura.value / 100;
  resIMC.value = parseFloat(peso.value) / (alturaMetros * alturaMetros);

  if (resIMC.value < 16) {
    nivelIMC.value = 'Delgadez severa';
  } else if (resIMC.value >= 16 && resIMC.value < 17) {
    nivelIMC.value = 'Delgadez moderada';
  } else if (resIMC.value >= 17 && resIMC.value < 18.5) {
    nivelIMC.value = 'Delgadez aceptable';
  } else if (resIMC.value >= 18.5 && resIMC.value < 25) {
    nivelIMC.value = 'Peso normal';
  } else if (resIMC.value >= 25 && resIMC.value < 30) {
    nivelIMC.value = 'Sobrepeso';
  } else if (resIMC.value >= 30 && resIMC.value < 35) {
    nivelIMC.value = 'Obesidad clase I';
  } else if (resIMC.value >= 35 && resIMC.value < 40) {
    nivelIMC.value = 'Obesidad clase II';
  } else if (resIMC.value >= 40) {
    nivelIMC.value = 'Obesidad clase III';
  }
}
function calcularCalorias() {
  if (alturaValida.value && pesoValido.value) {

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
        resActividad.value = "Poco o ningún ejercicio"
        break;
      case 'ligero':
        factorActividad = 1.375;
        resActividad.value = "Ejercicio ligero o deportes 1-3 días/semana"
        break;
      case 'moderado':
        resActividad.value = "Ejercicio moderado o deportes 3-5 días/semana"
        factorActividad = 1.55;
        break;
      case 'intenso':
        factorActividad = 1.725;
        resActividad.value = "Ejercicio intenso o deportes 6-7 días/semana"
        break;
      case 'muy_intenso':
        factorActividad = 1.9;
        resActividad.value = "Ejercicio muy intenso o trabajo físico y ejercicio 2 veces/día"
        break;
    }

    let caloriasMantenimiento = tmb * factorActividad;
    resultado.value.mantenimiento = Math.round(caloriasMantenimiento);

    resultado.value.superavit = [
      { nivel: 'Superávit ligero', kcal: Math.round(caloriasMantenimiento * 1.10) },
      { nivel: 'Superávit moderado', kcal: Math.round(caloriasMantenimiento * 1.15) },
      { nivel: 'Superávit agresivo', kcal: Math.round(caloriasMantenimiento * 1.20) },
      { nivel: 'Superávit muy agresivo', kcal: Math.round(caloriasMantenimiento * 1.25) }
    ];

    resultado.value.deficit = [
      { nivel: 'Déficit ligero', kcal: Math.round(caloriasMantenimiento * 0.90) },
      { nivel: 'Déficit moderado', kcal: Math.round(caloriasMantenimiento * 0.80) },
      { nivel: 'Déficit agresivo', kcal: Math.round(caloriasMantenimiento * 0.70) },
      { nivel: 'Déficit muy agresivo', kcal: Math.round(caloriasMantenimiento * 0.60) }
    ];
  }

}
async function cambiarPrivacidad(valor) {
  try {
    // Actualiza el estado de privacidad en el cliente
    esPrivado.value = valor;

    // Realiza la actualización en la base de datos de Supabase
    const { data, error } = await supabase
      .from('estadisticas')
      .update({ esprivado: esPrivado.value })
      .eq('idusuario', userId.value);

    if (error) {
      console.error('Error al cambiar la privacidad:', error.message);
      // Maneja el error de acuerdo a tu lógica de aplicación
    } else {
      console.log('Se cambió la privacidad exitosamente:', data);
      // Maneja la respuesta exitosa de la actualización, si es necesario
    }
  } catch (error) {
    console.error('Error al cambiar la privacidad:', error.message);
    // Maneja el error de acuerdo a tu lógica de aplicación
  }
}
function calcularEdad(fechaNacimiento) {
  // Convertir la cadena de fecha de nacimiento a un objeto Date
  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();

  // Calcular la diferencia en años
  let edad = hoy.getFullYear() - fechaNac.getFullYear();

  // Ajustar la edad si el cumpleaños de este año no ha sido aún
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = fechaNac.getMonth();
  const diaNacimiento = fechaNac.getDate();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    edad--;
  }

  return edad;
}
const mostrarForm = ref(false)
function mostrarEditarStats(valor) {
  mostrarForm.value = valor
}
async function guardarEstadisticas() {
  let consulta = {};

  const { data: estadisticas, errorEstadisticas } = await supabase
    .from('estadisticas')
    .select('*')
    .eq('idusuario', userId.value);

  if ((peso.value == estadisticas[0].pesokg) && (altura.value == estadisticas[0].alturacm) && (sexo.value == estadisticas[0].sexo) && (actividad.value == estadisticas[0].actividad)) {

    mensaje('Debes modificar algún dato para guardar cambios');
    return
  }

  if ((peso.value !== null && peso.value !== '') && (altura.value !== null && altura.value !== '') &&
    (sexo.value !== null && sexo.value !== '') && (actividad.value !== null && actividad.value !== '')) {

    if (peso.value != estadisticas[0].pesokg && pesoValido.value) {
      consulta.pesokg = peso.value;
    }
    if (altura.value != estadisticas[0].alturacm && alturaValida.value) {
      consulta.alturacm = altura.value;
    }
    if (sexo.value != estadisticas[0].sexo) {
      consulta.sexo = sexo.value;
    }
    if (actividad.value != estadisticas[0].actividad) {
      consulta.actividad = actividad.value;
    }
  } else {
    mensaje('No puede haber campos vacíos');
    return
  }

  /*Actualizamos la información del usuario.*/
  if (Object.keys(consulta).length > 0) {
    const { data, error } = await supabase
      .from('estadisticas')
      .update(consulta)
      .eq('idusuario', userId.value)
    if (error) {
      mensaje('Ha ocurrido un error al actualizar tu información.');
    } else {

      mensaje('Tu información ha sido actualizada.');
      cargarEstadisticas();
    }
  }
}
watch([sexo, actividad], [calcularCalorias, calcularIMC]);
watch(peso, validarPeso);
watch(altura, validarAltura);
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
          <div :data-publicacion-id="publicacion.idpublicacion">
            <Publicacion :publicacionUnica="publicacion" :ProfileView="true"
              :fotoTuPerfilMostrar="fotoTuPerfilMostrar" />
          </div>
        </template>
      </div>
      <div v-if="(vista == 'Estadisticas') && (!esPrivado || perfilPropio)" class="estadisticas">
        <div v-if="perfilPropio" class="privacidad">
          <div class="estadisticas-priv" v-if="esPrivado">
            Tus estadísticas son PRIVADAS
            <font-awesome-icon class="candado" @click="cambiarPrivacidad(false)" :icon="['fas', 'lock']" />
          </div>
          <div class="estadisticas-priv" v-if="!esPrivado">
            Tus estadísticas son PÚBLICAS
            <font-awesome-icon class="candado" @click="cambiarPrivacidad(true)" :icon="['fas', 'unlock']" />
          </div>
        </div>
        <button v-if="perfilPropio" @click="mostrarEditarStats(true)" class="btn-editar-stats">Editar
          estadísticas</button>
        <form v-if="perfilPropio && mostrarForm" class="formulario-estadisticas">
          <font-awesome-icon :icon="['fas', 'xmark']" @click="mostrarEditarStats(false)" class="cerrarForm" />
          <div class="edad-sexo">

            <div class="tu-edad datos-stats">

              <label>Tu actividad diaria</label>
              <select class="actividad" v-model="actividad" required>
                <option value="sedentario">Sedentario: poco o ningún ejercicio</option>
                <option value="ligero">Ligero: ejercicio ligero o deportes 1-3 días/semana</option>
                <option value="moderado">Moderado: ejercicio moderado o deportes 3-5 días/semana</option>
                <option value="intenso">Intenso: ejercicio intenso o deportes 6-7 días/semana</option>
                <option value="muy_intenso">Muy intenso: ejercicio muy intenso o trabajo físico y ejercicio 2 veces/día
                </option>
              </select>
              <!-- <input type="number" class="edad" v-model="edad" min="1" max="150" step="1" required> -->
            </div>
            <div class="tu-sexo datos-stats">
              <label>Tu Sexo</label>
              <select class="sexo" v-model="sexo" required>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
          </div>
          <div class="peso-altura">
            <div class="tu-peso datos-stats">
              <label>Tu peso (kg)</label>
              <input type="number" class="peso" v-model="peso" min="30" max="650" step="0.01" required>

            </div>
            <div class="tu-altura datos-stats">
              <label>Tu altura (cm)</label>
              <input type="number" class="altura" v-model="altura" min="30" max="300" step="1" required>
            </div>

          </div>

          <!-- <button type="button" @click="calcularCalorias()">Calcular</button> -->
          <button type="button" @click="guardarEstadisticas()" class="btn-guardar-stats">Guardar</button>
          <div v-if="mostrarAviso" class="mensaje">{{ mensajeAviso }}</div>
        </form>
        <div v-if="sexo && peso && altura && actividad" class="datos-estadisticas">
          <h2>Estadísticas</h2>
          <div class="res-edad-sexo">
            <h3>Edad: {{ edad }} años</h3>
            <h3>Sexo: {{ sexo }}</h3>
          </div>
          <div class="res-altura-peso">
            <h3>Altura: {{ alturaValida !== false ? altura + " cm" : "Valor inválido" }}</h3>
            <h3>Peso: {{ pesoValido !== false ? peso + " kg" : "Valor inválido" }}</h3>
          </div>
          <div class="res-actividad">
            <h3>Ejercicio: {{ resActividad }}</h3>
          </div>
        </div>
        <div v-if="resultado.mantenimiento != null" class="resultados-cal">
          <div class="mant" v-if="resultado.mantenimiento">
            <h3>Calorías para estar en balance energético</h3>
            <p>{{ resultado.mantenimiento }} kcal/día</p>
          </div>
          <div class="def-sup">
            <div class="sup" v-if="resultado.superavit.length > 0">
              <h3>Calorías para estar en superávit calórico</h3>
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

            <div v-if="resultado.deficit.length > 0">
              <h3>Calorías para estar en déficit calórico</h3>
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
        <div class="resultado-imc">
          <div class="res-imc">
            <h3>IMC: {{ resIMC.toFixed(2) + " (" + nivelIMC+ ")"  }}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Clasificación</th>
                <th>IMC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Delgadez severa</td>
                <td>Menos de 16</td>
              </tr>
              <tr>
                <td>Delgadez moderada</td>
                <td>16 - 16.9</td>
              </tr>
              <tr>
                <td>Delgadez aceptable</td>
                <td>17 - 18.4</td>
              </tr>
              <tr>
                <td>Peso normal</td>
                <td>18.5 - 24.9</td>
              </tr>
              <tr>
                <td>Sobrepeso</td>
                <td>25 - 29.9</td>
              </tr>
              <tr>
                <td>Obesidad clase I</td>
                <td>30 - 34.9</td>
              </tr>
              <tr>
                <td>Obesidad clase II</td>
                <td>35 - 39.9</td>
              </tr>
              <tr>
                <td>Obesidad clase III</td>
                <td>40 o más</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="(esPrivado && !perfilPropio) && (vista == 'Estadisticas')" class="perfilPrivado">
        <font-awesome-icon class="candado2" :icon="['fas', 'lock']" />
        Las estadísticas este usuario son privadas
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
  margin: 20px 0;
  /* width: 100%; */
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

.informacion {
  margin-top: 10px;
  width: fit-content;
}

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
  font-size: clamp(9px, 0.9em, 24px);
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

#publicacion {
  padding: 0;
}

.estadisticas {
  display: flex;
  flex-direction: column;
}

.privacidad {
  align-self: flex-end;
  display: flex;
  align-items: center;
  margin: 15px;
}

.estadisticas-priv {
  display: flex;
  align-items: center;
  text-decoration: underline;
  text-align: end
}

.candado {
  padding: 5px;
}

.candado:hover {
  cursor: pointer;
}

.formulario-estadisticas {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background-color: var(--dark-blue);
  color: var(--light-blue-text);
}

.cerrarForm {
  position: absolute;
  top: 10px;
  right: 10px;
}

.cerrarForm:hover {
  cursor: pointer;
}

.btn-editar-stats {
  width: 20%;
  min-width: 150px;
  margin: auto;
  padding: 5px;
  font-weight: bold;
  color: var(--light-blue-text);
  background-color: var(--dark-blue);
  border: 2px solid black;
  margin-bottom: 10px;
}

.btn-editar-stats:hover {
  cursor: pointer;
}

.edad-sexo {
  display: flex;
  justify-content: space-around;
}

.datos-stats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  margin-bottom: 10px;
}

/* .datos-stats label{
  width: 100%;
} */
.datos-stats * {
  white-space: nowrap;
  width: 50%;

}

.datos-stats input,
.datos-stats h4,
.datos-stats select {
  margin-top: 5px;
  padding: 5px;
  min-width: 95px;
  border: 2px solid var(--dark-blue);
}

.datos-stats label {
  min-width: 95px;

}



.peso-altura {
  display: flex;
  justify-content: center;
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

.btn-guardar-stats {
  margin: auto;
  margin-top: 10px;
  cursor: pointer;
  background-color: var(--blue-buttons);
  width: 27%;
  min-width: fit-content;
  padding: 5px;
  border: solid var(--black) 2px;
  border-radius: 2px;
  font-size: 18px;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
  height: 100%;
}

.btn-guardar-stats:hover,
.btn-guardar-stats:active {
  background-color: var(--very-dark-blue);
  color: var(--light-blue-text);
  border: 2px solid var(--grey-buttons-inputs-border);
}

.mensaje {
  text-align: center;
  margin-top: 10px;
}

.datos-estadisticas {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
  border: 3px solid black;
  background-color: #5983df82;

}

.datos-estadisticas h2 {
  width: 100%;
  text-align: center;
  border-bottom: 3px solid black;
  padding: 10px;
}

.res-edad-sexo {
  display: flex;
  width: 100%;
  border-bottom: 2px solid black;

}

.res-edad-sexo :first-child {
  border-right: 2px solid black;
}

.res-edad-sexo * {
  width: 50%;
  padding: 10px;

}

.res-altura-peso {
  display: flex;
  width: 100%;
  border-bottom: 2px solid black;
}

.res-altura-peso :first-child {
  border-right: 2px solid black;
}

.res-altura-peso * {
  width: 50%;
  padding: 10px;
}

.res-actividad {
  padding: 10px;
}

.resultados-cal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
  border: 3px solid black;
  background-color: #5983df82;
}

.mant {
  width: 100%;
  text-align: center;
  border-bottom: 2px solid black;
}

.def-sup {
  display: flex;
  width: 100%;

}

.sup {
  border-right: 2px solid black;

}

.def-sup>div {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.resultados-cal h3 {
  padding: 10px;
  width: 100%;
  border-bottom: 2px solid black;

}

.def-sup h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 65px;

}

.resultados-cal table,
.resultados-cal p {
  padding: 10px;
}

.resultado-imc {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
  border: 3px solid black;
  background-color: #5983df82;
  margin-bottom: 70px;
}

.res-imc {
  text-align: center;
  width: 100%;
  padding: 10px;
  border-bottom: 3px solid black;
}

.resultado-imc table {
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  border: 2px solid black;
}

.resultado-imc table tbody {
  width: 100%;
}

.resultado-imc table thead {
  width: 100%;
}

.resultado-imc table tr {
  width: 100%;
  display: flex;
  /* border: 2px solid black; */
}

.resultado-imc table thead tr th {
  height: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
  width: 50%;
}

.resultado-imc table tr td {
  height: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.perfilPrivado{
  margin: 30px 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: clamp(20px, 2.2vw, 60px);
  gap: 20px;
}
.candado2{
  width: 20%;
  height: 20%;
  min-width: 100px;
  color: var(--dark-blue);
}
@media (max-width: 875.5px) {
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

  .gymTag {
    margin-top: 10px;
    margin-left: -10px;
    font-size: clamp(8px, 1.4em, 40px);

  }

  .info-basica {
    /* font-size: clamp(6px, .7em, 36px); */
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
    border: 1px solid black;
    border-radius: 0;
    margin: 0;
  }

  #forzar-inicial {

    display: flex;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height: 100%;
    width: 100%;
  }

  .nombre {
    font-size: clamp(22px, 4vw, 24px);
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
  }

  .info-basica {
    font-size: clamp(10px, .6em, 40px);
  }
}

@media(max-width:875.5px) {
  .gymTag {
    margin-top: 10px;
    margin-left: -10px;
    font-size: clamp(20px, 1.3em, 40px);
  }

  .resultado-imc table {
    width: 100%;
    margin: 0;
    border: 0;
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

  .datos-estadisticas {
    font-size: medium;
  }

  .resultados-cal {
    font-size: medium;
  }

  .def-sup {
    flex-direction: column;
  }

  .def-sup>div {
    width: 100%;
  }

  .def-sup h3 {
    min-height: fit-content;

  }

  .sup {
    border-right: none;
    border-bottom: 2px solid black;
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

  .resultado-imc table tr td{
    height: auto;
  }
}

.usandoMovil {
  margin: 0;
}
</style>