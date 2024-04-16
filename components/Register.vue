<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '../clients/supabase';

async function createAcount(){
    const { data, error} = await supabase.auth.signUp({
        email: email.value,
        password: password.value
    })
    if (error) {
        console.log(error);
    }else{
        console.log(data);
    }
}










const nombre = ref('');
const apellidos = ref('');
const gymtag = ref('');
const contraVisible = ref(false);
const contraVisible2 = ref(false);
const mostrarMensaje = ref(false);
const mensajeError = ref('');

const email = ref('');
const password = ref('');
const password2 = ref('');
const fecha_nacimiento = ref('');

const nombreInput = ref(null);

const windowWidth = ref(window.innerWidth);
const mostrarPrimeraParte = ref(true);
const pantallaGrande = computed(() => {
    return windowWidth.value >= 1140;
});


//Cambio el valor del ancho de la pantalla cuando cambia de tamaño
const updateWidth = () => {
    windowWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});

function segundaParte() {
    mostrarPrimeraParte.value = false;
}

function primeraParte(){
    mostrarPrimeraParte.value = true;
}

function validarNombre() {
    if (!/^[a-zñáéíóú\s]{3,14}$/i.test(nombre.value)) {
        mensajeError.value = 'El nombre debe contener entre 3 y 14 letras.';
        mostrarMensaje.value = true;
        nombre.value = '';
        return false;
    }
    return true;
}

function validarApellidos() {
    if (!/^[a-zñáéíóú\s-]{4,24}$/i.test(apellidos.value)) {
        mensajeError.value = 'Los apellidos deben contener entre 4 y 24 letras.';
        mostrarMensaje.value = true;
        return false;
    }
    return true;
}

function validarGymtag() {
    const gymtagMin = gymtag.value.toLowerCase();
    gymtag.value = gymtagMin;

    if (gymtagMin.length >= 3 && gymtagMin.length <= 14) {
        if (/^[a-z0-9ñ._]+$/.test(gymtagMin)) {
            
            let disponible = true; 

            if (disponible) {
                return true;


            } else {
                mensajeError.value = 'El GymTag ingresado ya está en uso.';
                mostrarMensaje.value = true;
                gymtag.value = '';
                return false;
            }
        } else {
            mensajeError.value = 'Tu GymTag solo puede tener letras, números y algunos caracteres especiales.';
            mostrarMensaje.value = true;
            gymtag.value = '';
            return false;
        }
    } else {
        mensajeError.value = 'Tu GymTag debe tener entre 3 y 14 caracteres.';
        mostrarMensaje.value = true;
        gymtag.value = '';
        return false;
    }
}

function validarEmail(){
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        mensajeError.value = 'El email ingresado no es válido';
        mostrarMensaje.value = true;
        return false;
    }
    return true;
}

function validarContras(){
    //Si las contraseñas son iguales y seguras, la contraseña es válida.
    if (password.value === password2.value && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password.value)) {
        return true;
    } else {
        console.log('mal');
        //Si las contraseñas no son iguales o no son seguras, se avisa al usuario de ello.
        if (password.value !== password2.value) {
            mensajeError.value = 'Las contraseñas no coinciden.';
        } else {
            mensajeError.value = 'La contraseña debe contener al menos 8 caracteres e incluir una mayúscula y un número.';
        }
        mostrarMensaje.value = true;
        return false;
    }
}

function siguiente() {
    mostrarMensaje.value = false;
    mensajeError.value = '';
    if (validarNombre() && validarApellidos() && validarGymtag()) {
        segundaParte();
    }
    return;
}

function creaCuenta(){
    mostrarMensaje.value = false;
    mensajeError.value = '';
    if (validarNombre() && validarApellidos() && validarGymtag() &&  validarEmail() && validarContras() && validarEdad()) {
        //Aquí va lo del supa y la redirección a home
    }else{
        return;
    }
}

