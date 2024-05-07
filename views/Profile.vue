<script setup>
import { ref, onMounted } from "vue";
import { usandoMovil } from "../main";
import Publicacion from "../components/Publicacion.vue";
import editProfile from "../components/EditProfile.vue";
import Tabla from "@/components/Tabla.vue";

function arriba() {
  window.scrollTo(0, 0);
}

const gymTag = ref("GymTag");
const sobreMi = ref(
  "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
);
const editing = ref(false);
const seguidores = ref(0);
const seguidos = ref(0);
const publicaciones = ref(0);

const vista = ref(sessionStorage.getItem("vista") || "Publicaciones");
function cambiarVista(tipo) {
  vista.value = tipo;
  sessionStorage.setItem("vista", tipo); // Guardar la vista seleccionada en el almacenamiento local
}
onMounted(() => {
  if (!sessionStorage.getItem("vista")) {
    sessionStorage.setItem("vista", "Publicaciones"); // Establecer la vista predeterminada si no hay una vista almacenada
  }
});
</script>

<template>
  <button @click="arriba" id="arriba">Volver arriba</button>
  <div class="perfil" :class="{ usandoMovil: usandoMovil }">
    <div id="info">
      <div id="info-top">
        <div id="foto-gymTag">
          <div id="foto"></div>
          <h2 id="gymTag">
            {{ gymTag }}
          </h2>
        </div>
        <div id="sobre-mi">
          <h2>Nombre y Apellidos</h2>
          <p>{{ sobreMi }}</p>
          <button @click="cambiarVista('editProfile')">Editar Perfil</button>
        </div>
      </div>
      <div id="info-bot">
        <div id="seguidores">
          <h2>Seguidores</h2>
          {{ seguidores }}
        </div>
        <div id="seguidos">
          <h2>Seguidos</h2>
          {{ seguidos }}
        </div>
        <div id="publicaciones">
          <h2>Publicaciones</h2>
          {{ publicaciones }}
        </div>
      </div>
    </div>
    <div id="contenido">
      <div id="botones">
        <button @click="cambiarVista('Publicaciones')">Publicaciones</button>
        <button @click="cambiarVista('Tablas')">Tablas</button>
        <button @click="cambiarVista('Estadisticas')">Estadisticas</button>
      </div>
      <div v-if="vista == 'Publicaciones'" id="publicaciones" class="vista">
        <template v-for="n in 50" :key="n">
          <Publicacion />
        </template>
      </div>
      <div v-if="vista == 'Tablas'" id="tablas" class="vista">
        <template v-for="n in 50" :key="n">
          <Tabla />
          tttttt
        </template>

      </div>
      <div v-if="vista == 'Estadisticas'" id="estadisticas" class="vista">
        aaaa
      </div>
      <div v-if="vista == 'editProfile'" id="edit-profile" class="vista">
        <editProfile/>
        vvvvvv
      </div>
    </div>
  </div>
</template>

<style scoped>
#arriba {
  position: fixed;
  top: 40px;
  right: 20px;
}

.perfil {
  margin-top: 80px;
  background-color: rgb(179, 255, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  overflow-y: visible;
}

#info {
  background-color: green;
  min-height: fit-content;
  width: 70%;
}

#info-top {
  display: flex;
  justify-content: center;
  margin: 10px;
}

#foto-gymTag {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  width: 40%;
}

#foto {
  background-color: blue;
  min-width: 150px;
  min-height: 150px;
  width: 20vw;
  height: 20vw;
  max-width: 250px;
  max-height: 250px;
  border: 2px solid black;
  border-radius: 50%;
}

#sobre-mi {
  position: relative;
  margin-top: 25px;
  width: 60%;
  max-width: 500px;
  height: fit-content;
  padding-bottom: 20px;
}

#sobre-mi p {
  margin-top: 10px;
  margin-bottom: 20px;
  word-wrap: break-word;
  /* Para navegadores antiguos */
  overflow-wrap: break-word;
  max-height: calc(1.2em * 6);
  /* Aproximadamente 7 líneas */
  overflow: hidden;
}

#sobre-mi button {
  position: absolute;
  right: 0;
  margin: 0;
}

#gymTag {
  margin-top: 10px;
}

#info-bot {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  margin-bottom: 20px;
}

#contenido {
  width: 70%;
}

#botones {
  width: 100%;
  position: sticky;
}

#botones button {
  width: 33.3333%;
  padding: 10px;
}

.vista {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  /* Centra el contenido horizontalmente */
  justify-content: center;
  /* Centra el contenido verticalmente */
}
.vista #publicacion {
  padding: 0;
}
@media (max-width: 875px) {
  .perfil {
    margin: 60px 0 0 0;
  }

  #info {
    width: 100%;
  }

  #contenido {
    width: 100%;
  }
}

.usandoMovil {
  margin: 0;
}
</style>
