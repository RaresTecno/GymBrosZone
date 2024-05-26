<script setup>
import Publicacion from "../components/Publicacion.vue";
import { supabase, userActive } from "../clients/supabase";
import { usandoMovil, disponible } from "../main";
import { ref, reactive } from "vue"
const todasPublicaciones = ref()
const idPublicacion = ref()
const cantidadPublicaciones = ref()

async function mostrarp() {
  try {
    const { data: publicaciones, error } = await supabase
      .from('publicaciones')
      .select('*');

    todasPublicaciones.value = publicaciones.reverse()

  } catch (error) {

  }
}
mostrarp()




disponible.value = true;
</script>

<template>
  <main>
    <div v-if="!userActive" class="todo-section">
      <div class="section-container">
        <div class="section">
          <img src="../assets/img/GymBrosLanding2.jpeg" alt="imagen 2" class="section-image straight" />
          <div class="section-text">
            <h2>Bienvenido a GymBros Zone</h2>
            <p>
              Inicia sesión o regístrate para acceder a GymBros Zone y disfrutar
              de todos los beneficios que ofrecemos para tu entrenamiento.
            </p>
            <div class="buttons">
              <RouterLink to="/login">
                <button class="button-login_register">Login</button>
              </RouterLink>
              <RouterLink to="/register">
                <button class="button-login_register">Registro</button>
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-text">
            <h2>¿Qué ofrecemos?</h2>
            <p>
              GymBros Zone es una red social diseñada específicamente para entusiastas del fitness y la nutrición.
              Conecta con otros usuarios de gimnasio, comparte fotos e historias de tu progreso, crea publicaciones,
              establece objetivos o marcas y descubre nuevas dietas y rutinas de ejercicios. La plataforma incluye
              características únicas como la capacidad de escanear alimentos mediante códigos de barras para obtener
              información nutricional instantánea.
            </p>
            <RouterLink to="/privacy">
              <div class="privacy-link">Política de Privacidad</div>
            </RouterLink>
          </div>
          <img src="../assets/img/GymBrosLanding1.jpeg" alt="imagen 1" class="section-image reverse" />
        </div>
      </div>
    </div>
    <div v-if="userActive" class="publicaciones">
      <div class="vista">
        <template v-for="publicacion in todasPublicaciones" :key="publicacion.idpublicacion">
          <Publicacion :id="publicacion.idpublicacion" :ProfileView="false" />
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.todo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6%;
  margin-bottom: 1%;
}

.section-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 25px;
/*   background: linear-gradient(145deg, var(--blue), var(--alt-black)); */
/*   box-shadow: 3px 3px 3px var(--alt-black); */
  width: 80%;
}

.section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.85%;
  margin-bottom: 20px;
  width: 90%;
  color: aliceblue;
  border-radius: 25px;
  background: linear-gradient(145deg, var(--blue), var(--alt-black));
  box-shadow: 1px 1px 6px var(--alt-black), -1px -1px 4px var(--alt-black);
  flex-direction: row-reverse;
}

.section-image {
  width: 290px;
  height: auto;
  margin-top: 2%;
  margin-bottom: 2%;
  border-radius: 25px;
  background: linear-gradient(145deg, var(--blue), var(--alt-black));
  box-shadow: 1px 1px 6px var(--alt-black), -1px -1px 4px var(--alt-black);
}

.section .section-image .straight {
  margin-left: 10%;
}

.section .section-image .reverse {
  margin-right: 10%;
}

.section-text {
  max-width: 400px;
  text-align: center;
  margin: 5%;
}

.section-text h2 {
  margin-bottom: 10px;
  font-size: 24px;
}

.section-text p {
  margin: 0;
  font-size: 16px;
}

.buttons {
  margin-top: 40px;
}

.button-login_register {
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  padding: 10px 20px;
  margin: 3%;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  background: var(--blue);
  border: 2px solid var(--alt-black);
  border-radius: 0.75em;
  transition: background 150ms cubic-bezier(0, 0, 0.58, 1),
    transform 150ms cubic-bezier(0, 0, 0.58, 1);
}

.button-login_register:hover {
  background: aliceblue;
  color: black;
}

.privacy-link {
  margin-top: 5%;
  color: var(--blue);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.privacy-link:hover {
  color: aliceblue;
}

.privacy-link:visited {
  color: var(--alt-black);
}

.publicaciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  margin-bottom: 100px;
  padding-top: 50px;
}

.vista {
  margin-top: 35px;
  width: 60%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Centra el contenido verticalmente */
}

@media (min-width: 1800px) {
  .section-tex {
    margin-left: -10%;
  }
}

@media (max-width: 1800px) {
  .todo-section {
    margin-top: 7%;
  }
}

@media (max-width: 1440px) {
  .todo-section {
    margin-top: 8%;
  }
}

@media (max-width: 1100px) {
  main {
    margin-top: 60px;
  }

  .publicaciones {
    margin-left: 0;
    padding-top: 0;
  }

  .vista {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
  }

  .buttons {
    margin: 2%;
  }
}

@media (max-width: 875px) {
  .todo-section {
    margin-top: 17%;
  }

  .section {
    flex-direction: column;
  }

  .section-image {
    width: 250px;
    margin: 0 10px;
  }

  .section-tex {
    margin: 15%;
    overflow: auto;
  }

  .section-text h2 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 18px;
  }
  .vista{
    margin-top: 5px;

  }
}

@media (max-width: 625px) {
  main {
    margin-top: 35px;
  }

  .section-text p {
    margin: 0;
    font-size: 14px;
  }

  .publicaciones {
    margin-left: 0;
    padding-top: 30px;
  }

  .vista {
    width: 100%;
    margin: 0px;
  }
}

@media (max-width: 600px) {
  .todo-section {
    margin-top: 40%;
    width: 100%;
  }

  .section {
    width: 100%;
    margin: 5%;
    border-radius: 25px;
    background: linear-gradient(145deg, var(--blue), var(--alt-black));
    box-shadow: 1px 1px 6px var(--alt-black), -1px -1px 4px var(--alt-black);
  }

  .section-image {
    width: 250px;
  }

  .section-text {
    width: 250px;
  }

  .buttons {
    margin-top: 5px;
  }
}
</style>
