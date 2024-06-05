<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";
import { userId, supabase } from "../clients/supabase";

const gymTag = ref();
const fotoPerfil = ref();
async function cargarUsuario() {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select("*")
    .eq('id', userId.value);
  gymTag.value = usuario[0].gymtag;
  fotoPerfil.value = "https://subcejpmaueqsiypcyzt.supabase.co/storage/v1/object/public/files/" + usuario[0].fotoperfil;
}
cargarUsuario();
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

function reloadPage(event) {
  event.preventDefault();
  const url = `${window.location.origin}${event.target.closest('a').getAttribute('href')}`;
  window.location.href = url;
}
</script>

<template>
  <transition name="slide-fade" mode="out-in">
    <nav :style="{ top: altura + 'px' }">
      <div v-if="gymTag">
        <RouterLink :to="{ name: 'profile', params: { gymtag: gymTag } }" @click="reloadPage" class="RouterLink">
          <div class="icono"><img :src="fotoPerfil" class="imgperfil" /></div>
          <h2>Perfil</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'house']" /></div>
          <h2>Home</h2>
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
        <RouterLink to="/liked" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon" :icon="['fas', 'heart']" /></div>
          <h2>Likes</h2>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/saved" class="RouterLink">
          <div class="icono"><font-awesome-icon class="icon guardado" :icon="['fas', 'bookmark']" /></div>
          <h2>Guardados</h2>
        </RouterLink>
      </div>
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
  height: 101vh;
  position: fixed;
  top: 80px;
  z-index: 100;
  transition: width 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

h2 {
  margin-left: 10px;
  width: 120px;
  transform: translateX(-190px);
  color: var(--dark-blue);
  transition: color 0.5s;
}

nav:hover {
  width: 190px;
  box-shadow: 2px -2px 5px var(--black), 3px -4px 10px var(--black);
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
.imgperfil{
  border-radius: 50px;
  border: 1px solid var(--light-blue-text);
  width: 40px;
  height: 40px;
  margin: -2px;
  object-fit: cover;
}
</style>
