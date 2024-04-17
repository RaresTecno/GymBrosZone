<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted } from 'vue';

const posicionAnt = ref(0);
const mostrar = ref(true);
const altura = ref(80);
const windowWidth = ref(window.innerWidth);

function reposicionarBarra(){
  const posicionActual = window.scrollY;

  //hacerlo tambien primero con el width 
  if (windowWidth.value < 601) {
    if (posicionActual > 100) {
      altura.value = 0;
  
      if (posicionActual < posicionAnt.value) {
          altura.value = 163;
  
      }
    } else {
      altura.value = 163;
  
    }
}else if(windowWidth.value < 875){
    if (posicionActual > 100) {
      altura.value = 0;
  
      if (posicionActual < posicionAnt.value) {
          altura.value = 94;
  
      }
    } else {
      altura.value = 94;
  
    }
}else {
    if (posicionActual > 100) {
      altura.value = 0;
  
      if (posicionActual < posicionAnt.value) {
          altura.value = 80;
  
      }
    } else {
      altura.value = 80;
  
    }
  
}
  posicionAnt.value = posicionActual;
}
function updateWidth() {
  windowWidth.value = window.innerWidth;
    reposicionarBarra();
}
onMounted(() => {
    window.addEventListener('scroll', reposicionarBarra);
    window.addEventListener("resize", updateWidth);
});
</script>

<template>
    <nav :style="{ top: altura + 'px' }">
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'house']" />
            <h2>Home</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'circle-plus']" />
            <h2>Publicar</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" />
            <h2>Buscar</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'heart']" />
            <h2>Likes</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'bookmark']" />
            <h2>Guardados</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'table']" />
            <h2>Tablas</h2>
        </div>
        <div>
            <font-awesome-icon class="icon" :icon="['fas', 'comment-dots']" />
            <h2>Mensajes</h2>
        </div>
    </nav>
</template>

<style scoped>
nav {
    background-color: var(--dark-blue);
    color: white;
    width: 60px;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    height: 100vh;
    position: fixed;
    top: 80px;
}

h2 {
    display: none;
    margin-left: 10px;
}

nav:hover {
    width: fit-content;
}

nav:hover h2 {
    display: inline;
}

div {
    display: flex;
    align-items: center;
    margin-top: 20px;
    cursor: pointer;
}

.icon {
    color: white;
    width: 36px;
    height: 36px;
}
</style>