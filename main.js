import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { userActive, userState } from "./clients/supabase";
export const disponible = ref();
disponible.value = true;

const navegador = ref(navigator.userAgent);
export const usandoMovil = ref();
async function init() {
  // Verificar el estado del usuario antes de montar la app
  const session = userActive;  // Obtener la sesión actual

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const user = session ? session.user : null; // Suponiendo que 'session' puede ser nulo si no hay usuario logueado

    if (requiresAuth && !user) {
      next({ name: 'login' });
    } else if (!requiresAuth && !user) {
      next({ name: 'home' });  // Asumiendo que quieres redirigir usuarios logueados fuera de páginas como login/register
    } else {
      next(); // Proceder normalmente si la ruta no requiere autenticación o el usuario está correctamente autenticado
    }
  });

 
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    usandoMovil.value = true;
  } else {
    usandoMovil.value = false;
  }

  userState();
  library.add(fas);
  library.add(fab);
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}









init();

