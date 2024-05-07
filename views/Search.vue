<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner } from "html5-qrcode";

const busqueda = ref("");

// API call function (ajustar según la API para códigos de barras)
async function verApi() {
  const url = `https://api.example.com/product/${busqueda.value}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
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
    formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.EAN_13]
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
  document.getElementById("result").innerHTML = `<h2>Success</h2><p>Scanned Barcode: ${result.decodedText}</p>`;
  if (scanner.value) {
    scanner.value.clear();
  }
  document.getElementById("reader").remove();
}

function error(err) {
  console.log("Error scanning Barcode:", err);
  document.getElementById("result").innerHTML = `<h2>Error</h2><p>Unable to detect Barcode. Please ensure the Barcode is visible and try again.</p>`;
}
</script>

<template>
  <div class="prueba">
    <input type="text" v-model="busqueda" />
    <button @click="verApi">Search Product</button>
  </div>
  <div id="reader"></div>
  <div id="result"></div>
</template>

<style scoped>
.prueba {
  margin: 100px;
}
</style>
