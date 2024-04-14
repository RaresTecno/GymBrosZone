<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createAcount } from '../supabase/supabase.js';

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


const windowWidth = ref(window.innerWidth);
const mostrarPrimeraParte = ref(true);
const pantallaGrande = computed(() => {
    return windowWidth.value >= 1140;
});

// createAcount(email, password).then((response) => {
//     if (response.error) {
//         alert(`An error occurred: ${response.error.message}`);
//     }
// });

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
        return true;
    }
    return false;
}

function validarApellidos() {
    if (!/^[a-zñáéíóú\s-]{4,24}$/i.test(apellidos.value)) {
        mensajeError.value = 'Los apellidos deben contener entre 4 y 24 letras.';
        mostrarMensaje.value = true;
        return true;
    }
    return false;
}

function validarGymtag() {

    const gymtagMin = gymtag.value.toLowerCase();
    gymtag.value = gymtagMin;

    if (gymtagMin.length >= 3 && gymtagMin.length <= 14) {
        if (/^[a-z0-9ñ._]+$/.test(gymtagMin)) {
            
            let disponible = true; 

            if (disponible) {
                return false;


            } else {
                mensajeError.value = 'El GymTag ingresado ya está en uso.';
                mostrarMensaje.value = true;
                gymtag.value = '';
                return true;
            }
        } else {
            mensajeError.value = 'Tu GymTag solo puede tener letras, números y algunos caracteres especiales.';
            mostrarMensaje.value = true;
            gymtag.value = '';
            return true;
        }
    } else {
        mensajeError.value = 'Tu GymTag debe tener entre 3 y 14 caracteres.';
        mostrarMensaje.value = true;
        gymtag.value = '';
        return true;
    }
}

function validarEmail(){
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(apellidos.value)) {
        mensajeError.value = 'El email ingresado no es válido';
        mostrarMensaje.value = true;
        return true;
    }
    return false;
}

function validarContras(){
    //Si las contraseñas son iguales y seguras, la contraseña es válida.
    if (password.value === password2.value && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password.value)) {
        return true;
    } else {
        //Si las contraseñas no son iguales o no son seguras, se avisa al usuario de ello.
        if (password.value !== password2.value) {
            let error = document.querySelector("#texto-oculto");
            error.style.visibility = "visible";
            error.textContent = "Las contraseñas no coinciden.";
        } else {
            let error = document.querySelector("#texto-oculto");
            error.style.visibility = "visible";
            error.style.marginBottom = "40px";
            error.innerHTML = "La contraseña debe contener al menos <br> 8 caracteres e incluir una mayúscula <br> y un número.";
        }
        return false;
    }
}

function siguiente() {
    mostrarMensaje.value = false;
    mensajeError.value = '';
    if (validarNombre() || validarApellidos() || validarGymtag()) {
        return;
    }
    segundaParte();
}

function creaCuenta(){
    mostrarMensaje.value = false;
    mensajeError.value = '';
    if (validarNombre() || validarApellidos() || validarGymtag() ||  validarEmail() || validarContras() || validarEdad()) {
        return;
    }

    //Aquí va lo del supa y la redirección a home
}

// function siguiente() {
//     const mensaje_texto = document.querySelector('.mensaje_texto');
//     //Oculto el mensaje de aviso.
//     mensaje_texto.style.visibility = "hidden";
//     //Obtengo los valores de los inputs de la primera parte del registro para móvil.
//     const nombreInput = document.querySelector('input[name="nombre"]');
//     const apellidosInput = document.querySelector('input[name="apellidos"]');
//     const gymtagInput = document.querySelector('input[name="gymtag"]');

//     let nombre = nombreInput.value;
//     let apellidos = apellidosInput.value;
//     let gymtag = gymtagInput.value;

//     if (nombre) nombre.toLowerCase();
//     if (apellidos) nombre.toLowerCase();
//     if (gymtag) nombre.toLowerCase();

