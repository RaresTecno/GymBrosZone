<script setup>
import { ref } from 'vue';
const gymTag = ref("GymTag");
const sobreMi = ref("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
const editing = ref(false);

function edit() {
    editing.value = true;
}
</script>

<template>
    <div id="perfil" v-if="!editing">
        <div id="info">
            <div id="info-top">
                <div id="foto-gymTag">
                    <div id="foto">
        
                    </div>
                    <h2 id="gymTag">
                        {{ gymTag }}
                    </h2>
    
                </div>
                <div id="sobre-mi">
                    <h2>Nombre y Apellidos</h2>
                    <p>{{ sobreMi }}</p>
                    <router-view></router-view>
                    
                </div>

            </div>

        </div>
        <div id="contenido">
            <div id="botones">

            </div>
            <div id="publicaciones">

            </div>
            <div id="tablas">
            </div>
            <div id="estadisticas">

            </div>
        </div>
    </div>
</template>

<style scoped>
    #perfil{
        margin-top: 80px;
        background-color: red;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 60px;

    }
    #info{
        background-color: green;
        height: 350px;
        width: 70%;
    }
    #info-top{
        display: flex;
        justify-content: center;
        margin: 10px;
    }
    #foto-gymTag{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px;
        width: 40%;
    }
    #foto{
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
    #sobre-mi{
        position: relative;
        margin-top: 25px;
        width: 60%;
        height: fit-content;
        padding-bottom: 20px;
    }
    #sobre-mi p{
        margin-top: 10px;
        margin-bottom: 20px;
        word-wrap: break-word; /* Para navegadores antiguos */
        overflow-wrap: break-word;
    }
    #sobre-mi button{
        position: absolute;
        right: 0;
    }
    #gymTag{
        margin-top: 10px;
    }
</style>