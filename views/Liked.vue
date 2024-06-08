<script setup>
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive, userId } from "../clients/supabase";
import { disponible } from "../main";
import { ref, onMounted, onUnmounted } from "vue";

const todasPublicaciones = ref([]);
const fotoTuPerfilMostrar = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

async function mostrarp() {
  try {
    // Realizar la consulta para obtener las publicaciones a las que el usuario ha dado like
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('idpublicacion')
      .eq('idusuario', userId.value);

    if (likesError) {
      throw likesError;
    }

    if (likesData.length === 0) {
      todasPublicaciones.value = [];
      return;
    }

    // Obtener los IDs de las publicaciones a las que el usuario ha dado like
    const publicacionesIds = likesData.map(likes => likes.idpublicacion);

    // Realizar la consulta para obtener las publicaciones correspondientes a esos IDs
    const { data: publicaciones, error: publicacionesError } = await supabase
      .from('publicaciones')
      .select('*')
      .in('idpublicacion', publicacionesIds);

    if (publicacionesError) {
      throw publicacionesError;
    }

    // Invertir las publicaciones para mostrar las más recientes primero
    todasPublicaciones.value = publicaciones.reverse();

  } catch (error) {
    console.log(error);
  }
}

mostrarp();

onMounted(() => {
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
  actualizarPublicaciones();
}

async function actualizarPublicaciones() {
  await mostrarp();
  if (todasPublicaciones.value.length === 0) {
    if (document.querySelector('.no-publicaciones')) {
      document.querySelector('.no-publicaciones').style.display = 'block';
    }
  } else {
    if (document.querySelector('.no-publicaciones')) {
      document.querySelector('.no-publicaciones').style.display = 'none';
    }
  }
}

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

disponible.value = true;
</script>

<template>
  <main>
    <div class="publicaciones">
      <div v-if="todasPublicaciones.length === 0" class="no-publicaciones">
        <h2>Todavía no has dado like a ninguna publicación.</h2>
      </div>
      <div v-else class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion.idpublicacion">
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
.no-publicaciones {
  text-align: center;
  margin-top: 90px;
}

.no-publicaciones h2 {
  font-size: 28px;
  color: var(--black);
}

.publicaciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  margin-bottom: 100px;
  padding-top: 80px;
}

.vista {
  width: 60%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.deshacer-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  background-color: var(--dark-blue);
  border: 2px solid black;
  /* background-color: red; */
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.deshacer-content {
  display: flex;
  align-items: center;
}

.contador-circulo {
  position: relative;
  width: 35px;
  height: 35px;
  margin-left: 15px;
}

.contador-circulo span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: white;
}

.progress-circle {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 2.8;
}

.circle {
  fill: none;
  stroke: #3e98c7;
  stroke-width: 2.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.1s linear;
}

.deshacer {
  cursor: pointer;
  background-color: var(--blue-buttons);
  /* width: 50px; */
  border: solid var(--black) 2px;
  border-radius: 2px;
  font-size: 15px;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
  height: 35px;
  padding: 0 5px;
}

.deshacer:hover,
.deshacer:active {
  background-color: var(--very-dark-blue);
  color: var(--light-blue-text);
  border: 2px solid var(--grey-buttons-inputs-border);
}

@media (max-width: 1100px) {
  .vista {
    width: 100%;
  }
}

@media (max-width: 875px) {
  main {
    margin-top: 60px;
  }

  .publicaciones {
    margin-left: 0;
    padding-top: 0;
  }

  .vista {
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
  }
}

@media (max-width: 660px) {
  .no-publicaciones {
    margin-top: 60px;
  }

  .no-publicaciones h2 {
    font-size: 24px;
    color: var(--black);
    display: block;
    width: 80%;
    margin: auto;
  }
}

@media (max-width: 625px) {
  main {
    margin-top: 35px;
  }

  .publicaciones {
    margin-left: 0;
    padding-top: 30px;
  }

  .vista {
    width: 100%;
    margin: 0px;
  }
}
</style>
