<script setup>
/*Imports y declaración de variables.*/
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive, userId } from "../clients/supabase";
import { disponible } from "../main";
import { ref, onMounted, onUnmounted } from "vue"
import subrayado from '../assets/img/descarga.svg'

disponible.value = true;
const fotoTuPerfilMostrar = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

const todasPublicaciones = ref([]);
let offsetSeguidos = 0;
let offsetNoSeguidos = 0;
const limit = 9;
let loading = false;
let noMorePublicacionesSeguidos = false;
let noMorePublicacionesNoSeguidos = false;

/*Función para cargar las publicaciones.*/
async function cargarPublicaciones() {
  if (loading || (noMorePublicacionesSeguidos && noMorePublicacionesNoSeguidos)) return;
  loading = true;

  try {
    /*Obtenemos el Id de los usuarios a los que sigue el usuario.*/
    const { data: seguidores, error: errorSeguidores } = await supabase
      .from('seguidores')
      .select('idseguido')
      .eq('idseguidor', userId.value);
    if (errorSeguidores) {
      console.error(errorSeguidores);
      loading = false;
      return;
    }

    const seguidosIds = seguidores.map(seguidor => seguidor.idseguido);

    /*Obtenemos las publicaciones de los usuarios que sigue el usuario.*/
    let publicacionesSeguidos = [];
    if (!noMorePublicacionesSeguidos) {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .in('idusuario', seguidosIds)
        .order('fechapublicacion', { ascending: false })
        .range(offsetSeguidos, offsetSeguidos + limit - 1);
      if (error) {
        console.error(error);
        loading = false;
        return;
      }
      publicacionesSeguidos = data;
      if (data.length < limit) {
        noMorePublicacionesSeguidos = true;
      } else {
        offsetSeguidos += limit;
      }
    }

    /*Obtenemos las publicaciones de los usuarios que no seguimos.*/
    let publicacionesNoSeguidos = [];
    if (!noMorePublicacionesNoSeguidos) {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .not('idusuario', 'in', `(${seguidosIds.join(',')})`)
        .order('fechapublicacion', { ascending: false })
        .range(offsetNoSeguidos, offsetNoSeguidos + limit - 1);
      if (error) {
        console.error(error);
        loading = false;
        return;
      }

      publicacionesNoSeguidos = data;
      if (data.length < limit) {
        noMorePublicacionesNoSeguidos = true;
      } else {
        offsetNoSeguidos += limit;
      }
    }

    /*Unimos las publicaciones de los usuarios seguidos con las de los no seguidos, sin duplicados.*/
    const publicacionesMap = new Map();
    publicacionesSeguidos.forEach(pub => publicacionesMap.set(pub.idpublicacion, pub));
    publicacionesNoSeguidos.forEach(pub => publicacionesMap.set(pub.idpublicacion, pub));

    /*Añadimos las nuevas publicaciones a las existentes.*/
    todasPublicaciones.value.push(...Array.from(publicacionesMap.values()));
    loading = false;
  } catch (error) {
    loading = false;
  }
}

/*Detectamos si el usuario ha llegado casi al final de la página para mostrar otras 9 publicaciones.*/
function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    // cargarPublicaciones();
  }
}

/*Añadimos los eventos de escucha tras montarse la vista: eventos de detectar el final de la página y el de eliminación de una publicación.*/
onMounted(() => {
  // cargarPublicaciones();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('ocultar-publicacion', (event) => {
    ocultarPublicacion(event.detail.idPublicacion);
  });
});

/*Eliminamos los eventos cuando se desmonta el componente.*/
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('ocultar-publicacion', (event) => {
    ocultarPublicacion(event.detail.idPublicacion);
  });
});

/*Función que oculta una publicación cuando esta es eliminada por el usuario.*/
function ocultarPublicacion(idPublicacion) {
  const publicacionElement = document.querySelector(`[data-publicacion-id="${idPublicacion}"]`);
  if (publicacionElement) {
    publicacionElement.style.display = 'none';
  }
}

