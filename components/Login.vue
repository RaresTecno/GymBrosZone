<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

// let [captchaToken, setCaptchaToken] = userState()

const contraVisible = ref(false);
const mostrarMensaje = ref(false);
const mensajeError = ref('');

import { supabase, logOut, userState } from '../clients/supabase';

const email = ref("");
const password = ref("");

async function login(){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
        options: {
        // captchaToken,
        }
    })
    if (error) {
          console.log(error);
    }else{
        userState();
        // window.location.href="/";
        
    }
}

</script>
<template>
    <div class="todo_login">
        <div class="login">
            <div class="titulo">Login</div>
            <div class="gymtag_o_email">
                <div class="container">
                    <div class="subcontainer">
                        <input v-model="email" type="text" name="gymtag_o_email" class="input" required autocomplete="off">
                        <label class="label">GymTag o Email</label>
                    </div>
                </div>
            </div>
            <div class="password">
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
            <!-- <VueHcaptcha 
            sitekey="0fecd1d6-14e7-4a54-9300-5664440506ef"
            /> -->
            <div class="mensaje" :style="{ visibility: mostrarMensaje ? 'visible' : 'hidden' }">
                <div class="mensaje_texto">
                    {{ mensajeError }}
                </div>
            </div>
            <div class="iniciar">
                <div class="iniciar_texto"><button @click="login">Iniciar sesión</button></div>
            </div>
            <div class="inicio_sesion">
                <div class="inicio_sesion_contenido">
                    <div class="facebook"><font-awesome-icon :icon="['fab', 'square-facebook']" style="color: #eef2fa;" class="icono_iniciar"/></div>
                    <div class="twitter" @click="logOut"><font-awesome-icon :icon="['fab', 'square-x-twitter']" style="color: #eef2fa;" class="icono_iniciar"/></div>
                    <div class="google" @click="loginGoogle"><font-awesome-icon :icon="['fab', 'google']" class="icono_google icono_iniciar"/></div>
                </div>
            </div>
            <div class="cuenta_existente">
                <div class="cuenta_existente_texto">¿No tienes una cuenta?</div>
            </div>
            <div class="crear">
                <div class="crear_texto"><button><RouterLink to="/log/register" class="btn-loged" id="btn-register">Crear una nueva cuenta</RouterLink></button></div>
                
            </div>
        </div>
    </div>
</template>
<style scoped>
.todo_login {
    width: 100vw;
    height: fit-content;
    background: var(--bg-color);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 140px;
}

.login {
    width: 50%;
    height: fit-content;
    max-width: 1050px;
    background-color: var(--dark-blue);
    display: flex;
    text-align: center;
    flex-direction: column;
    border: var(--black) 4px solid;
    border-radius: 6px;
    margin-bottom: 68px;
}

button a{
    color: var(--light-blue-text);
    text-decoration: none;
}

.titulo {
    height: 110px;
    color: var(--light-blue-text);
    padding: 20px 0;
    font-size: 60px;
    font-weight: bold;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
    top: 9px;
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
    cursor: text;
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
    border: 2px solid #eef2fa81;
}

.gymtag_o_email {
    margin-top: 30px;
}

.password{
    margin-top: 30px;
}

.contenedor_ojo {
    width: 30px;
    height: 30px;
    margin-top: 8.5px;
    background-color: var(--blue-inputs);
    font-size: 27px;
    padding: 7.5px 0;
    margin-left: -38px;
    position: relative;
}

.ojo {
    color: var(--light-blue-text);
    position: relative;
    top: -7.5px;
    right: 3px;
    text-align: center;
    cursor: pointer;
}

.ojo_abierto {
    transform: translateX(1.505px);
}

.gymtag_o_email .container .subcontainer,
.password .container .subcontainer {
    width: 75%;
}

