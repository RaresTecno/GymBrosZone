<script setup>
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive, userId } from "../clients/supabase";
import { usandoMovil, disponible } from "../main";
import { ref, onMounted, onUnmounted } from "vue"
const todasPublicaciones = ref()
const idPublicacion = ref()
const cantidadPublicaciones = ref()
const fotoTuPerfilMostrar = ref('https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/users/foto-perfil-predeterminada.jpg');

const mostrarDeshacer = ref(false);
const publicacionParaDeshacer = ref(null);
const undoTimeout = ref(null);


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
    const publicacionesIds = likesData.map(like => like.idpublicacion);

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
  const likesSubscription = supabase.channel('public:likes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, (payload) => {
      mostrarDeshacer.value = true;
      publicacionParaDeshacer.value = payload.new.idpublicacion;
      undoTimeout.value = setTimeout(async () => {
        mostrarDeshacer.value = false;
        await mostrarp();
      }, 3500);
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(likesSubscription);
  });
});


async function deshacerLike() {
  clearTimeout(undoTimeout.value);
  mostrarDeshacer.value = false;
  if (publicacionParaDeshacer.value) {
    const { error: insertError } = await supabase
      .from('likes')
      .insert([{ idusuario: userId.value, idpublicacion: publicacionParaDeshacer.value }]);

    if (insertError) {
      console.error('Error al deshacer el like:', insertError);
      return;
    }

    const { error: updateError } = await supabase
      .from('publicaciones')
      .update({ contadorlikes: supabase.fn.increment(1) })
      .eq('idpublicacion', publicacionParaDeshacer.value);

    if (updateError) {
      console.error('Error al actualizar el contador de likes:', updateError);
    }

    publicacionParaDeshacer.value = null;
    await mostrarp();
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
    <div v-if="mostrarDeshacer" class="deshacer-container">
      <div class="deshacer-content">
        <span>Deshacer</span>
        <button @click="deshacerLike">Deshacer</button>
      </div>
    </div>
    <div v-if="userActive" class="publicaciones">
      <div class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion">
          <Publicacion :publicacionUnica="publicacion" :ProfileView="false"
            :fotoTuPerfilMostrar="fotoTuPerfilMostrar" />
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
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
  background-color: #ccc;
  padding: 10px;
  border-radius: 5px;
}

.deshacer-content {
  display: flex;
  align-items: center;
}

.deshacer-content button {
  margin-left: 10px;
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