<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { disponible } from "../main";

disponible.value = true;

const buscado = ref(false);
const busqueda = ref("");
const ProductoFoto = ref("");
const ProductoNombre = ref("a");
const ProductoNutriScore = ref("");
const ProductoNovaGroup = ref("");
const ProductoEcoScore = ref("");
const ProductoCantidad = ref("");
const ProductoIngredientes = ref("");
const ProductoKcal_100 = ref("");
const ProductoKjul_100 = ref("");
const ProductoFat_100 = ref("");
const ProductoFatUnit = ref("");
const ProductoSaturedFat_100 = ref("");
const ProductoSaturedFatUnit = ref("");
const ProductoCarbohydrates_100g = ref("");
const ProductoCarbohydratesUnit = ref("");
const ProductoSugars_100 = ref("");
const ProductoSugarsUnit = ref("");
const ProductoFiber_100 = ref("");
const ProductoFiberUnit = ref("");
const ProductoProteins_100 = ref("");
const ProductoProteinsUnit = ref("");
const ProductoSalt_100 = ref("");
const ProductoSaltUnit = ref("");
const ProductoAlcohol_100 = ref("");
const ProductoAlcoholUnit = ref("");

const ProductoPositivePoints = ref("");
const ProductoNegativePoints = ref("");
const ProductoProteinsPoints = ref("");
const ProductoFiberPoints = ref("");
const ProductoFruitsPoints = ref("");
const ProductoEnergyPoints = ref("");
const ProductoSugarsPoints = ref("");
const ProductoSaturatedPoints = ref("");
const ProductoSodiumPoints = ref("");
const ProductoNutriScorePoints = ref("");

