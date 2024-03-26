<script setup>

</script>

<template>
    <nav>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Home</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Publicar</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Buscar</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Likes</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Guardados</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Tablas</h2>
        </div>
        <div>
            <img src="../assets/icons/icono-casa.svg">
            <h2>Mensajes</h2>
        </div>
    </nav>
</template>

<style scoped>
nav{
    background-color: var(--dark-blue);
    color: white;
    height: calc(100vh - 80px);
    width: 60px;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
}
h2{
    display: none;
    margin-left: 10px;
}
nav:hover h2 {
    display: inline;
}
nav:hover{
    width: fit-content;
}
div{
    display: flex;
    align-items: center;
    margin-top: 20px;
    cursor: pointer;
}
img{
    height: 36px;
    color: white;
}
</style>