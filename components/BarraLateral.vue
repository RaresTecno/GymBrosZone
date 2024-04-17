<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";

const posicionAnt = ref(0);
const altura = ref(80);
const windowWidth = ref(window.innerWidth);

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
  <nav :style="{ top: altura + 'px' }">
    <div>
      <RouterLink to="/" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'house']" />
        <h2>Home</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Profile" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'user']" />
        <h2>Perfil</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Publicar" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'circle-plus']" />
        <h2>Publicar</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Search" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" />
        <h2>Buscar</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Likes" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'heart']" />
        <h2>Likes</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Keep" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'bookmark']" />
        <h2>Guardados</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Tables" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'table']" />
        <h2>Tablas</h2>
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/Messages" class="RouterLink">
        <font-awesome-icon class="icon" :icon="['fas', 'comment-dots']" />
        <h2>Mensajes</h2>
      </RouterLink>
    </div>
  </nav>
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
}

h2 {
  display: none;
  margin-left: 10px;
  color: var(--light-blue-text);
}

nav:hover {
  width: fit-content;
}

nav:hover h2 {
  display: inline;
}

div .RouterLink {
  display: flex;
  align-items: center;
  margin-top: 20px;
  cursor: pointer;
}

.icon {
  color:var(--light-blue-text);
  width: 36px;
  height: 36px;
}
</style>
