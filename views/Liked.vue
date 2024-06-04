<script setup>
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive, userId } from "../clients/supabase";
import { usandoMovil, disponible } from "../main";
import { ref, reactive } from "vue"
const todasPublicaciones = ref()
const idPublicacion = ref()
const cantidadPublicaciones = ref()
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


async function obtenerTuFotoPerfil(){
  if(userActive.value == true){
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
    <div v-if="userActive" class="publicaciones">
      <div class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion">
          <Publicacion :publicacionUnica="publicacion" :ProfileView="false" :fotoTuPerfilMostrar="fotoTuPerfilMostrar"/>
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

@media (max-width: 1100px) {
  .vista{
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