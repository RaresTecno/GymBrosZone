<script setup>

</script>
<template>
  <header>
    <img src="../assets/img/logo.png">
    <h1>GymBros Zone</h1>
    <div v-if="false" id="loged">
      <RouterLink to="" id="btn-profile">Mi cuenta</RouterLink>
    </div>

    <div v-if="true" id="no-loged">
      <RouterLink to="/" class="btn-loged" id="btn-login">Login</RouterLink>
      <RouterLink to="/profile" class="btn-loged" id="btn-register">Registro</RouterLink>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--dark-blue);
  height: 80px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border: 1px solid black;
  margin-right: 5%;
}

h1 {
  color: white;
  background-color: #3D5A98;
  padding: 5px 30px;
  border-radius: 25px;
}

#loged {
  margin-left: 4%;

}

#btn-profile {
  color: white;
  background-color: #3D5A98;
  border-radius: 25px;
  padding: 7px;
  font-weight: bold;
  border: none;
  text-decoration: none;

}

#no-loged {
  display: flex;
  justify-content: space-between;
}

.btn-loged {
  color: white;
  background-color: #3D5A98;
  border-radius: 25px;
  padding: 7px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

#btn-login {
  margin-right: 10px;

}
</style>