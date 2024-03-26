<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/header.vue'
import Nav from './components/BarraLateral.vue'
import './assets/index.css'
</script>
<template>
  <Header />
  <Nav />
  <RouterView />
</template>

<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
:root{
    --bg-color:#DBE4F6;
    --dark-blue:#0B1E44;
    --alt-black:#121212;
    --greeny-cyan:#caeff6;
}
body{
    background-color: var(--bg-color);
}
</style>