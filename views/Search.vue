<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const busqueda = ref("");
const ProductoFoto= ref('');
const ProductoNutriScore = ref('');
const ProductoNovaGroup = ref('');
const ProductoEcoScore = ref('');
const ProductoCantidad = ref('');
const ProductoIngredientes = ref('');
// const ProductoEcoScore = ref('');
// const ProductoEcoScore = ref('');
// const ProductoEcoScore = ref('');
// API call function (ajustar según la API para códigos de barras)
async function verApi() {
  const url =
    "https://world.openfoodfacts.org/api/v3/product/" + busqueda.value;

  try {
    const response = await fetch(url);
    const result = await response.text();
    const producto = JSON.parse(result);
    console.log(producto.product.image_url)
    ProductoFoto.value = producto.product.image_url
    ProductoNutriScore.value = producto.product.nutriscore_grade;
    ProductoNovaGroup.value = producto.product.nova_group;
    ProductoEcoScore.value = producto.product.ecoscore_grade;
    ProductoCantidad.value = producto.product.ecoscore_data.packaging.packagings.quantity_per_unit;
    ProductoIngredientes.value = producto.product.ingredients_text;
    console.log(producto.product.nutriments["energy-kcal"])
  } catch (error) {
    console.log(error);
  }
}

// Setup barcode scanner
const scanner = ref(null);

onMounted(() => {
  scanner.value = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    formatsToSupport: [
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.EAN_13,
    ],
  });
  scanner.value.render(success, error);
});

onUnmounted(() => {
  if (scanner.value) {
    scanner.value.clear();
  }
});

function success(result) {
  console.log("Barcode result:", result);
  busqueda.value = result.decodedText; // Automatically fills the input with the barcode result
  document.getElementById(
    "result"
  ).innerHTML = `<h2>Success</h2><p>Scanned Barcode: ${result}</p>`;
  if (scanner.value) {
    scanner.value.clear();
  }
  document.getElementById("reader").remove();
}

function error(err) {
  console.log("Error scanning Barcode:", err);
  document.getElementById(
    "result"
  ).innerHTML = `<h2>Error</h2><p>Unable to detect Barcode. Please ensure the Barcode is visible and try again.</p>`;
}
</script>

<template>
  <div class="buscador">
    <div class="filtros">
      <button class="filtro-usuarios">Gym Bros</button>
      <button class="filtro-publicaciones">Publicaciones</button>
      <button class="filtro-productos">Productos</button>
    </div>
    <div class="search">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      <!-- <input type="search"> -->
      <input type="text" v-model="busqueda" />
      <button @click="verApi">Search Product</button>
      <!-- <div class="cerrar">x</div> -->
    </div>
  </div>
  <div class="productos">
    <img :src="ProductoFoto" alt="">
    {{ ProductoNutriScore }}
    {{ ProductoNovaGroup }}
    {{ ProductoEcoScore }}
    {{ ProductoCantidad }}
    {{ ProductoIngredientes }}
  </div>
  <div id="reader"></div>
  <div id="result"></div>
  
</template>

<style scoped>
.buscador{
  margin: 80px 0 0 60px;
  height: 80px;
}
.filtros *{
  width: 33.33%;
}
.productos{
  margin-left: 60px;
  background-color: red;
  width: 100%;
  height: 800px;;
}
.prueba {
  margin: 100px;
}

</style>
