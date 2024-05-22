<script setup>
import Header from './components/Header.vue'
import HeaderMobile from './components/HeaderMobile.vue'

import NavLateral from './components/BarraLateral.vue'
import NavInferior from './components/BarraInferior.vue'
import Footer from './components/Footer.vue'
import './assets/index.css'
import { supabase, userActive, logOut } from './clients/supabase'
import { usandoMovil, disponible } from './main'

import { ref, computed, onMounted } from "vue";

const user = ref(null);

disponible.value = true;
const windowWidth = ref(window.innerWidth);

function updateWidth() {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onMounted(async () => {
  //Borrar
  await guardarIP();
  const { data: { user }, error } = await supabase.auth.getUser();
  /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
  if (error) {
    return false;
  }
  if (user) {
    await revisarCarpeta(user);
    await revisarGymtag(user);
  }
});

/*Función para encriptar el Id del usuario.*/
async function hashUserId(userId) {
  const encoder = new TextEncoder();
  const data = encoder.encode(userId);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function revisarCarpeta(user) {
  /*Construcción de la ruta de la carpeta propia del usuario.*/
  const ruta = `users/user-${await hashUserId(user.id)}/`;
  /*Comprobamos si existe una carpeta con el nombre de la ruta.*/
  const { data: carpeta, error: errorCarpeta } = await supabase
    .storage
    .from('files')
    .list(ruta);

  /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
  if (errorCarpeta) {
    logOut();
    return false;
  }
  /*Si no hay ninguna carpeta con el nombre especificado, la longitud será 0.*/
  if (carpeta.length === 0) {
    /*Creamos la carpeta con un archivo vacío.*/
    const { error: errorSubida } = await supabase.storage
      .from('files')
      .upload(ruta + 'dummy.txt', new Blob(['dummy content']), {
        cacheControl: '3600',
        upsert: false
      });
    /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
    if (errorSubida) {
      logOut();
      return false;
    }
  }
}

async function revisarGymtag(user) {
  /*comprobamos si el usuario que se ha logueado tiene gymtag.*/
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('gymtag')
    .eq('id', user.id);
  /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
  if (error) {
    logOut();
    return false;
  }

  /*Si no tiene gymtag le asignamos uno nuevo aleatorio.*/
  if (usuario && usuario[0].gymtag === null) {
    let nuevoGymtag;
    let existeGymtag;

    /*Puede ser que el gymtag aleatorio se repita, por lo que debemos comprobar si esto ocurre.*/
    do {
      nuevoGymtag = `usuario${Math.floor(Math.random() * 10000000)}`;

      const { data: revisionGymtag, error: gymtagError } = await supabase
        .from('usuarios')
        .select('gymtag')
        .eq('gymtag', nuevoGymtag);

      /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
      if (gymtagError) {
        logOut();
        return false;
      }

      /*Si el tamaño es 1, habrá un usuario con el gymtag generado aleatoriamente.*/
      existeGymtag = revisionGymtag.length > 0;
    } while (existeGymtag);

    /*Tras encontrar un gymtag no usado, lo guardamos.*/
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ gymtag: nuevoGymtag })
      .eq('id', user.id);
    /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
    if (updateError) {
      logOut();
      return false;
    }
  }
}

//Borrar
async function guardarIP() {
  try {
    // Reemplaza la URL con la URL de tu Worker en Cloudflare
    const response = await fetch('https://my-worker.rauldr718.workers.dev');
    const data = await response.json();
    const { error: insertError } = await supabase
      .from('ips')
      .insert([{ userIP: data.ip }]);

    if (insertError) {
      console.error('Error guardando la IP del usuario:', insertError);
      return false;
    }
  } catch (error) {
    console.error('Error obteniendo la IP del usuario:', error);
    return false;
  }
}

</script>

<template>
  <Header v-if="((!usandoMovil && (windowWidth > 875)) || !userActive)" />
  <HeaderMobile v-if="userActive && (windowWidth < 875)" />
  <RouterView />
  <!-- <router-link to="/account">Account</router-link> -->
  <NavLateral v-if="userActive && !usandoMovil && disponible && (windowWidth > 875)" />
  <NavInferior v-if="userActive && disponible && (windowWidth <= 875)" />

  <!-- <Footer /> -->
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

:root {
  --bg-color: #DBE4F6;
  --dark-blue: #0B1E44;
  --alt-black: #121212;
  --greeny-cyan: #caeff6;
  --blue: #3D5A98;
}

body {
  background-color: var(--bg-color);
}
</style>
