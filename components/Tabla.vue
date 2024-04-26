<script setup>
import { ref } from "vue";
const IdTabla = ref(0);

function crearNuevaTabla() {

}

</script>

<template>
  <div class="vistaTabla"></div>
  <div v-if="(IdTabla = '0')" class="vistaNuevaTabla">
    <button @click="crearNuevaTabla">Nueva tabla</button>
    <div class="nuevaTabla"></div>
  </div>
</template>

<style scoped>
.tabla {
  background-color: red;
  height: 200px;
}
.vistaNuevaTabla {
  margin: 80px 60px;
  background-color: green;
  height: 100%;
  width: 100%;
  /* display: none; */
  position: absolute;
}
</style>
