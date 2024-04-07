<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/header.vue'
import Nav from './components/BarraLateral.vue'
import Log from './views/Log.vue'
import './assets/index.css'

</script>
<template>
  <!-- <Header /> -->
  <!-- <Nav /> -->
  <Log />
  <RouterView />
</template>