/*Función para obtener la foto de perfil del usuario para que esta sea visible en las publicaciones a la hora de comentar.*/
async function obtenerTuFotoPerfil() {
  if (userActive.value == true) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select("*")
      .eq('id', userId.value);
    if (error) {
      fotoPerfil.value = 'https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg';
      return;
    }
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
</script>
<template>
  <main>
    <div v-if="!userActive" class="home">
      <h1>
        GymBros Zone
        <img :src="subrayado" alt="">
      </h1>
      <div class="bienvenida">
        <div class="bienvenida_izq">
          <h2>No te pierdas las últimas novedades en el mundo del fitness</h2>
          <p>No importa si eres un culturista profesional o si acabas de empezar tu viaje en el mundo del fitness, en
            Gymbros Zone encontrarás el apoyo y los recursos que necesitas para alcanzar tus metas. Aquí, cada
            repetición cuenta y cada progreso es celebrado.</p>
          <br>
          <p>En GymBros Zone, cada desafío es una oportunidad para crecer. Encuentra tu fuerza interior y haz que cada
            sesión de entrenamiento cuente.</p>
        </div>
        <div class="bienvenida_der">
          <img src="../assets/img/sport-1244925.webp" alt="">
        </div>
      </div>
      <div class="bienvenida logros">
        <div class="bienvenida_der logros_der">
          <img src="../assets/img/logros.webp" alt="">
        </div>
        <div class="bienvenida_izq">
          <h2>Comparte tus metas y logros con el resto de GymBros</h2>
          <p>Comparte tus logros y motiva a otros a alcanzar sus objetivos. No importa lo grande o pequeño sea tu
            avance, todo suma. ¡Vamos juntos en este viaje hacia una mejor versión de nosotros mismos! <br> <br>
            Demuestra al resto de lo que eres capaz publicando tus resultados e interactuando con las publicaciones en
            GymBros Zone
          </p>
        </div>
      </div>
      <div class="bienvenida dieta">
        <div class="bienvenida_izq">
          <h2>Logra la dieta que tanto deseas!</h2>
          <p>En GymBros Zone tendrás una infinidad de alimentos que podras buscar, analizar e incluso escanear.</p>
          <p>También podrás compartir tus recetas favoritas y descubrir nuevos platillos saludables creados por la
            comunidad.</p>
          <h3>¿A que esperas?</h3>
          <h4>Únete a GymBrosZone</h4>
          <div id="no-loged">
            <RouterLink to="/login" class="btn-no-loged boton_header" id="btn-login">Login</RouterLink>
            <RouterLink to="/register" class="btn-no-loged boton_header" id="btn-register">Registro</RouterLink>
          </div>
        </div>
        <div class="bienvenida_der">
          <img src="../assets/img/comida.jpg" alt="">
        </div>
      </div>
    </div>
    <div v-if="userActive" class="publicaciones">
      <div class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion">
          <div :data-publicacion-id="publicacion.idpublicacion">
            <Publicacion :publicacionUnica="publicacion" :ProfileView="false"
              :fotoTuPerfilMostrar="fotoTuPerfilMostrar" />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<style scoped>
main {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 4em;
  margin: 20px;
  position: relative;
}

h1 img {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  transform: rotate(2deg) scaleY(0.5);

}

.home {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bienvenida {
  margin-top: 20px;
  display: flex;
  width: 80%;
  background-color: #1e3a71;
  border-radius: 20px;
  overflow: hidden;
  color: var(--light-blue-text);
  align-items: center;
  padding: 30px;
  border: 3px solid black;
  margin-bottom: 40px;
  gap: 20px;
}

.bienvenida_izq {
  width: 60%;
  font-size: 1.3em;
  align-self: baseline;
}

.bienvenida_izq h2 {
  text-decoration: underline;
  margin-bottom: 10px;
}

.bienvenida_izq p {
  margin: 5px;
}

.bienvenida_der {
  height: fit-content;
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.bienvenida_der img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  border: 3px solid black;
  min-width: 250px;
}

.dieta .bienvenida_izq {
  display: flex;
  flex-direction: column;
}

.dieta h3,
.dieta h4,
.botones {
  align-self: center;
  margin: 10px;
  text-align: center;
}

.dieta h3 {
  margin-top: 30px;
}

.btn-no-loged {
  display: flex;
  justify-content: center;
  padding: 5px 70px;
  width: 90px;
  animation: heartbeat 1s infinite;
}

#no-loged {
  margin: 10px;
  display: flex;
  justify-content: center;
  gap: 10%;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.boton_header {
  font-weight: bold;
  text-decoration: none;
  background-color: #3d5a98;
  color: var(--light-blue-text);
  border: 2px solid var(--black);
  cursor: pointer;
  border-radius: 25px;
  text-align: center;
  transition: border 0.5s;
}

.boton_header:hover,
.boton_header:active {
  border-color: #eef2fa81;
}

.publicaciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  margin-bottom: 100px;
}

.vista {
  margin-top: 80px;
  width: 60%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Centra el contenido verticalmente*/
}

@media (max-width: 1100px) {
  .bienvenida {
    width: 90%;
  }

  .dieta h3 {
    margin-top: 10px;
  }
}

@media (max-width: 875px) {
  .home {
    margin-top: 95px;
  }

  .bienvenida {
    flex-direction: column;
    align-items: center;
  }

  .bienvenida_izq {
    width: 100%;
  }

  .logros {
    display: flex;
    flex-direction: column-reverse;
  }

  .publicaciones {
    margin-left: 0;
    padding-top: 0;
  }

  .vista {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    width: 80%;
  }
}

@media (max-width: 625px) {
  .publicaciones {
    margin-left: 0;
    padding-top: 30px;
  }

  .vista {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .home {
    margin-top: 170px;
  }
}

@media(max-width: 500px) {
  h1 {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    width: 88vw;
    font-size: clamp(2.4rem, 12vw, 20rem);
    min-width: fit-content;
  }

  h1 img {
    top: 50%;
  }

  .bienvenida {
    font-size: 0.8em;
  }

  #no-loged {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }
}
</style>