<script setup>
import '../assets/header.css'

</script>
<template>
  <header>
    <img src="">
    <h1>GymBros Zone</h1>
    <div v-if="loged">
      <button>Login</button>
    </div>
    <div v-else>
      <button>Login</button>
      <button>Registro</button>
    </div>
  </header>
</template>