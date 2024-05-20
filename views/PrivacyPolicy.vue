<template>
  <div class="container_info">
    <h1>Información legal de GymBros Zone</h1>
    <p><b>Fecha efectiva: 1 de enero, 2024</b></p>
    <h2>1. Términos de uso</h2>
    <p>
      El acceso y uso de GymBros Zone implica la aceptación de estos términos y
      condiciones. No está permitido el uso del sitio para actividades ilegales,
      fraudulentas, o que infrinjan los derechos de autor. Cualquier contenido
      publicado en los foros de GymBros Zone es responsabilidad de los usuarios,
      y GymBros Zone se reserva el derecho de eliminar contenido que considere
      inapropiado o que infrinja estos términos.
    </p>

    <h2>2. Derechos de autor y propiedad intelectual</h2>
    <p>
      Todos los contenidos de GymBros Zone, incluyendo textos, gráficos, logos,
      y software son propiedad de GymBros Zone o de sus respectivos autores y
      están protegidos por las leyes de derechos de autor. Se prohíbe cualquier
      uso que no esté expresamente autorizado por GymBros Zone o por los
      titulares de los derechos.
    </p>

    <h2>3. Uso de los foros y comunidad</h2>
    <p>
      Los foros de GymBros Zone son espacios para el intercambio de información
      y experiencias entre aficionados al fitness y la vida saludable. Se espera
      que los usuarios mantengan un ambiente respetuoso y constructivo. No se
      tolerará el acoso, el spam, ni el uso de lenguaje ofensivo.
    </p>

    <h2>4. Responsabilidades de los usuarios</h2>
    <p>
      Los usuarios son responsables de mantener la confidencialidad de sus
      cuentas y contraseñas. GymBros Zone no será responsable de los daños
      causados por el uso indebido de cuentas de usuario. Se espera que los
      usuarios informen inmediatamente sobre cualquier uso no autorizado de sus
      cuentas.
    </p>

    <h2>5. Procedimiento para reclamos de derechos de autor</h2>
    <p>
      Si un usuario o un tercero considera que su trabajo ha sido copiado de una
      manera que constituye una violación de los derechos de autor, puede
      contactar a GymBros Zone a través de legal@gymbroszone.com con la
      información detallada del material en cuestión y la prueba de propiedad
      del derecho de autor.
    </p>

    <h2>6. Limitación de responsabilidad</h2>
    <p>
      GymBros Zone no asume responsabilidad por los daños que puedan derivarse
      del acceso o uso del sitio, incluyendo pero no limitado a interrupciones
      del servicio, virus informáticos, o fallos en el sistema. Asimismo,
      GymBros Zone no garantiza la exactitud, integridad o utilidad de la
      información proporcionada en el sitio.
    </p>

    <h2>7. Política de enlaces a terceros</h2>
    <p>
      GymBros Zone puede contener enlaces a sitios web de terceros. Estos
      enlaces se proporcionan únicamente como una comodidad y no implican un
      aval o aprobación por parte de GymBros Zone de los contenidos de dichos
      sitios externos.
    </p>

    <h2>8. Cambios en la información legal</h2>
    <p>
      GymBros Zone se reserva el derecho de modificar esta información legal en
      cualquier momento. Los cambios serán publicados en esta página y serán
      efectivos inmediatamente. Se aconseja a los usuarios revisar
      periódicamente esta sección para estar informados de cualquier cambio.
    </p>

    <h2>9. Jurisdicción y ley aplicable</h2>
    <p>
      Los conflictos legales relacionados con el uso de GymBros Zone estarán
      sujetos a las leyes del país sede de GymBros Zone, y cualquier disputa
      será resuelta en los tribunales competentes de dicho país.
    </p>

    <h2>10. Contacto</h2>
    <p>
      Para cualquier consulta o inquietud relacionada con esta información
      legal, por favor contacta con nosotros en legal@gymbroszone.com.
    </p>
  </div>
  <Router-link to="/">
    <div class="todo_boton">
    <button>Volver</button>
  </div>
  </Router-link>
</template>

<style scoped>
.info {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Times New Roman", Times, serif;
  background-color: var(--azul-muy-claro);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

.container_info {
  width: 85%;
  padding: 20px;
  background-color: var(--blue);
  border-radius: 5px;
/*   margin: 75px auto; */
/*   box-shadow: 0 2px 5px var(--verde-oscuro-degradado);
  border: 3px solid var(--gris-oscuro); */
  border-radius: 50px;
  margin-left: 8%;
  margin-top: 8%;
  background: linear-gradient(145deg, var(--blue), var(--dark-blue));
  box-shadow: 1px 1px 6px var(--alt-black), -1px -1px 4px var(--alt-black);
}

.container_info h1 {
  color: aliceblue;
  text-align: center;
  margin-bottom: 20px;
}

.container_info h2 {
  color: aliceblue;
  margin-top: 22px;
  margin-bottom: 1.3%;
  text-decoration: underline;
}

.container_info p,
.container_info li {
  color: aliceblue;
  line-height: 1.6;
}

.todo_boton {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 5%;
}

.todo_boton button {
  width: 125px;
  padding: 4px 10px;
  font-size: 20px;
  border-radius: 4px;
  font-weight: bold;
  /* border: 1px solid white; */
  background-color: var(--blue);
  color: aliceblue;
  transition: background-color 0.1s, color 0.2s, box-shadow 0.05s;
}

.todo_boton button:hover,
.todo_boton button:active {
  cursor: pointer;
  border-radius: 4px;
  /* border: 2px solid white; */
  /* background-color: #ee9657; */
  /* color: white; */
  padding: 3px 10px;
  /* box-shadow: 1px 1px 8px rgba(255, 255, 255, 0.863); */
}

@media (max-width: 1800px) {
  .todo-section {
    margin-top: 9%;
  }
}

@media (max-width: 1440px) {
  .container_info {
    margin-top: 10%;
  }
}

@media (max-width: 1100px) {
  .container_info {
    margin-top: 13%;
  }
}

@media (max-width: 875px) {
  .container_info {
    margin-top: 20%;
  }
}

@media (max-width: 600px) {
  .container_info {
    margin-top: 40%;
  }
}
</style>
