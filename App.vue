<script setup>
import Header from './components/Header.vue'
import HeaderMobile from './components/HeaderMobile.vue'

import NavLateral from './components/BarraLateral.vue'
import NavInferior from './components/BarraInferior.vue'
import Footer from './components/Footer.vue'
import './assets/index.css'
import { supabase, userActive, userData } from './clients/supabase'
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
    await crearCarpeta(user);
  }
});

async function crearCarpeta(user) {
  const ruta = `users/user-${user.id}/`;
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
      console.error('Hubo un error al crear la carpeta de usuario.', errorSubida);
      return false;
    }
  } else if (errorCarpeta) {
    console.error('Hubo un error al verificar la carpeta de usuario.', errorCarpeta);
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
