<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/clients/supabase";

/* const IdTabla = ref(0); */
const tablaUrl = ref("");

/* function crearNuevaTabla() {

} */

/* const mostrarFinal = ref(false);
const gymTag = ref("Rares");
const windowWidth = ref(window.innerWidth);
 */
/* function updateWidth() {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener("resize", updateWidth);
}); */

/* const mostrar = () => {
  document.body.style.overflow = "hidden";
  mostrarFinal.value = true;
};
const cerrar = () => {
  document.body.style.overflow = "visible";
  mostrarFinal.value = false;
}; */

onMounted(async () => {
  const response = await supabase.storage
  .from("archivos-usuarios/usuario/tablas")
  .getPublicUrl("tablaEjemplo.ods");
  
  // Guardar la URL de la tabla en la referencia
  tablaUrl.value = response.data.publicUrl;
});
</script>

<template>
<!--   <div class="vistaTabla"></div>
  <div v-if="(IdTabla = '0')" class="vistaNuevaTabla">
    <button @click="crearNuevaTabla">Nueva tabla</button>
    <div class="nuevaTabla"></div>
  </div> -->
  <div>
    <div v-if="tablaUrl">
      <iframe :src="tablaUrl" class="tabla" frameborder="0"></iframe>
    </div>
  </div>
</template>

<style scoped>
/* 
.tabla {
  background-color: red;
  height: 200px;
}
.vistaNuevaTabla {
  margin: 80px 60px;
  background-color: green;
  height: 100%;
  width: 100%; */
  /* display: none; */
/*   position: absolute;
} */

.tabla {
  width: 100%;
  height: 400px;
}
</style>
