<script setup>
import Header from './components/Header.vue'
import Nav from './components/BarraLateral.vue'
import Footer from './components/Footer.vue'
import './assets/index.css'
import { userActive } from './clients/supabase'
</script>

<template>
  <Header />
  <RouterView />
  <router-link to="/account">Account</router-link>
  <Nav v-if="userActive"/>
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
