<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, watch } from "vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const posicionAnt = ref(0);
const mostrar = ref(true);

watch(() => route.path, (newPath) => {
  mostrar.value = newPath !== '/post' && newPath !== '/account';
}, { immediate: true });

function mostrarHeader() {
  const posicionActual = window.scrollY;

  if (posicionActual > 100) {
    mostrar.value = false;
    if (posicionActual < posicionAnt.value) {
      mostrar.value = true;
      watch(() => route.path, (newPath) => {
        mostrar.value = newPath !== '/post' && newPath !== '/account';
      }, { immediate: true });
      
    }
  } else {
    mostrar.value = true;
      watch(() => route.path, (newPath) => {
        mostrar.value = newPath !== '/post' && newPath !== '/account';
      }, { immediate: true });
  }
  posicionAnt.value = posicionActual;
}
onMounted(() => {
  window.addEventListener("scroll", mostrarHeader);
});
</script>

<template>
  <transition name="slide-fade" mode="out-in">
    <nav v-if="mostrar">
      <div class="botonesNav">
        <div class="logo_header">
          <RouterLink to="/" class="RouterLink">
            <img src="../assets/img/logo.png" />
          </RouterLink>
        </div>
        <div>
          <RouterLink to="/profile" class="RouterLink">
            <font-awesome-icon class="icon usuario" :icon="['fas', 'user']" />
          </RouterLink>
        </div>
      </div>
    </nav>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all ease;
  transform: translateY(-60px);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-60px);
  opacity: 0;
}
nav {
  background-color: var(--dark-blue);
  color: var(--light-blue-text);
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  z-index: 400;
  box-shadow: 2px 0 10px var(--black), 3px 0 15px var(--black);
}

nav .botonesNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

}

.logo_header img {
  width: 65px;
  height: 65px;
  border-radius: 50px;
}

div .RouterLink {
  display: flex;
  align-items: center;
  cursor: pointer;
}

nav > div {
  height: fit-content;
  margin: 0 20px;
}

.icon {
  color: var(--light-blue-text);
  width: 36px;
  height: 36px;
}

</style>
