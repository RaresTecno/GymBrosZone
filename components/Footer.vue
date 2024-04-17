<script setup>

</script>

<template>
  <footer>
    <div class="footer">
      <h5>GymBros Zone®</h5>
      <h5>2024 Todos los Derechos Reservados</h5>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--dark-blue);
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  bottom: 0;
  box-shadow: 2px 0 10px var(--black), 3px 0 15px var(--black);
}

h5 {
  margin: auto;
  color: aliceblue;
  padding: 5px 30px;
  border-radius: 25px;
}

.footer {
  display: flex;
  text-align: center;
  align-items: center;
}

@media(max-width: 820px){
  footer{
    display: flex;
    justify-content: space-around;
    padding: 0;
  }

  h5{
    display: block;
    width: 50%;
    padding: 0 15px;
  }
}
</style>