async function verApi() {
  const url =
    "https://world.openfoodfacts.org/api/v3/product/" + busqueda.value;

  try {
    const response = await fetch(url);
    const result = await response.text();
    const producto = JSON.parse(result);

    ProductoFoto.value = imagen(producto);
    ProductoNombre.value = nombre(producto);
    ProductoNutriScore.value = urlNutriScore(producto.product.nutriscore_grade);
    ProductoNovaGroup.value = urlNovaScore(producto.product.nova_group);
    ProductoEcoScore.value = urlEcoScore(producto.product.ecoscore_grade);
    ProductoKcal_100.value = producto.product.nutriments["energy-kcal_100g"];
    ProductoKjul_100.value = producto.product.nutriments["energy-kj_100g"];
    ProductoFat_100.value = producto.product.nutriments["fat_100g"];
    ProductoFatUnit.value = producto.product.nutriments["fat_unit"];
    ProductoSaturedFat_100.value =
      producto.product.nutriments["saturated-fat_100g"];
    ProductoSaturedFatUnit.value =
      producto.product.nutriments["saturated-fat_unit"];
    ProductoCarbohydrates_100g.value =
      producto.product.nutriments["carbohydrates_100g"];
    ProductoCarbohydratesUnit.value =
      producto.product.nutriments["carbohydrates_unit"];
    ProductoSugars_100.value = producto.product.nutriments["sugars_100g"];
    ProductoSugarsUnit.value = producto.product.nutriments["sugars_unit"];
    ProductoFiber_100.value = producto.product.nutriments["fiber_100g"];
    ProductoFiberUnit.value = producto.product.nutriments["fiber_unit"];
    ProductoProteins_100.value = producto.product.nutriments["proteins_100g"];
    ProductoProteinsUnit.value = producto.product.nutriments["proteins_unit"];
    ProductoSalt_100.value = producto.product.nutriments["salt_100g"];
    ProductoSaltUnit.value = producto.product.nutriments["salt_unit"];
    ProductoAlcohol_100.value = producto.product.nutriments["alcohol_100g"];
    ProductoAlcoholUnit.value = producto.product.nutriments["alcohol_unit"];
    ProductoIngredientes.value = ingredients(producto).replace(/_/g, " ");
    ProductoCantidad.value = producto.product.quantity;

    ProductoNegativePoints.value = producto.product.nutriscore_data.negative_points;
    ProductoPositivePoints.value = producto.product.nutriscore_data.positive_points;
    ProductoProteinsPoints.value = producto.product.nutriscore_data.proteins_points;
    ProductoFiberPoints.value = producto.product.nutriscore_data.fiber_points;
    ProductoFruitsPoints.value = producto.product.nutriscore_data.fruits_vegetables_nuts_colza_walnut_olive_oils_points;
    ProductoEnergyPoints.value = producto.product.nutriscore_data.energy_points;
    ProductoSaturatedPoints.value = producto.product.nutriscore_data.saturated_fat_points;
    ProductoSugarsPoints.value = producto.product.nutriscore_data.sugars_points;
    ProductoSodiumPoints.value = producto.product.nutriscore_data.sodium_points;
    ProductoNutriScorePoints.value = producto.product.nutriscore_score_opposite;

    console.log(ProductoNegativePoints.value)
    buscado.value = true;
  } catch (error) {
    console.log(error);
  }
}
function nombre(producto) {
  if (
    producto.product.product_name_es != null &&
    producto.product.product_name_es != ""
  ) {
    return producto.product.product_name_es;
  } else if (
    producto.product.product_name_en != null &&
    producto.product.product_name_en != ""
  ) {
    return producto.product.product_name_en;
  } else {
    return producto.product.product_name;
  }
}
function imagen(producto) {
  if (producto.product.image_url != null) {
    return producto.product.image_url;
  } else {
    return "https://world.openfoodfacts.org/images/icons/dist/packaging.svg";
  }
}
function ingredients(producto) {
  if (
    producto.product.ingredients_text_es != null &&
    producto.product.ingredients_text_es != ""
  ) {
    return producto.product.ingredients_text_es;
  } else if (
    producto.product.ingredients_text_en != null &&
    producto.product.ingredients_text_en != ""
  ) {
    return producto.product.ingredients_text_en;
  } else if (
    producto.product.ingredients_text_uk != null &&
    producto.product.ingredients_text_uk != ""
  ) {
    return producto.product.ingredients_text_en;
  } else if (
    producto.product.ingredients_text != null &&
    producto.product.ingredients_text != ""
  ) {
    return producto.product.ingredients_text;
  } else {
    return "No disponible"
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
document.addEventListener('DOMContentLoaded', function() {
    // Encuentra el elemento con el id "reader"
    var readerElement = document.getElementById("reader");

    // Verifica si el elemento existe
    if (readerElement) {
        // Crea un nuevo div
        var newDiv = document.createElement("div");

        // Añade la clase 'ocultar-i' al nuevo div
        newDiv.classList.add('ocultar-i');

        // Opcional: Añadir contenido al nuevo div
        newDiv.innerHTML = "<p>Este es un nuevo contenido</p>";

        // Añade el nuevo div como hijo del elemento "reader"
        readerElement.appendChild(newDiv);
    } else {
        console.error('Elemento con id "reader" no encontrado.');
    }
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
  busqueda.value = result;
  verApi();
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
      <div class="cerrar">x</div>
    </div>
  </div>
  <div id="reader">
    
    
  </div>
  
  <div id="result">
    
  </div>
  <div v-if="buscado" class="productos">
    <div class="producto-arriba">
      <div class="producto-img">
        <img :src="ProductoFoto" alt="" class="img-producto" />
      </div>
      <div class="producto-general">
        <div class="general-texto">
          <h2 class="producto-nombre">{{ ProductoNombre }}</h2>

          <p class="producto-cantidad">
          <div>Cantidad: </div>{{ ProductoCantidad }}.</p>
          <p class="producto-ingredientes">
          <div>Ingredientes: </div>{{ ProductoIngredientes }}.</p>
        </div>
        <div class="general-scores">
          <img class="producto-nutriscore" :src="ProductoNutriScore" alt="" />
          <img class="producto-novagroup" :src="ProductoNovaGroup" alt="" />
          <img class="producto-ecoscore" :src="ProductoEcoScore" alt="" />
        </div>
      </div>
    </div>

    <div class="producto-nutrientes">
      <div class="tabla-nutrientes">
        <div class="tr">
          <div class="th">Información nutricional</div>
          <div class="th">Vendido por 100 g / 100 ml</div>
        </div>
        <div class="tr">
          <div>Energía</div>
          <div>{{ ProductoKjul_100 }} Kj <br> {{ ProductoKcal_100 }} Kcal</div>
        </div>
        <div class="tr">
          <div>Grasas</div>
          <div>{{ ProductoFat_100 }} {{ ProductoFatUnit }}</div>
        </div>
        <div class="tr">
          <div>Grasas saturadas</div>
          <div>{{ ProductoSaturedFat_100 }} {{ ProductoSaturedFatUnit }}</div>
        </div>
        <div class="tr">
          <div>Carbohidratos</div>
          <div>{{ ProductoCarbohydrates_100g }} {{ ProductoCarbohydratesUnit }}</div>
        </div>
        <div class="tr">
          <div>Fibra</div>
          <div>{{ ProductoFiber_100 }} {{ ProductoFiberUnit }}</div>
        </div>
        <div class="tr">
          <div>Proteinas</div>
          <div>{{ ProductoProteins_100 }} {{ ProductoProteinsUnit }}</div>
        </div>
        <div class="tr">
          <div>Sal</div>
          <div>{{ ProductoSalt_100 }} {{ ProductoSaltUnit }}</div>
        </div>
        <div class="tr">
          <div>Azucar</div>
          <div>{{ ProductoSugars_100 }} {{ ProductoSugarsUnit }}</div>
        </div>
        <div class="tr">
          <div>Alcohol</div>
          <div>{{ ProductoAlcohol_100 }} {{ ProductoAlcoholUnit }}</div>
        </div>
      </div>
      <div class="tabla-nutriscore">
        <div class="positive-points points">
          <h3>Puntos positivos: {{ ProductoPositivePoints }}</h3>
          <span>Proteinas: {{ ProductoProteinsPoints }}/5</span>
          <span>Fibra: {{ ProductoFiberPoints }}/5</span>
          <span>Frutas, vegetales, nueces y aceites de colza/nuez/oliva : {{ ProductoFruitsPoints }}/5</span>

        </div>
        <div class="negative-points points">
          <h3>Puntos negativos: {{ ProductoNegativePoints }}</h3>
          <span>Energía: {{ ProductoEnergyPoints }}/10</span>
          <span>Azucares: {{ ProductoSugarsPoints }}/10</span>
          <span>Grasas saturadas: {{ ProductoSaturatedPoints }}/10</span>
          <span>Sodio: {{ ProductoSodiumPoints }}/10</span>
        </div>
      </div>
      <div class="nutriscore-points">
        <img class="total-nutriscore" :src="ProductoNutriScore" alt="" />
        <h3>Puntuación total: {{ ProductoNutriScorePoints }}</h3>
      </div>
    </div>

  </div>
</template>

<style scoped>
#result {
  position: relative;
}

#reader {
  position: relative;
  margin-left: 60px;
  border: none
}

.ocultar-i {
  position: absolute;
  background-color: red;
  height: 150px;
  width: 50px;
  right: 0;
  top: 1px;
  z-index: 100;
  background: var(--bg-color);
}

.buscador {
  margin: 80px 0 0 60px;
  height: 80px;
}

.filtros * {
  width: 33.33%;
}

.productos {
  margin-left: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.producto-arriba {
  display: flex;
  width: 80%;
  background-color: #5984df;
  min-height: 300px;
  max-height: 600px;
  padding: 24px;
  border-radius: 25px;
  border: 2px solid black;
  margin-bottom: 20px;

}

.producto-img {
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: 40%;
  min-width: 220px;
  max-width: fit-content;
  border: 2px solid black;
  border-radius: 20px;
  padding: 20px;
  margin-right: 20px;
  background-color: white
}

.img-producto {
  width: 100%;
  height: 100%;
  max-height: 500px;
  min-width: 200px;
  object-fit: contain;
}

.producto-general {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.producto-nombre {
  margin-top: 20px;
}

.producto-cantidad {
  display: flex;
  align-items: center;
  margin-top: 10px
}

.producto-ingredientes {
  margin-top: 10px
}

.producto-cantidad div {
  margin-right: 5px;
}

.general-scores {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 15px 20px 20px 0;

}

.producto-nutriscore {
  width: 40%;
  max-width: 200px;
}

.producto-novagroup {
  width: 20%;
  max-width: 80px;
  margin: 0 10% 0 10%;
  background-color: white;
  padding: 7px;
  border-radius: 15px;
}

.producto-ecoscore {
  width: 40%;
  max-width: 200px;
}

.producto-nutrientes {
  margin-bottom: 200px;
  border-radius: 25px;
  background-color: #5984df;
  padding: 24px;
  border: 2px solid black;
  width: 80%;
}

.tabla-nutrientes {
  border: 1px solid black;
  background-color: white;
}

.tabla-nutrientes .th {
  display: flex;
  justify-content: center;
  font-size: x-large;
  font-weight: 600;
  background-color: #0c1f49;
  color: var(--light-blue-text);
}

.tabla-nutrientes> :nth-child(even) {
  background-color: #c0c0c0;
}

.tabla-nutrientes> :nth-child(odd) {
  background-color: #e6e6e6;
}

.tabla-nutrientes .tr {
  display: flex;
  border: 1px solid black;
}

.tabla-nutrientes .tr div {
  width: 50%;
  display: flex;
  align-items: center;
  padding: 5px;
}

.tabla-nutrientes .tr :first-child {
  border-right: 2px solid black;
}

.tabla-nutriscore {
  display: flex;
}

.points {
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 50%;
}

.points span {
  margin: 2px;
}

.nutriscore-points {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nutriscore-points * {
  margin: 0 50px;
}

@media (max-width: 1150px) {
  .producto-novagroup {
    margin: 0 2% 0 2%;
  }
}

@media (max-width: 875px) {
  .productos {
    margin-left: 0;
  }

  .producto-arriba {
    flex-direction: column;
    align-items: center;
    max-height: fit-content;
  }

  .producto-img {
    min-width: 100%;
    width: fit-content;
    max-width: 100%;
    max-height: 600px;
    margin: 0;
  }

  .img-producto {
    height: 30%;
    min-height: 200px;
    margin: 0;

  }

  .producto-general h2 {
    text-align: center;
  }
}
</style>
