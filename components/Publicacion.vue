<script setup>
import { ref } from 'vue';
import { supabase } from '@/clients/supabase';
const mostrarFinal = ref(false);

const mostrar = () => {
    document.body.style.overflow = 'hidden';
    mostrarFinal.value = true;
}
const cerrar = () => {
    document.body.style.overflow = 'visible';
    mostrarFinal.value = false;
}

const foto = supabase.storage.from('archivos-usuarios').getPublicUrl('imagen.jpg')

const ruta = ref( foto.data.publicUrl)
// :style="{ backgroundImage: 'url(' + ruta + ')' }"
</script>
<template>

    <div id="publicacion">
        
        <div @click="mostrar" id="inicial" >
            <img :src="ruta" >
            
        </div>
        <div id="final" v-if="mostrarFinal">
            <div id="contenido">
                <div @click="cerrar" id="cerrar">X</div>
                <div id="imagen">
                    <img :src="ruta" >
                </div>
                <div id="cuerpo">
                    <div id="encabezado">

                    </div>

                    <div id="descripcion">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#publicacion {
    display: flex;
    height: 100%;
    width: 100%;
    aspect-ratio: 1;
    position: relative;
}

#inicial {
    background: rgb(78, 78, 78);
    background-repeat:no-repeat;
    background-position: center;
    background-size: contain;
    height: 100%;
    width: 100%;
    border: 1px solid black;
}
#inicial img{
    height: 100%;
    width: 100%;
    object-fit: cover;
}

#final {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background-color: rgba(96, 96, 96, 0.507);
    z-index: 200;
}

#contenido {
    background-color: aquamarine;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    min-height: 500px;
    min-width: 500px;

    max-height: fit-content;
    max-width: fit-content;
}
#cerrar{
    position: absolute;
    top: 5px;
    left: 5px;
}
#imagen {
    background-color: burlywood;
    width: 500px;
    height: 500px;
}
#imagen img{
    width: 100%;
    height: 100%;
    object-fit: cover;

}
#cuerpo {
    background: black;
    width: 400px;
}
</style>