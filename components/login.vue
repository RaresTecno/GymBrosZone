<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
function irARegister(){
    
}

</script>
<template>
    <div class="todo_register">
        <div class="register">
            <div class="titulo">Login</div>
            <div class="gymtag_o_email">
                <div class="container">
                    <div class="subcontainer">
                        <input type="text" name="gymtag_o_email" class="input" required autocomplete="off">
                        <label class="label">GymTag o Email</label>
                    </div>
                </div>
            </div>
            <div class="password">
                <div class="container">
                    <div class="subcontainer">
                        <input type="password" name="password" class="input" required autocomplete="off">
                        <label class="label">Contraseña</label>
                    </div>
                </div>
            </div>
            <div class="iniciar">
                <div class="iniciar_texto"><button>Iniciar sesión</button></div>
            </div>
            <div class="inicio_sesion">
                <div class="inicio_sesion_contenido">
                    <div class="facebook"><img src="../assets/img/logo_facebook.png" alt="Logo Facebook"></div>
                    <div class="twitter" @click="logOut"><img src="../assets/img/logo_x.png" alt="Logo X"></div>
                    <div class="google" @click="loginGoogle"><img src="../assets/img/logo_google.webp" alt="Logo Google"></div>
                </div>
            </div>
            <div class="cuenta_existente">
                <div class="cuenta_existente_texto">¿No tienes una cuenta?</div>
            </div>
            <div class="crear">
                <div class="crear_texto"><button @click="$emit('irARegister')">Crear una nueva cuenta</button></div>
            </div>
        </div>
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
    width: 50%;
    height: fit-content;
    height: fit-content;
    max-width: 1050px;
    background-color: var(--dark-blue);
    display: flex;
    text-align: center;
    flex-direction: column;
    margin-right: 15px;
    border: var(--black) 4px solid;
    border-radius: 6px;
}

.titulo {
    color: var(--light-blue-text);
    margin: 25px 0;
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

.gymtag_o_email .container .subcontainer,
.password .container .subcontainer{
    width: 75%;
}

.iniciar {
    margin-top: 50px;
    margin-bottom: 35px;
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

.inicio_sesion{
    margin-bottom: 40px;
    height: 70px;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inicio_sesion_contenido{
    width: 70%;
    height: 100%;
    background-color: var(--light-blue-text);
    border-radius: 2px;
    border: 3px solid var(--black);
    display: flex;
    justify-content: space-around;
    text-align: center;
}

.inicio_sesion_contenido>div{
    display: flex;
    justify-content: center;
    align-items: center;
}

.google img, .facebook img{
    max-width: 85%;
    max-height: 85%;
}

.twitter img{
    max-width: 115%;
    max-height: 115%;
}

.cuenta_existente{
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cuenta_existente_texto{
    color: var(--light-blue-text);
    font-size: 19px;
}

.crear {
    margin-top: 10px;
    margin-bottom: 60px;
    height: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.crear_texto {
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
.crear_texto button:active {
    background-color: var(--blue-inputs);
    color: var(--light-blue-text);
    border: 2px solid #eef2fa81;
}

@media(max-width: 1140px) {
    .header_register {
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
        /* background-color: #3d5a98; */
        width: 160px;
        height: 160px;
    }

    .register {
        width: 88%;
    }

    .titulo {
        margin-top: 30px;
        font-size: 52px;
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

    .subcontainer, .iniciar_texto {
        display: flex;
        justify-content: start;
        width: 85%;
    }

    .input {
        font-size: 26px;
    }

    .gymtag_o_email .container,
    .password .container,
    .iniciar_texto button {
        width: 100%;
    }

    .gymtag_o_email .container .subcontainer,
    .password .container .subcontainer {
        width: 85%;
        min-width: 0;
        padding: 0;
    }

    .iniciar_texto button {
        height: 65px;
    }
    .iniciar {
        height: 100px;
        padding-top: 10px;
    }
}
</style>