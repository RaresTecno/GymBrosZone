<script setup>
import Header from './components/header.vue'
import Log from './views/Log.vue'
import Nav from './components/BarraLateral.vue'
import './assets/index.css'

</script>
<template>
  <Header />
  <Log />
  <Nav />
  <RouterView />