.iniciar {
    margin-top: 10px;
    margin-bottom: 27px;
    height: 55px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.iniciar_texto {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.iniciar_texto button {
    cursor: pointer;
    background-color: var(--blue-buttons);
    width: 100%;
    border: solid var(--black) 2px;
    border-radius: 2px;
    font-size: 20px;
    transition: background-color 0.5s, border 0.5s, color 0.5s;
}

.iniciar_texto button:hover,
.iniciar_texto button:active {
    background-color: var(--blue-inputs);
    color: var(--light-blue-text);
    border: 2px solid #eef2fa81;
}

.inicio_sesion {
    margin-bottom: 30px;
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inicio_sesion_contenido{
    width: 70%;
    height: 100%;
    border-radius: 2px;
    border: 3px solid #eef2fa81;
    display: flex;
    justify-content: space-around;
    text-align: center;
    font-size: 50px;
    text-align: center;
}

.icono_google{
    font-size: 35px;
    background-color: var(--light-blue-text);
    padding: 5px 6px;
    border-radius: 6px;
    color: var(--dark-blue);
}

.inicio_sesion_contenido:hover{
    background-color: #eef2fa13;
}

.inicio_sesion_contenido:hover .icono_google{
    color:  #22335e;
}

.icono_iniciar{
    cursor: pointer;
}

.inicio_sesion_contenido>div{
    display: flex;
    justify-content: center;
    align-items: center;
}

.google img,
.facebook img {
    max-width: 85%;
    max-height: 85%;
}

.twitter img {
    max-width: 115%;
    max-height: 115%;
}

.cuenta_existente {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cuenta_existente_texto {
    color: var(--light-blue-text);
    font-size: 19px;
}

.crear {
    margin-top: 10px;
    margin-bottom: 40px;
    height: 55px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.crear_texto {
    width: 28%;
    min-width: 275px;
    height: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.crear_texto button {
    padding: 10px;
    cursor: pointer;
    background-color: var(--blue-inputs);
    border: solid var(--black) 2px;
    color: var(--light-blue-text);
    border-radius: 2px;
    font-size: 20px;
    transition: background-color 0.5s, border 0.5s, color 0.5s;
}

.crear_texto button:hover,
.crear_texto button:active{
    background-color: var(--blue-inputs);
    border: 2px solid #eef2fa81;
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

    .login {
        width: 88%;
    }

    .titulo {
        margin-top: 20px;
        font-size: 52px;
        padding: 10px 0;
    }

    .gymtag_o_email {
        padding: 0 0 10px;
    }

    .iniciar {
        margin-bottom: 20px;
    }

    .gymtag_o_email .input,
    .password .input {
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

    .subcontainer,
    .iniciar_texto,
    .crear_texto {
        display: flex;
        justify-content: start;
        width: 85%;
    }

    .input {
        font-size: 26px;
    }

    .gymtag_o_email .container,
    .password .container,
    .iniciar_texto button,
    .crear_texto button {
        width: 100%;
    }

    .gymtag_o_email .container .subcontainer,
    .password .container .subcontainer {
        width: 85%;
        min-width: 0;
        padding: 0;
    }

    .iniciar_texto button,
    .crear_texto button {
        height: 65px;
    }

    .iniciar,
    .crear {
        height: 100px;
        padding-top: 10px;
    }

    .crear_texto {
        min-width: 0;
    }

    .contenedor_ojo {
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

    .mensaje {
        font-size: 20px;
        min-height: 22px;
        height: fit-content;
        visibility: hidden;
        display: flex;
        justify-content: center;
        color: var(--light-blue-text);
        text-align: center;
        margin: 35px 0 0;
    }
}

@media(max-width: 600px) {

    .contenedor_calendario,
    .contenedor_ojo {
        width: 35px;
        height: 35px;
        font-size: 30px;
        padding: 12px 0;
        margin-left: -40px;
    }

    .contenedor_ojo {
        font-size: 27px;
    }

    .gymtag_o_email .input,
    .password .input {
        height: 55px;
    }

    .container .label {
        font-size: 25px;
        top: 15px;
    }

    .container .input:valid~.label,
    .container .input:focus~.label {
        transform: translateY(-44.5px);
    }

    .iniciar {
        margin-bottom: 15px;
    }

    .inicio_sesion {
        height: fit-content;
    }

    .inicio_sesion_contenido{
        width: 80%;
        border: 0px solid #eef2fa81;
    }

    .inicio_sesion_contenido:hover{
        background-color: transparent;
    }

    .inicio_sesion_contenido:hover .icono_google{
        color: var(--dark-blue);
    }

    .icono_google{
        font-size: 35px;
        background-color: var(--light-blue-text);
        padding: 5px 6px;
        border-radius: 6px;
        color: #0b1e44;
    }

}
</style>