<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";
import { userActive } from "../clients/supabase";

const posicionAnt = ref(0);
const altura = ref(80);
const windowWidth = ref(window.innerWidth);

console.log('lateral:'+ userActive.value);
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
} else if (windowWidth.value < 875) {
  if (posicionActual > 100) {
    altura.value = 0;

    if (posicionActual < posicionAnt.value) {
      altura.value = 94;
    }
  } else {
    altura.value = 94;
  }
} else {
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

function reposicionarBarra() {
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
  } else if (windowWidth.value < 875) {
    if (posicionActual > 100) {
      altura.value = 0;

      if (posicionActual < posicionAnt.value) {
        altura.value = 94;
      }
    } else {
      altura.value = 94;
    }
  } else {
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
  window.addEventListener("scroll", reposicionarBarra);
  window.addEventListener("resize", updateWidth);
});
</script>

<template>
  <transition name="slide-fade" mode="out-in">
    <nav :style="{ top: altura + 'px' }">
      <div>
        <RouterLink to="/" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'house']" /></div>
          <h2>Home</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/profile" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon usuario" :icon="['fas', 'user']" /></div>
          <h2>Perfil</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/post" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'circle-plus']" /></div>
          <h2>Publicar</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/search" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" /></div>
          <h2>Buscar</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/likes" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'heart']" /></div>
          <h2>Likes</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/keep" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon guardado" :icon="['fas', 'bookmark']" /></div>
          <h2>Guardados</h2>
        </RouterLink>
      </div>
      <!-- <div>
        <RouterLink to="/tables" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'table']" /></div>
          <h2>Tablas</h2>
        </RouterLink>
      </div> -->
      <!-- <div>
        <RouterLink to="/messages" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'comment-dots']" /></div>
          <h2>Mensajes</h2>
        </RouterLink>
      </div> -->
    </nav>
  </transition>
</template>

<style scoped>
nav {
  background-color: var(--dark-blue);
  color: var(--light-blue-text);
  width: 60px;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  height: 100vh;
  position: fixed;
  top: 80px;
  /* transition: width 0.4s; */
  z-index: 100;
  transition: width 0.3s;
  overflow: hidden;
}

h2 {
  margin-left: 10px;
  width: 120px;
  /* display: none; */
  transform: translateX(-190px);
  color: var(--dark-blue);
  transition: color 0.5s;
}

nav:hover {
  width: 190px;
}

nav:hover h2 {
  display: inline;
  color: var(--light-blue-text);
  transform: translateX(0px);
}

div .RouterLink {
  display: flex;
  align-items: center;
  margin-top: 25px;
  cursor: pointer;
}

.icon {
  color: var(--light-blue-text);
  width: 36px;
  height: 36px;
}
</style>
