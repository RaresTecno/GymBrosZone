import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { userActive, userState, obtenerId } from "./clients/supabase";
export const disponible = ref();
disponible.value = true;

const navegador = ref(navigator.userAgent);
export const usandoMovil = ref();
async function init() {
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

  await userState();
  await obtenerId();
  library.add(fas);
  library.add(fab);
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

init();