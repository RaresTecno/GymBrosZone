<script setup>
import Publicacion from '../components/Publicacion.vue'


</script>

<template>
  <main>
    <div id="reja">
     <template v-for="n in 50" :key="n">
        <Publicacion />
      </template>
    </div>
  </main>
</template>

<style scoped>
main{
  width: fit-content;
  padding-top: 80px ;
  padding-left: 80px ;
  margin: auto;
}
#reja{
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
