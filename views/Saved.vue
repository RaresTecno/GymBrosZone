<script setup>
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive, userId } from "../clients/supabase";
import { usandoMovil, disponible } from "../main";
import { ref, onMounted, onUnmounted } from "vue";

const todasPublicaciones = ref([]);
const fotoTuPerfilMostrar = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

async function mostrarp() {
  try {
    // Realizar la consulta para obtener las publicaciones a las que el usuario ha dado like
    const { data: savesData, error: savesError } = await supabase
      .from('guardados')
      .select('idpublicacion')
      .eq('idusuario', userId.value);

    if (savesError) {
      throw savesError;
    }

    if (savesData.length === 0) {
      todasPublicaciones.value = [];
      return;
    }

    // Obtener los IDs de las publicaciones a las que el usuario ha dado like
    const publicacionesIds = savesData.map(saves => saves.idpublicacion);

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
      <div class="no-publicaciones" v-if="todasPublicaciones.length === 0">
        <h2>Todavía no has guardado ninguna publicación.</h2>
      </div>
      <div class="vista">
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