//     //Compruebo que el nombre tiene entre 3 y 14 letras, puede contener espacios.
//     if (/^[a-zñáéíóú\s]{3,14}$/.test(nombre)) {
//         //Compruebo que los apellidos tienen entre 3 y 24 letras, puede contener espacios.
//         if (/^[a-zñáéíóú\s]{5,24}$/.test(apellidos)) {
//             if (validarGymtag(gymtagInput, gymtag, mensaje_texto)) {
//                 segundaParte();
//             }
//         } else {
//             mensaje_texto.style.visibility = "visible";
//             mensaje_texto.innerHTML = 'Los apellidos deben contener entre 5 y 24 letras.';
//             apellidosInput.value = '';
//             apellidosInput.focus();
//         }
//     } else {
//         mensaje_texto.style.visibility = "visible";
//         mensaje_texto.innerHTML = 'El nombre debe contener entre 3 y 14 letras.';
//         nombreInput.value = '';
//         nombreInput.focus();
//     }
// }







// function validarGymtag(gymtagInput, gymtag, mensaje_texto) {
//     mostrarMensaje.value = false;
//     mensajeError.value = '';
//     if (gymtag.value.length >= 1 && gymtag.value.length <= 14) {
//         if (/^[a-z0-9ñ._]+$/.test(gymtag.value)) {
//             let disponible = true;

//             if (disponible) {
//                 return true;
//             } else {
//                 mensaje_texto.style.visibility = "visible";
//                 mensaje_texto.innerHTML = 'El GymTag ingresado ya está en uso.';
//                 gymtagInput.value = '';
//                 gymtagInput.focus();
//                 return false;
//             }
//         } else {
//             //Aviso al usuario de que ha ingresado algún caracter invalido.
//             mensaje_texto.style.visibility = "visible";
//             //Cambiamos la altura del contenedor del mensaje para una buena apariencia.
//             if (document.querySelector('.register').style.width < 364) {
//                 document.querySelector('.mensaje').style.marginBottom = '20px';
//             }
//             if (document.querySelector('.register').style.width < 263) {
//                 document.querySelector('.mensaje').style.marginBottom = '35px';
//             }
            
            
//             mostrarMensaje.value = true;
//             mensajeError.value = 'Tu GymTag solo puede tener entre letras, números y algunos caracteres especiales.';
//             gymtag.value = '';
//             gymtag.value.focus();
//             return false;

//         }
//     }
//     else {
//         //Aviso al usuario de que el GymTag no tiene la longitud adecuada.
//         mensaje_texto.style.visibility = "visible";
//         mensaje_texto.innerHTML = 'Tu GymTag debe tener entre 3 y 12 caracteres.';
//         gymtagInput.value = '';
//         gymtagInput.focus();
//         return false;
//     }

// }