</script>
<template>
    <div class="todo_register">
        <div class="register">
            <div class="volver_parte_uno" v-if="!pantallaGrande && !mostrarPrimeraParte"><font-awesome-icon :icon="['fas', 'circle-left']" @click="primeraParte"/></div>
            <div class="titulo">Registro</div>
            <div class="nombre_y_apellidos" v-if="(mostrarPrimeraParte) || pantallaGrande">
                <div class="nombre">
                    <div class="container">
                        <div class="subcontainer">
                            <input type="text" id="nombre" class="input" required autocomplete="off" v-model="nombre">
                            <label class="label" for="nombre">Nombre</label>
                        </div>
                    </div>
                </div>
                <div class="apellidos">
                    <div class="container">
                        <div class="subcontainer">
                            <input type="text" id="apellidos" class="input" required autocomplete="off" v-model="apellidos">
                            <label class="label" for="apellidos">Apellidos</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gymtag" v-if="(mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input type="text" id="gymtag" class="input" required autocomplete="off" v-model="gymtag">
                        <label class="label" for="gymtag">GymTag</label>
                        <!-- <font-awesome-icon :icon="['fas', 'circle-info']" class="info" @click="mostrar()" /> -->
                    </div>
                </div>
            </div>
            <div class="email" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="email" type="text" id="email" class="input" required autocomplete="off">
                        <label class="label" for="email">Email</label>
                    </div>
                </div>
            </div>
            <div class="password" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="password" :type="contraVisible ? 'text' : 'password'" id="password" class="input" required autocomplete="off">
                        <label class="label" for="password">Contraseña</label>
                        <div class="contenedor_ojo">
                            <font-awesome-icon :icon="contraVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" :class="contraVisible ? 'ojo  ojo_abierto' : 'ojo'" @click="contraVisible = !contraVisible"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="password2" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="password2" :type="contraVisible2 ? 'text' : 'password'" id="password2" class="input" required autocomplete="off">
                        <label class="label" for="password2">Repetir contraseña</label>
                        <div class="contenedor_ojo">
                            <font-awesome-icon :icon="contraVisible2 ? 'fas fa-eye' : 'fas fa-eye-slash'" :class="contraVisible2 ? 'ojo  ojo_abierto' : 'ojo'" @click="contraVisible2 = !contraVisible2"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fecha_nacimiento" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="fecha_nacimiento" type="date" id="fecha_nacimiento" class="input" required autocomplete="off">
                        <label class="label" for="fecha_nacimiento">Fecha de nacimiento</label>
                        <div class="contenedor_calendario">
                            <font-awesome-icon :icon="['fas', 'calendar']" class="calendario" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="aceptar_politicas" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <label class="container_checkbox">
                    <input type="checkbox" id="aceptar">
                    <svg viewBox="0 0 64 64" height="1.2em" width="1.2em">
                        <path
                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                            pathLength="575.0541381835938" class="path"></path>
                    </svg>
                </label>
                <label class="aceptar" for="aceptar">Aceptar políticas y condiciones de GymBros Zone.</label>
            </div>
            <div class="mensaje" :style="{ visibility: mostrarMensaje ? 'visible' : 'hidden' }">
                <div class="mensaje_texto">
                    {{ mensajeError }}
                </div>
            </div>
            <div class="siguiente" v-if="mostrarPrimeraParte && !pantallaGrande">
                <div class="siguiente_texto"><button class="siguiente_button" @click="siguiente">Siguiente</button>
                </div>
            </div>
            <div class="crear" v-if="!mostrarPrimeraParte || pantallaGrande">
                <div class="crear_texto" @click="creaCuenta"><button>Crear cuenta</button></div>
            </div>
        </div>
    <!-- <button @click="$emit('irALogin')">Volver al Login</button> -->
    </div>
</template>
<style scoped>
.todo_register {
    width: 100vw;
    height: fit-content;
    background: var(--bg-color);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 140px;
}

.register {
    width: 75%;
    height: fit-content;
    height: fit-content;
    max-width: 1050px;
    background-color: var(--dark-blue);
    display: flex;
    text-align: center;
    flex-direction: column;
    border: var(--black) 4px solid;
    border-radius: 6px;
    margin-bottom: 55px;
    position: relative;
}

.volver_parte_uno{
    position: absolute;
    top: 20px;
    left: 20px;
    height: 60px;
    width: 60px;
    font-size: 50px;
    text-align: center;
    color: var(--light-blue-text);
    cursor: pointer;
}

.titulo {
    height: 115px;
    color: var(--light-blue-text);
    padding: 25px 0;
    font-size: 60px;
    font-weight: bold;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.nombre_y_apellidos {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
}

.apellidos,
.nombre {
    width: 42.5%;
    display: flex;
    justify-content: center;
}

.gymtag {
    width: 100%;
    padding: 60px 0 35px;
    display: flex;
    justify-content: center;
}

.gymtag .container {
    width: 55%;
}

.info {
    font-size: 28px;
    padding: 7.5px 0;
    margin-left: -35px;
    cursor: pointer;
}

.subcontainer {
    display: flex;
    justify-content: start;
    width: 75%;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
    align-items: center;
    color: var(--light-blue-text);
    width: 100%;
}

.container .label {
    font-size: 24px;
    padding-left: 10px;
    position: absolute;
    top: 9.5px;
    transition: 0.3s;
    pointer-events: none;
}

.input {
    width: 100%;
    height: 45px;
    border: none;
    outline: none;
    padding: 0px 7px;
    border-radius: 2px;
    color: var(--light-blue-text);
    font-size: 18px;
    background-color: var(--blue-inputs);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 1);
    cursor: pointer;
}

.input:focus {
    border: 2px solid transparent;
    color: var(--light-blue-text);
}

.container .input:valid~.label,
.container .input:focus~.label,
.fecha_nacimiento .input~.label {
    transition: 0.3s;
    padding-left: 2px;
    transform: translateY(-37px);
}

.container .input:valid,
.container .input:focus {
    border: 2px solid var(--grey-buttons-inputs-border);
}

.email {
    margin-top: 30px;
}

.password,
.password2,
.fecha_nacimiento {
    margin-top: 60px;
}

.aceptar_politicas {
    margin-top: 50px;
}

.email .container .subcontainer,
.password .container .subcontainer,
.password2 .container .subcontainer,
.fecha_nacimiento .container .subcontainer {
    width: 75%;
    min-width: 741.5px;
}

.contenedor_calendario, .contenedor_ojo {
    width: 30px;
    height: 30px;
    margin-top: 7px;
    background-color: var(--blue-inputs);
    font-size: 30px;
    padding: 7.5px 0;
    margin-left: -35px;
    cursor: default;
    position: relative;
    /* pointer-events: none; */
}

.calendario, .ojo {
    color: var(--light-blue-text);
    position: relative;
    top: -7.5px;
    right: 3px;
    cursor: default;
    text-align: center;
}

.contenedor_ojo {
    font-size: 27px;
    margin-left: -38px;
    margin-top: 8.5px;
}

.ojo{
    cursor: pointer;
}

.ojo_abierto{
    transform: translateX(1.505px);
}

.crear,
.siguiente {
    margin-top: 35px;
    margin-bottom: 40px;
    height: 55px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.crear_texto,
.siguiente_texto {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.crear_texto button,
.siguiente_texto button {
    cursor: pointer;
    background-color: var(--blue-buttons);
    width: 100%;
    border: solid var(--black) 2px;
    border-radius: 2px;
    font-size: 20px;
    transition: background-color 0.5s, border 0.5s, color 0.5s;
}

.siguiente{
    margin-top: 30px;
}

.crear_texto button:hover,
.crear_texto button:active,
.siguiente_texto button:hover,
.siguiente_texto button:active {
    background-color: var(--very-dark-blue);
    color: var(--light-blue-text);
    border: 2px solid var(--grey-buttons-inputs-border);
}

.aceptar_politicas {
    color: var(--light-blue-text);
    font-size: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.aceptar {
    margin-left: 20px;
    margin-bottom: 3px;
}

.container_checkbox {
    cursor: pointer;
}

.container_checkbox input {
    display: none;
}

.container_checkbox svg {
    overflow: visible;
}

.path {
    fill: none;
    stroke: var(--light-blue-text);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
    stroke-dasharray: 241 9999999;
    stroke-dashoffset: 0;
}

.container_checkbox input:checked~svg .path {
    stroke-dasharray: 70.5096664428711 9999999;
    stroke-dashoffset: -262.2723388671875;
    stroke: rgb(0, 173, 0);
}

.mensaje {
    font-size: 20px;
    min-height: 22px;
    height: fit-content;
    visibility: hidden;
    display: flex;
    justify-content: center;
    color: var(--light-blue-text);
    text-align: center;
    margin-top: 30px;
    width: 100%;
}

.mensaje_texto{
    width: 80%;
}

@media(max-width: 1254px) {
    .nombre_y_apellidos .container {
        min-width: 405px;
    }

    .nombre_y_apellidos .apellidos .container {
        align-items: center;
    }
}

@media(max-width: 1140px) {
    .register {
        width: 88%;
    }

    .titulo {
        margin-top: 20px;
        font-size: 52px;
    }

    .nombre_y_apellidos {
        flex-direction: column;
        padding: 0;
        justify-content: space-around;
        height: 260px;
    }

    .nombre_y_apellidos .container {
        align-items: center;
    }

    .nombre_y_apellidos .nombre,
    .nombre_y_apellidos .apellidos {
        width: 100%;
    }

    .nombre_y_apellidos .nombre .input,
    .nombre_y_apellidos .apellidos .input,
    .gymtag .input,
    .email .input,
    .password input,
    .password2 input,
    .fecha_nacimiento input {
        height: 70px;
    }

    .container .label {
        font-size: 30px;
        top: 17.5px;
    }

    .container .input:valid~.label,
    .container .input:focus~.label,
    .fecha_nacimiento .input~.label {
        transition: 0.3s;
        padding-left: 2px;
        transform: translateY(-52.5px);
    }

    .subcontainer {
        display: flex;
        justify-content: start;
        width: 85%;
    }

    .input {
        font-size: 26px;
    }

    .siguiente,
    .crear {
        display: flex;
        margin-bottom: 40px;
    }

    .siguiente_texto,
    .crear_texto {
        width: 85%;
    }

    .gymtag {
        padding: 0;
        padding-top: 25px;
        margin-bottom: 30px;
    }

    .gymtag .container,
    .email .container,
    .password .container,
    .password2 .container,
    .fecha_nacimiento .container {
        width: 100%;
    }

    .email .container .subcontainer,
    .password .container .subcontainer,
    .password2 .container .subcontainer,
    .fecha_nacimiento .container .subcontainer {
        width: 85%;
        min-width: 0;
        padding: 0;
    }

    .info {
        font-size: 42px;
        padding: 14px 0;
        margin-left: -50px;
        cursor: pointer;
    }

    .siguiente button, .crear button {
        height: 70px;
    }

    .contenedor_calendario, .contenedor_ojo {
        width: 40px;
        height: 40px;
        font-size: 37px;
        padding: 14px 0;
        margin-left: -50px;
    }
    
    .contenedor_ojo {
        font-size: 34px;
        margin-left: -53px;
        padding: 17px 0;
    }
}

@media(max-width: 600px){
    .nombre_y_apellidos .nombre .input,
    .nombre_y_apellidos .apellidos .input,
    .gymtag .input,
    .email .input,
    .password input,
    .password2 input,
    .fecha_nacimiento input,
    .siguiente button {
        height: 55px;
    }

    .container .label {
        font-size: 25px;
        top: 15px;
    }

    .siguiente,
    .crear {
        margin-bottom: 35px;
    }

    .gymtag{
        margin-bottom: 20px;
    }

    .contenedor_calendario, .contenedor_ojo {
        width: 35px;
        height: 35px;
        font-size: 30px;
        padding: 12px 0;
        margin-left: -40px;
    }
    
    .contenedor_ojo{
        font-size: 27px;
    }

    .volver_parte_uno{
        top: 10px;
        left: 10px;
        height: 40px;
        width: 40px;
        font-size: 40px;
    }

    .titulo{
        padding: 50px 0 30px;
    }

    .contenedor_calendario{
        pointer-events: none;
    }

    .calendario{
        cursor: pointer;
    }

    .aceptar{
        width: 60%;
        margin-left: 15px;
    }
}

@media(max-width: 455px) {
    .nombre_y_apellidos .container {
        min-width: 0;
    }

    .titulo {
        margin-top: 20px;
        font-size: 46px;
    }

    .container .label {
        font-size: 24px;
        top: 14.5px;
    }

    .container .input:valid~.label,
    .container .input:focus~.label,
    .fecha_nacimiento .input~.label {
        transition: 0.3s;
        padding-left: 2px;
        transform: translateY(-44.5px);
    }

    .input {
        font-size: 23px;
    }

    .nombre_y_apellidos .nombre .input,
    .nombre_y_apellidos .apellidos .input,
    .gymtag .input {
        height: 60px;
    }

    .nombre_y_apellidos {
        flex-direction: column;
        padding: 0;
        justify-content: space-around;
        height: 240px;
    }

    .gymtag {
        margin-bottom: 20px;
    }

    .info {
        font-size: 36px;
        padding: 12px 0;
        margin-left: -47px;
        cursor: pointer;
    }

    .mensaje {
        font-size: 18px;
        height: 52px;
        visibility: hidden;
        display: flex;
        justify-content: center;
        margin: 10px 0 0;
        align-items: center;
    }

    .siguiente{
        margin-top: 20px;
    }
}

@media(max-width: 330px) {
    .email .input~.label,
    .password .input~.label,
    .password2 .input~.label {
        transition: 0.3s;
        padding-left: 2px;
        transform: translateY(-42.5px);
    }
}
</style>