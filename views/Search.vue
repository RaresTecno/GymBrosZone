<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const busqueda = ref("");
const ProductoFoto = ref("");
const ProductoNutriScore = ref("");
const ProductoNovaGroup = ref("");
const ProductoEcoScore = ref("");
const ProductoCantidad = ref("");
const ProductoIngredientes = ref("");
const ProductoKcal_100 = ref('');
const ProductoKjul_100 = ref('');
const ProductoFat_100 = ref('');
const ProductoSaturedFat_100 = ref('');
const ProductoCarbohydrates_100g = ref('');
const ProductoSugars_100 = ref('');
const ProductoFiber_100 = ref('');
const ProductoProteins_100 = ref('');
const ProductoSalt_100 = ref('');
const ProductoAlcohol_100 = ref('');

async function verApi() {
  const url =
    "https://world.openfoodfacts.org/api/v3/product/" + busqueda.value;

  try {
    const response = await fetch(url);
    const result = await response.text();
    const producto = JSON.parse(result);

    ProductoFoto.value = producto.product.image_url;
    ProductoNutriScore.value = urlNutriScore(producto.product.nutriscore_grade);
    ProductoNovaGroup.value = urlNovaScore(producto.product.nova_group);
    ProductoEcoScore.value = urlEcoScore(producto.product.ecoscore_grade);
    ProductoKcal_100.value = producto.product.nutriments["energy-kcal_100g"];
    ProductoKcal_100.value = producto.product.nutriments["energy-kj_100g"];
    ProductoFat_100.value = producto.product.nutriments["fat_100g"];
    ProductoSaturedFat_100.value = producto.product.nutriments["saturated-fat_100g"];
    ProductoCarbohydrates_100g.value = producto.product.nutriments["carbohydrates_100g"];
    ProductoSugars_100.value = producto.product.nutriments["sugars_100g"];
    ProductoFiber_100.value = producto.product.nutriments["fiber_100g"];
    ProductoProteins_100.value = producto.product.nutriments["proteins_100g"];
    ProductoSalt_100.value = producto.product.nutriments["salt_100g"];
    ProductoAlcohol_100.value = producto.product.nutriments["alcohol_100g"];
    // ProductoCantidad.value = producto.product.ecoscore_data.packaging.packagings.quantity_per_unit;
    // ProductoIngredientes.value = producto.product.ingredients_text;
  } catch (error) {
    console.log(error);
  }
}
function urlNutriScore(valor) {
  switch (valor) {
    case "a":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-a.svg";
    case "b":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-b.svg";
    case "c":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-c.svg";
    case "d":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-d.svg";
    case "e":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-e.svg";
    default:
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-unknown.svg";
  }
}
function urlEcoScore(valor) {
  switch (valor) {
    case "a":
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-a.svg";
    case "b":
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-b.svg";
    case "c":
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-c.svg";
    case "d":
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-d.svg";
    case "e":
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-e.svg";
    default:
      return "https://static.openfoodfacts.org/images/attributes/dist/ecoscore-unknown.svg";
  }
}
function urlNovaScore(valor) {
  switch (valor) {
    case 1:
      return "https://static.openfoodfacts.org/images/attributes/dist/nova-group-1.svg";
    case 2:
      return "https://static.openfoodfacts.org/images/attributes/dist/nova-group-2.svg";
    case 3:
      return "https://static.openfoodfacts.org/images/attributes/dist/nova-group-3.svg";
    case 4:
      return "https://static.openfoodfacts.org/images/attributes/dist/nova-group-4.svg";
    default:
      return "https://static.openfoodfacts.org/images/attributes/dist/nova-group-unknown.svg";
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
    <img :src="ProductoFoto" alt="" />
    <img :src="ProductoNutriScore" alt="" />
    <img :src="ProductoNovaGroup" alt="" />
    <img :src="ProductoEcoScore" alt="" />
    {{ ProductoCantidad }}
    {{ ProductoIngredientes }}
  </div>
  <div id="reader"></div>
  <div id="result"></div>
</template>

<style scoped>
.buscador {
  margin: 80px 0 0 60px;
  height: 80px;
}
.filtros * {
  width: 33.33%;
}
.productos {
  margin-left: 60px;
  background-color: red;
  width: 100%;
  height: 800px;
}
.prueba {
  margin: 100px;
}
</style>
