<script setup>
import Header from './components/Header.vue'
import HeaderMobile from './components/HeaderMobile.vue'

import NavLateral from './components/BarraLateral.vue'
import NavInferior from './components/BarraInferior.vue'
import Footer from './components/Footer.vue'
import './assets/index.css'
import { supabase, userActive, userData, logOut } from './clients/supabase'
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
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await revisarCarpeta(user);
    await revisarGymtag(user);
    //Borrar
    await guardarIP(user);
  }
});

async function revisarCarpeta(user) {
  const ruta = `users/user-${user.id.split('').reverse().join('')}/`;
  const { data: carpeta, error: errorCarpeta } = await supabase
    .storage
    .from('files')
    .list(ruta);

  if (carpeta.length === 0) {
    const { error: errorSubida } = await supabase.storage
      .from('files')
      .upload(ruta + 'dummy.txt', new Blob(['dummy content']), {
        cacheControl: '3600',
        upsert: false
      });

    if (errorSubida) {
      logOut();
      return false;
    }
  } else if (errorCarpeta) {
    logOut();
    return false;
  }
}

async function revisarGymtag(user) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('gymtag')
    .eq('id', user.id)
    .single();

  if (error) {
    logOut();
    return false;
  }

  if (usuario && usuario.gymtag === null) {
    let nuevoGymtag;
    let existeGymtag;

    do {
      nuevoGymtag = `usuario${Math.floor(Math.random() * 10000000)}`;

      const { data: revisionGymtag, error: gymtagError } = await supabase
        .from('usuarios')
        .select('gymtag')
        .eq('gymtag', nuevoGymtag)
        .single();

      if (gymtagError) {
        logOut();
        return false;
      }

      existeGymtag = revisionGymtag !== null;
    } while (existeGymtag);

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ gymtag: nuevoGymtag })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error actualizando gymtag del usuario:', updateError);
      logOut();
      return false;
    }
  }
}

//Borrar
async function guardarIP(user) {
  try {
    const response = await fetch('http://localhost:3000/get-ip');
    const data = await response.json();
    const userIP = data.ip;

    const { error: insertError } = await supabase
      .from('ips')
      .insert([{ user_id: user.id, ip: userIP }]);

    if (insertError) {
      console.error('Error guardando la IP del usuario:', insertError);
      logOut();
      return false;
    }
  } catch (error) {
    console.error('Error obteniendo la IP del usuario:', error);
    logOut();
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
