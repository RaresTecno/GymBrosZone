<script setup></script>

<template>
  <main>
    <div class="sub-header">
      <img src="assets/" alt="logo" class="logo" />
      <h1 class="title">GymBros Zone</h1>
    </div>
    <div class="container_log-or-reg">
      <div class="login_or_register">
        <p>
          <i>Inicia Sesión</i> o <i>Regístrate</i> para acceder a GymBros Zone
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sub-header {
  background-color: var(--dark-blue);
  text-align: center;
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 3px solid #292823bf;
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
}
.title {
  color: aliceblue;
  font-size: 35px;
  font-family: "BioRhyme", serif;
  font-weight: bold;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "width" 100;
}
.logo {
  margin-right: 20px;
}
.login_or_register {
  color: aliceblue;
  text-align: center;
  font-size: 15px;
  font-family: "BioRhyme", serif;
  font-weight: bold;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "width" 100;
  padding: 5px;
  border-radius: 2px;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.349), 0 0 20px white;
}
.container_log-or-reg {
  border-radius: 4px;
  margin: 15px 15px 30px;
  padding: 20px 30px;
  background-color: var(--dark-blue);
  box-shadow: 0 2px 5px var(--alt-black);
  border: 3px solid black;
  width: 85%;
}
</style>