</script>
<template>
    <div class="todo_register">
        <!-- <div class="header_register">
            <div class="logo">
                <div class="circulo">
                    <img src="../assets/img/logo.png" alt="">
                </div>
            </div>
            <div class="nombre">
                <div class="nombre_contenido">GymBros Zone</div>
            </div>
        </div> -->
        <div class="register">
            <div class="volver_parte_uno" v-if="!pantallaGrande && !mostrarPrimeraParte"><font-awesome-icon :icon="['fas', 'circle-left']" @click="primeraParte"/></div>
            <div class="titulo">Registro</div>
            <div class="nombre_y_apellidos" v-if="(mostrarPrimeraParte) || pantallaGrande">
                <div class="nombre">
                    <div class="container">
                        <div class="subcontainer">
                            <input type="text" name="nombre" class="input" required autocomplete="off" v-model="nombre">
                            <label class="label">Nombre</label>
                        </div>
                    </div>
                </div>
                <div class="apellidos">
                    <div class="container">
                        <div class="subcontainer">
                            <input type="text" name="apellidos" class="input" required autocomplete="off" v-model="apellidos">
                            <label class="label">Apellidos</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gymtag" v-if="(mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input type="text" name="gymtag" class="input" required autocomplete="off" v-model="gymtag">
                        <label class="label">GymTag</label>
                        <!-- <font-awesome-icon :icon="['fas', 'circle-info']" class="info" @click="mostrar()" /> -->
                    </div>
                </div>
            </div>
            <div class="email" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="email" type="text" name="email" class="input" required autocomplete="off">
                        <label class="label">Email</label>
                    </div>
                </div>
            </div>
            <div class="password" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="password" :type="contraVisible ? 'text' : 'password'" name="password" class="input" required autocomplete="off">
                        <label class="label">Contraseña</label>
                        <div class="contenedor_ojo">
                            <font-awesome-icon :icon="contraVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" :class="contraVisible ? 'ojo  ojo_abierto' : 'ojo'" @click="contraVisible = !contraVisible"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="password2" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="password2" :type="contraVisible2 ? 'text' : 'password'" name="password2" class="input" required autocomplete="off">
                        <label class="label">Repetir contraseña</label>
                        <div class="contenedor_ojo">
                            <font-awesome-icon :icon="contraVisible2 ? 'fas fa-eye' : 'fas fa-eye-slash'" :class="contraVisible2 ? 'ojo  ojo_abierto' : 'ojo'" @click="contraVisible2 = !contraVisible2"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fecha_nacimiento" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="fecha_nacimiento" type="date" name="fecha_nacimiento" class="input" required autocomplete="off">
                        <label class="label">Fecha de nacimiento</label>
                        <!-- <font-awesome-icon :icon="['fas', 'circle-info']" class="info" @click="mostrar()" /> -->
                        <div class="contenedor_calendario">
                            <font-awesome-icon :icon="['fas', 'calendar']" class="calendario" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="aceptar_politicas" v-if="(!pantallaGrande && !mostrarPrimeraParte) || pantallaGrande">
                <label class="container_checkbox">
                    <input type="checkbox">
                    <svg viewBox="0 0 64 64" height="1.2em" width="1.2em">
                        <path
                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                            pathLength="575.0541381835938" class="path"></path>
                    </svg>
                </label>
                <label class="aceptar">Aceptar políticas y condiciones de GymBros Zone.</label>
            </div>
            <div class="mensaje" :style="{ visibility: mostrarMensaje ? 'visible' : 'hidden' }">
                {{ mensajeError }}
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

/* .header_register {
    width: 100%;
    display: flex;
    height: 150px;
}

.header_register .logo {
    width: 47%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 35px;
}

.header_register .nombre {
    width: 53%;
    margin-right: 15px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 55px;

}

.logo .circulo {
    background-color: var(--black);
    border-radius: 50%;
    margin-top: 10px;
    height: 118px;
    width: 118px;
    background-color: var(--black);

}

.logo .circulo img {
    height: 112%;
    width: 112%;
    border-radius: 50%;
    transform: translate(-5.5%, -4.5%);
}

.nombre_contenido {
    padding: 7px 70px;
    background-color: var(--dark-blue);
    color: var(--light-blue-text);
    font-size: 28px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    border-radius: 30px;
} */

.register {
    width: 75%;
    height: fit-content;
    height: fit-content;
    max-width: 1050px;
    background-color: var(--dark-blue);
    display: flex;
    text-align: center;
    flex-direction: column;
    /* margin-right: 15px; */
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
    /* background-color: red; */
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
    /* min-width: 332px; */
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

.crear_texto button:hover,
.crear_texto button:active,
.siguiente_texto button:hover,
.siguiente_texto button:active {
    background-color: var(--very-dark-blue);
    color: var(--light-blue-text);
    border: 2px solid var(--grey-buttons-inputs-border);
}

/* .siguiente {
    display: none;
} */

.aceptar_politicas {
    color: var(--light-blue-text);
    font-size: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.aceptar {
    margin-left: 10px;
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
    /* .header_register {
        height: 180px;
        margin-bottom: 20px;
    }

    .header_register .nombre {
        display: none;
    }

    .header_register .logo {
        width: 100%;
        justify-content: center;
        padding: 0;
    }

    .logo .circulo {
        /* background-color: #3d5a98; 
        width: 160px;
        height: 160px;
    } */

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

    /* .email,
    .password,
    .password2,
    .fecha_nacimiento,
    .aceptar_politicas,
    .crear {
        display: none;
    } */

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
        height: 22px;
        visibility: hidden;
        display: flex;
        justify-content: center;
    }
}
</style>