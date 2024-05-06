<script setup>
import Header from './components/Header.vue'
import HeaderMobile from './components/HeaderMobile.vue'

import NavLateral from './components/BarraLateral.vue'
import NavInferior from './components/BarraInferior.vue'
import Footer from './components/Footer.vue'
import './assets/index.css'
import { userActive } from './clients/supabase'
import { usandoMovil, disponible } from './main'

import { ref, computed, onMounted} from "vue";
const windowWidth = ref(window.innerWidth);

function updateWidth() {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener("resize", updateWidth);
});
</script>

<template>
  <Header v-if="(!usandoMovil && (windowWidth > 875)) || !userActive " />
  <HeaderMobile v-if="userActive && (windowWidth < 875)" />

  <RouterView />
  <!-- <router-link to="/account">Account</router-link> -->
  <NavLateral v-if="userActive && !usandoMovil && disponible && (windowWidth > 875)"/>
  <NavInferior v-if="userActive && disponible && (windowWidth <= 875)"/>

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
