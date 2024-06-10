<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { disponible } from "../main";
import { supabase, userId } from "../clients/supabase";

disponible.value = true;

const vistaUnica = ref(false)

const buscado = ref(false);
const busquedaAlimento = ref("");
const pagina = ref(1);
const productos = ref([]);
const totalPaginas = ref(1);
const productosPorPagina = 10;
const tiempoCarga = ref(null);
const paginasParaMostrar = ref([]);
const codigo = ref()

const ProductoFoto = ref("");
const ProductoNombre = ref("");
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

watch([busquedaAlimento, pagina], buscarProductos);
// Observar cambios en busquedaAlimento
watch(busquedaAlimento, () => {
  // Cuando busquedaAlimento cambia, establecer pagina a 1
  codigo.value = undefined
  pagina.value = 1;
});
const esCodigoBarras = /^[0-9]{4,}$/;
async function buscarProductos() {

  let url;
  console.log(codigo.value);
  const startTime = performance.now();

  if (esCodigoBarras.test(busquedaAlimento.value.trim()) || codigo.value != undefined) {

    if (codigo.value === undefined) {
      url = "https://world.openfoodfacts.org/api/v3/product/" + busquedaAlimento.value.trim();
      codigo.value = busquedaAlimento.value.trim()
    } else {
      url = "https://world.openfoodfacts.org/api/v3/product/" + codigo.value;
    }
    vistaUnica.value = true;

    const response = await fetch(url);
    let result = await response.json();
    const producto = result.product;


    productos.value = result.products;
    ProductoFat_100.value = producto.nutriments["fat_100g"];
    ProductoFoto.value = imagen(producto);
    ProductoNombre.value = nombre(producto);
    ProductoNutriScore.value = urlNutriScore(producto);
    ProductoNovaGroup.value = urlNovaScore(producto);
    ProductoEcoScore.value = urlEcoScore(producto);
    ProductoKcal_100.value = producto.nutriments["energy-kcal_100g"];
    ProductoKjul_100.value = producto.nutriments["energy-kj_100g"];
    ProductoFat_100.value = producto.nutriments["fat_100g"];
    ProductoFatUnit.value = producto.nutriments["fat_unit"];
    ProductoSaturedFat_100.value = producto.nutriments["saturated-fat_100g"];
    ProductoSaturedFatUnit.value = producto.nutriments["saturated-fat_unit"];
    ProductoCarbohydrates_100g.value = producto.nutriments["carbohydrates_100g"];
    ProductoCarbohydratesUnit.value = producto.nutriments["carbohydrates_unit"];
    ProductoSugars_100.value = producto.nutriments["sugars_100g"];
    ProductoSugarsUnit.value = producto.nutriments["sugars_unit"];
    ProductoFiber_100.value = producto.nutriments["fiber_100g"];
    ProductoFiberUnit.value = producto.nutriments["fiber_unit"];
    ProductoProteins_100.value = producto.nutriments["proteins_100g"];
    ProductoProteinsUnit.value = producto.nutriments["proteins_unit"];
    ProductoSalt_100.value = producto.nutriments["salt_100g"];
    ProductoSaltUnit.value = producto.nutriments["salt_unit"];
    ProductoAlcohol_100.value = producto.nutriments["alcohol_100g"];
    ProductoAlcoholUnit.value = producto.nutriments["alcohol_unit"];
    ProductoIngredientes.value = ingredients(producto).replace(/_/g, " ");
    ProductoCantidad.value = producto.quantity;

    ProductoNegativePoints.value = producto.nutriscore_data ? producto.nutriscore_data.negative_points : "?";
    ProductoPositivePoints.value = producto.nutriscore_data ? producto.nutriscore_data.positive_points : "?";
    ProductoProteinsPoints.value = producto.nutriscore_data ? producto.nutriscore_data.proteins_points : "?";
    ProductoFiberPoints.value = producto.nutriscore_data ? producto.nutriscore_data.fiber_points : "?";
    ProductoFruitsPoints.value = producto.nutriscore_data ? producto.nutriscore_data.fruits_vegetables_nuts_colza_walnut_olive_oils_points : "?";
    ProductoEnergyPoints.value = producto.nutriscore_data ? producto.nutriscore_data.energy_points : "?";
    ProductoSaturatedPoints.value = producto.nutriscore_data ? producto.nutriscore_data.saturated_fat_points : "?";
    ProductoSugarsPoints.value = producto.nutriscore_data ? producto.nutriscore_data.sugars_points : "?";
    ProductoSodiumPoints.value = producto.nutriscore_data ? producto.nutriscore_data.sodium_points : "?";
    ProductoNutriScorePoints.value = producto.nutriscore_data ? producto.nutriscore_score_opposite : "?";


    // console.log(ProductoNegativePoints.value)

  } else {
    url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(busquedaAlimento.value.trim())}&search_simple=1&action=process&page_size=${productosPorPagina}&page=${pagina.value}&json=true&sort_by=popularity`;
    vistaUnica.value = false;

    try {
      const response = await fetch(url);
      // console.log(response.code)
      let result = await response.json();


      const resultado = result.products;
      productos.value = resultado;
      totalPaginas.value = Math.ceil(result.count / productosPorPagina);
      buscado.value = true;
    } catch (error) {
      console.log(error);
    }


  }
  const endTime = performance.now(); // Fin del tiempo
  tiempoCarga.value = (endTime - startTime).toFixed(2);
}
function mostrarProducto(codigoP) {
  codigo.value = codigoP
  buscarProductos()
}
function cerrarProducto() {
  codigo.value = undefined
  buscarProductos()
  vistaUnica.value = false
}
function toCapitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}
function nombre(producto) {
  const idiomas = [
    'product_name_es',
    'product_name_en',
    'product_name',
    'product_name_fr',
    'product_name_ro',
    'product_name_pl',
    'product_name_ar',
    'product_name_bn',
    'product_name_bs',
    'product_name_ca',
    'product_name_cs',
    'product_name_da',
    'product_name_de',
    'product_name_el',
    'product_name_et',
    'product_name_fa',
    'product_name_fi',
    'product_name_he',
    'product_name_hi',
    'product_name_hr',
    'product_name_hu',
    'product_name_id',
    'product_name_it',
    'product_name_ja',
    'product_name_ko',
    'product_name_lt',
    'product_name_lv',
    'product_name_mk',
    'product_name_ms',
    'product_name_nl',
    'product_name_no',
    'product_name_pt',
    'product_name_ru',
    'product_name_sk',
    'product_name_sl',
    'product_name_sr',
    'product_name_sv',
    'product_name_tr',
    'product_name_uk',
    'product_name_vi',
    'product_name_zh',
    'product_name_zh_tw'
  ];
  for (const idioma of idiomas) {
    if (producto[idioma] && producto[idioma].trim() !== '' && producto.brands_tags && producto.brands_tags.length > 0) {
      return producto[idioma] + " - " + toCapitalize(producto.brands_tags[0]);
    }
    if (producto[idioma] && producto[idioma].trim() !== '') {
      return producto[idioma]
    }
  }
  if (producto.brands_tags && producto.brands_tags.length > 0) {
    console.log(producto.brands_tags)
    return toCapitalize(producto.brands_tags[0]);
  }
  return false; //Retorna una cadena vacía si no se encuentra ningún nombre de producto
}
function cantidad(producto) {
  if (producto.quantity) {
    return ` - ${producto.quantity}`;
  }
  return ''; // Retorna una cadena vacía si no hay cantidad
}
function imagen(producto) {
  if (producto.image_url != null) {
    return producto.image_url;
  } else {
    return "https://world.openfoodfacts.org/images/icons/dist/packaging.svg";
  }
}
function ingredients(producto) {
  if (
    producto.ingredients_text_es != null &&
    producto.ingredients_text_es != ""
  ) {
    return producto.ingredients_text_es;
  } else if (
    producto.ingredients_text_en != null &&
    producto.ingredients_text_en != ""
  ) {
    return producto.ingredients_text_en;
  } else if (
    producto.ingredients_text_uk != null &&
    producto.ingredients_text_uk != ""
  ) {
    return producto.ingredients_text_en;
  } else if (
    producto.ingredients_text != null &&
    producto.ingredients_text != ""
  ) {
    return producto.product.ingredients_text;
  } else {
    return "No disponible"
  }
}
function urlNutriScore(valor) {
  switch (valor.nutriscore_grade) {
    case "a":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-a-new-en.svg"
    case "b":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-b-new-en.svg";
    case "c":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-c-new-en.svg";
    case "d":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-d-new-en.svg";
    case "e":
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-e-new-en.svg";
    default:
      return "https://static.openfoodfacts.org/images/attributes/dist/nutriscore-unknown-new-en.svg";
  }
}
function urlEcoScore(valor) {
  switch (valor.ecoscore_grade) {
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
  switch (valor.nova_group) {
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
function borrar() {
  busquedaAlimento.value = ""
}
function borrarUsuario() {
  busquedaUsuarios.value = ""

}
const paginaAnterior = () => {
  if (pagina.value > 1) {
    pagina.value--;
    buscarProductos();
  }
};

const paginaSiguiente = () => {
  if (pagina.value < totalPaginas.value) {
    pagina.value++;
    buscarProductos();
  }
};

// const vistaBusqueda = ref(sessionStorage.getItem("vistaBusqueda") || "Usuarios");
const vistaBusqueda = ref("Usuarios");
function cambiarVista(tipo) {
  vistaBusqueda.value = tipo;
  // sessionStorage.setItem("vistaBusqueda", tipo); // Guardar la vista seleccionada en el almacenamiento local
}

let html5QrcodeScanner = null;
const mostrandoScanner = ref(false);
function onScanSuccess(decodedText, decodedResult) {
  console.log(`Code matched = ${decodedText}`, decodedResult);
  busquedaAlimento.value = decodedText;
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear();
    html5QrcodeScanner = null;
  }
}

function onScanError(errorMessage) {
  console.log(`Error = ${errorMessage}`);
}

function mostrarScanner() {
  mostrandoScanner.value = !mostrandoScanner.value
  if (mostrandoScanner.value == false) {
    html5QrcodeScanner.clear();
    html5QrcodeScanner = null;
    return
  }

  const readerElement = document.getElementById("reader");

  if (readerElement) {
    if (!html5QrcodeScanner) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 180 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
          ],
        },
        false // Esto previene múltiples instancias del escáner
      );
      html5QrcodeScanner.render(onScanSuccess, onScanError);

      // Verifica si el elemento existe
      if (readerElement) {
        // Crea un nuevo div
        var newDiv = document.createElement("div");

        // Añade la clase 'ocultar-i' al nuevo div
        newDiv.classList.add('ocultar-i');

        // Opcional: Añadir contenido al nuevo div
        newDiv.innerHTML = "<div style='position: absolute !important; background-color: rgb(181, 57, 57) !important; height: 50px !important; width: 50px !important; right: 0 !important; top: 0 !important; z-index: 100 !important; background: var(--bg-color) !important;'></div>"

        // Añade el nuevo div como hijo del elemento "reader"
        readerElement.appendChild(newDiv);
      }
    }
  }
}
window.addEventListener('popstate', function () {
  if (vistaUnica.value == true && vistaBusqueda.value === 'Productos') {
    cerrarProducto()
  } else {
    history.go(-1);
  }
});


const todosUsuarios = ref([]);
const busquedaUsuarios = ref("")
let offset = 0;
const limit = 9;
let loading = false;

const cargarUsuarios = async () => {
  if (loading) return;
  loading = true;

  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .ilike('nombre', `%${busquedaUsuarios.value}%`) // Filtrar por el nombre del usuario
      .or('gymtag.ilike.*%', `%${busquedaUsuarios.value}%`)
      .range(offset, offset + limit - 1);

      console.log(usuarios)
    if (error) {
      console.error(error);
      loading = false;
      return;
    }

    // Añadir las nuevas usuarios a las existentes
    todosUsuarios.value.push(...usuarios);
    offset += limit;
    loading = false;
  } catch (error) {
    console.error(error);
    loading = false;
  }
};

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    cargarUsuarios();
  }
};

onMounted(() => {
  buscarProductos()
  cargarUsuarios();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(busquedaUsuarios, cargarUsuarios);
</script>

<template>
  <div class="buscador">
    <div class="filtros">
      <button @click="cambiarVista('Usuarios')"
        :class="{ filtroSeleccionado: vistaBusqueda === 'Usuarios', filtrosNoSeleccionado: vistaBusqueda !== 'Usuarios' }">Gym
        Bros</button>
      <button @click="cambiarVista('Publicaciones')"
        :class="{ filtroSeleccionado: vistaBusqueda === 'Publicaciones', filtrosNoSeleccionado: vistaBusqueda !== 'Publicaciones' }">Publicaciones</button>
      <button @click="cambiarVista('Productos')"
        :class="{ filtroSeleccionado: vistaBusqueda === 'Productos', filtrosNoSeleccionado: vistaBusqueda !== 'Productos' }">Productos</button>
    </div>
  </div>
  <!-- <div v-if="tiempoCarga !== null">
    Tiempo de carga: {{ tiempoCarga }} ms
  </div> -->
  <div v-if="vistaBusqueda === 'Usuarios'" class="usuarios">
    <div class="search-producto">
      <font-awesome-icon class="lupa" :icon="['fas', 'magnifying-glass']" />
      <input type="text" v-model="busquedaUsuarios" />
      <font-awesome-icon class="cross" :icon="['fas', 'xmark']" @click="borrarUsuario" />
    </div>
    <div class="vista-usuarios">
      <template v-for="usuario in todosUsuarios" :key="usuario.id">
        <RouterLink :to="{ name: 'profile', params: { gymtag: usuario.gymtag } }" class="usuario-card-link">
          <div class="usuario-card">
            <img :src="usuario.fotoPerfil" alt="Foto de perfil" class="usuario-foto" />
            <div class="usuario-info">
              <h2>{{ usuario.gymtag }}</h2>
              <p>{{ usuario.nombre }} {{ usuario.apellidos }}</p>
            </div>
            <div class="usuario-estadisticas">
              <span>Seguidores: {{ usuario.numSeguidores }}</span>
              <span>Seguidos: {{ usuario.numSeguidos }}</span>
              <span>Publicaciones: {{ usuario.cantidadPublicaciones }}</span>
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
  </div>
  <div class="productos-comun" v-if="vistaBusqueda === 'Productos'">
    <div class="search-producto">
      <font-awesome-icon class="lupa" :icon="['fas', 'magnifying-glass']" />
      <input type="text" v-model="busquedaAlimento" />
      <font-awesome-icon class="cross" :icon="['fas', 'xmark']" @click="borrar" />
    </div>
    <div class="scanner-padre">
      <button class="btn-scanner" @click="mostrarScanner()">Escanear producto</button>
      <div id="reader"></div>
      <div id="result"></div>
    </div>
    <div class="reja-productos" v-if="vistaUnica == false">
      <template v-for="producto in productos" :key="producto.code">
        <div class="mini-producto-padre">
          <div class="mini-producto" @click="mostrarProducto(producto.id)">
            <h2 v-if="(nombre(producto) + cantidad(producto)).length > 50" class="mini-nombre">{{ (nombre(producto) &&
          cantidad(producto)) ? (nombre(producto) +
            cantidad(producto)).slice(0, 50) : (nombre(producto) !== false ? nombre(producto) : producto.id) }}...
            </h2>
            <h2 v-if="(nombre(producto) + cantidad(producto)).length <= 50" class="mini-nombre">{{ (nombre(producto) &&
          cantidad(producto)) ? (nombre(producto) +
            cantidad(producto)) : (nombre(producto) !== false ? nombre(producto) : producto.id) }}</h2>
            <div class="mini-img">
              <img :src="imagen(producto)" />
            </div>

            <div class="mini-scores">
              <img :src="urlNutriScore(producto)" class="mini-nutri" />
              <img :src="urlNovaScore(producto)" class="mini-nova" />
              <img :src="urlEcoScore(producto)" class="mini-eco" />
            </div>
          </div>

        </div>
      </template>
    </div>

    <div class="pagination-controls" v-if="buscado && vistaUnica == false">
      <button @click="paginaAnterior" :disabled="pagina === 1">Previous</button>
      <span>{{ pagina }} / {{ totalPaginas }}</span>
      <button @click="paginaSiguiente" :disabled="pagina === totalPaginas">Next</button>
    </div>
  </div>

  <div v-if="vistaUnica == true && vistaBusqueda === 'Productos'" class="productos">
    <div class="producto-arriba">
      <font-awesome-icon @click="cerrarProducto()" class="cross-interno" :icon="['fas', 'xmark']" />
      <div class="producto-img">
        <img :src="ProductoFoto" alt="" class="img-producto" />
      </div>
      <div class="producto-general">
        <div class="general-texto">
          <h2 class="producto-nombre">{{ ProductoNombre !== false ? ProductoNombre : codigo }}</h2>

          <p class="producto-cantidad">
          <div>Cantidad: </div>{{ ProductoCantidad && ProductoCantidad.trim() !== '' ? ProductoCantidad : '?' }}.</p>
          <p class="producto-ingredientes">
          <div>Ingredientes: </div>{{ ProductoIngredientes ?? '?' }}.</p>
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
          <div class="th">Por 100 g / 100 ml</div>
        </div>
        <div class="tr">
          <div>Energía</div>
          <div>{{ ProductoKjul_100 ?? '?' }} Kj <br> {{ ProductoKcal_100 ?? '?' }} Kcal</div>
        </div>
        <div class="tr">
          <div>Grasas</div>
          <div>{{ ProductoFat_100 ?? '?' }} {{ ProductoFatUnit }}</div>
        </div>
        <div class="tr">
          <div>Grasas saturadas</div>
          <div>{{ ProductoSaturedFat_100 ?? '?' }} {{ ProductoSaturedFatUnit }}</div>
        </div>
        <div class="tr">
          <div>Carbohidratos</div>
          <div>{{ ProductoCarbohydrates_100g ?? '?' }} {{ ProductoCarbohydratesUnit }}</div>
        </div>
        <div class="tr">
          <div>Fibra</div>
          <div>{{ ProductoFiber_100 ?? '?' }} {{ ProductoFiberUnit }}</div>
        </div>
        <div class="tr">
          <div>Proteinas</div>
          <div>{{ ProductoProteins_100 ?? '?' }} {{ ProductoProteinsUnit }}</div>
        </div>
        <div class="tr">
          <div>Sal</div>
          <div>{{ ProductoSalt_100 ?? '?' }} {{ ProductoSaltUnit }}</div>
        </div>
        <div class="tr">
          <div>Azucar</div>
          <div>{{ ProductoSugars_100 ?? '?' }} {{ ProductoSugarsUnit }}</div>
        </div>
        <div class="tr">
          <div>Alcohol</div>
          <div>{{ ProductoAlcohol_100 ?? '?' }} {{ ProductoAlcoholUnit }}</div>
        </div>
      </div>
      <div class="tabla-nutriscore">
        <div class="positive-points points">
          <h3>Puntos positivos: {{ ProductoPositivePoints ?? '?' }}</h3>
          <span>Proteinas: {{ ProductoProteinsPoints ?? '?' }}/5</span>
          <span>Fibra: {{ ProductoFiberPoints ?? '?' }}/5</span>
          <span>Frutas, vegetales, nueces y aceites de colza/nuez/oliva : {{ ProductoFruitsPoints ?? '?' }}/5</span>

        </div>
        <div class="negative-points points">
          <h3>Puntos negativos: {{ ProductoNegativePoints ?? '?' }}</h3>
          <span>Energía: {{ ProductoEnergyPoints ?? '?' }}/10</span>
          <span>Azucares: {{ ProductoSugarsPoints ?? '?' }}/10</span>
          <span>Grasas saturadas: {{ ProductoSaturatedPoints ?? '?' }}/10</span>
          <span>Sodio: {{ ProductoSodiumPoints ?? '?' }}/10</span>
        </div>
      </div>
      <div class="nutriscore-points">
        <img class="total-nutriscore" :src="ProductoNutriScore" alt="" />
        <h3>Puntuación total: {{ ProductoNutriScorePoints ?? '?' }}</h3>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* img[alt="info icon"] {
  width: 32px !important;  Cambiar el tamaño del ancho 
  height: 32px !important; Cambiar el tamaño de la altura 
} */

.usuarios {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.vista-usuarios {
  width: 80%;
  margin-left: 60px;
  margin-top: -25px;
}

.usuario-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 3px solid black;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
  border-color: black;
  background-color: var(--blue);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 1s ease, background-color 0.65s ease;
}

.usuario-foto {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border-style: inherit;
  border-color: black;
  margin-right: 20px;
  object-fit: cover;
  transition: transform 1s ease, border-color 0.65s ease;
}

.usuario-info {
  flex: 1;
}

.usuario-info h2 {
  margin: 0;
  font-size: 1.3em;
  font-style: bold;
}

.usuario-info p {
  margin: 5px 0;
}

.usuario-estadisticas {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.usuario-estadisticas span {
  margin: 2px 0;
  font-size: 1.1em;
}

.usuario-card-link {
  text-decoration: none;
  color: inherit;
}

.usuario-card:hover {
  background-color: #0c1f49;
  scale: 0.995;
}

.usuario-foto:hover,
.usuario-info:hover,
.usuario-info h2:hover,
.usuario-info h2:hover,
.usuario-info p:hover,
.usuario-estadisticas:hover,
.usuario-estadisticas span:hover,
.usuario-card-link:hover {
  color: aliceblue;
}

.usuario-foto:hover {
  border-color: aliceblue;
}

.buscador {
  margin: 80px 0 0 60px;
}

.filtros * {
  width: 33.33%;
  padding: 10px;
  font-weight: bold;
  border: 1px solid black;
  height: 37px;
}

.filtroSeleccionado {
  background-color: var(--dark-blue);
  color: var(--light-blue-text);
}

.filtrosNoSeleccionado {
  background-color: var(--light-blue-text);
  color: var(--dark-blue);
}

.productos-comun {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.search-producto {
  position: relative;
  width: 40%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
  margin-left: 60px;
}

.search-producto .lupa {
  position: absolute;
  height: 65%;
  left: 5px;
}

.search-producto input {
  height: 100%;
  width: 100%;
  padding-left: 30px;
  padding-right: 5px;
  font-size: 18px;
  border: 2px solid var(--dark-blue);
  border-radius: 8px;
}

.search-producto input:focus {
  outline: none;
}

.search-producto .cross {
  position: absolute;
  right: 5px;
  height: 65%;
}

.search-producto .cross:hover {
  cursor: pointer;
}

.scanner-padre {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 60px;
  margin-bottom: 20px;
}

.btn-scanner {
  width: 20%;
  min-width: 250px;
  margin: auto;
  margin-bottom: 10px;
  background-color: var(--blue-inputs);
  border: 2px solid var(--dark-blue);
  padding: 5px;
  color: var(--light-blue-text);
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.496);
}

.btn-scanner:hover {
  cursor: pointer;
  box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.8);

}

#result {}

#reader {
  position: relative;
  margin-top: 10px;
  width: 60%;
}

.ocultar-i {
  position: absolute !important;
  background-color: rgb(181, 57, 57) !important;
  height: 150px !important;
  width: 50px !important;
  right: 0 !important;
  z-index: 100 !important;
  background: var(--bg-color) !important;
}

.reja-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  width: 70%;
  margin-left: 60px;
}

.mini-producto-padre {
  display: flex;
  justify-content: center;
}

.mini-producto {
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  height: 320px;
  background-color: white;
  border-radius: 10px;
}

.mini-nombre {
  width: 80%;
  height: 20%;
  font-size: clamp(9px, 1.4em, 20px);
  margin: 10px;
  margin-left: 15px;
}

.mini-img {
  height: 55%;
  background-color: white;
  padding: 10px;
}

.mini-img img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.mini-scores {
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 5px;
}

.mini-nutri {
  max-height: 75%;
  max-width: 30.33%;
}

.mini-nova {
  height: 70%;
}

.mini-eco {
  max-width: 25.33%;
}

@media(max-width: 1100px) {
  .reja-productos {
    width: 90%;

  }

  .mini-producto {
    width: 250px;
  }
}

@media(max-width: 875.5px) {
  .buscador {
    margin: 60px 0 0 0px;
  }

  .vista-usuarios {
    width: 95%;
    margin-left: 0px
  }

  .usuario-card {
    margin-left: 0px;
  }

  .search-producto {
    width: 70%;
    margin-left: 0;
  }

  .scanner-padre {
    margin-left: 0;
  }

  .reja-productos {

    margin-left: 0;

  }

  .mini-producto {
    width: 100%;
  }
}


@media(max-width:566.5px) {
  .mini-producto {
    width: 80%;
  }
}

.productos {
  margin-left: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.producto-arriba {
  position: relative;
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

.cross-interno {
  font-size: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
}

.cross-interno:hover {
  cursor: pointer;
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
  margin-top: 10px;
  margin-bottom: 20px;
}

.producto-cantidad div {
  margin-right: 5px;
}

.general-scores {
  display: flex;
  align-items: center;
  width: 60%;
  margin: 20px auto
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
  border-radius: 7%;
}

.producto-ecoscore {
  width: 40%;
  max-width: 200px;
}

.producto-nutrientes {
  margin-bottom: 80px;
  border-radius: 25px;
  background-color: #5984df;
  padding: 24px;
  border: 2px solid black;
  width: 80%;
}

.tabla-nutrientes {
  border: 1px solid black;
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
}

.tabla-nutrientes .th {
  display: flex;
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
  gap: 10%;
}

@media (max-width: 875px) {
  .productos {
    margin-left: 0;
  }

  .producto-arriba {
    flex-direction: column;
    align-items: center;
    max-height: fit-content;
    justify-content: center
  }

  .cross-interno {
    top: 10px;
    right: 10px;
  }

  .producto-img {
    min-width: 100%;
    width: fit-content;
    max-width: 100%;
    min-height: auto;

    max-height: 600px;
    margin: 0;
  }

  .img-producto {
    height: 30%;
    /* min-height: 200px; */
    margin: 0;

  }

  .tabla-nutriscore {
    display: block;
    width: 100%;
  }

  .points {
    width: 100%;
  }

  .producto-general h2 {
    text-align: center;
  }

  .total-nutriscore {
    width: 40%;
  }

  .general-scores {
    margin: auto;
    width: 80%;
    justify-content: center;
  }

  .producto-nutriscore {
    /* min-width: 60px; */
  }

  .producto-novagroup {
    /* min-width: 30px; */

  }

  .producto-ecoscore {
    /* min-width: 60px; */

  }

}

@media (max-width: 655px) {
  .points {
    margin: 20px 0;
  }

  .search-producto {
    width: 95%;
  }
}

@media (max-width: 450px) {
  .btn-scanner {
    width: 50%;
    min-width: 60px;
    font-size: 1em;
  }

  .tr {
    font-size: 0.8em;

  }

  .tr .th {
    font-size: 0.9em;
  }

}
</style>