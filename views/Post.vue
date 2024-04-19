<script setup></script>

<template>
  <div class="todo-publicar">
    <router-link to="./Acccount.vue">Account</router-link>
    <button class="noselect"><span class="text">Account</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
  <div class="container">
    <div class="form_area">
      <p class="title">Publicar</p>
      <form action="">
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"
            ></path>
          </svg>
          <div class="card__content">
            <p class="card__title">Así quedará tu foto</p>
            <p class="card__description">¿Entrenando?</p>
            <p class="card__description">¿Dieta?</p>
            <p class="card__description">¿Rutinas?</p>
            <p class="card__description">Tú decides!</p>
          </div>
        </div>

        <div class="form_group">
          <label class="sub_title" for="foto">Elegir Foto</label>
          <input placeholder="Elige foto" class="form_style" type="file" />
        </div>
        <div class="form_group">
          <label class="sub_title" for="tema">Temática</label>
          <input
            placeholder="Temática (opcional)"
            id="tema"
            class="form_style"
            type="email"
          />
        </div>
        <div class="form_group">
          <label class="sub_title" for="contenido">Contenido</label>
          <textarea
            name="contenido"
            id="contenido"
            class="form_style"
            cols="30"
            rows="10"
            placeholder="Escribe aquí el contenido..."
          ></textarea>
        </div>
        <div>
          <button class="publicar">Publicar</button>
        </div>
      </form>
    </div>
    <a class="link" href=""></a>
  </div>
  </div>
  
</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-bottom: 3vh;
  width: 100vw;
}

.form_area {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--dark-blue);
  height: auto;
  width: auto;
  border: 3px solid var(--alt-black);
  border-radius: 20px;
  box-shadow: 3px 4px 0px 1px black;
}

.title {
  color: aliceblue;
  font-weight: 900;
  font-size: 1.5em;
  margin-top: 20px;
}

.sub_title {
  font-weight: 600;
  margin: 5px 0;
}

.form_group {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin: 10px;
}

.form_style {
  outline: none;
  border: 2px solid #264143;
  box-shadow: 3px 4px 0px 1px black;
  width: 290px;
  padding: 12px 10px;
  border-radius: 4px;
  font-size: 15px;
}

.form_style:focus,
.btn:focus {
  transform: translateY(4px);
  box-shadow: 1px 2px 0px 0px var(--alt-black);
}

.card {
  position: relative;
  width: 250px;
  height: 200px;
  margin-top: 10%;
  margin-left: 10%;
  background-color: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 5px #ffffff80;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card svg {
  width: 48px;
  fill: #333;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 700;
}

.card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #777;
  line-height: 1.4;
}

label.sub_title{
  color: aliceblue;
}

input, textarea{
  background-color: var(--blue-inputs);
  color: rgba(240, 248, 255, 0.7267);
}

input::placeholder, textarea::placeholder{
  color: rgba(240, 248, 255, 0.726);
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-family: inherit;
  font-size: 15px;
}

button.publicar {
  margin: 8.5%;
  font-weight: 600;
  color: aliceblue;
  text-transform: uppercase;
  padding: 1em 0.2em;
  background: var(--blue);
  border: 2px solid var(--alt-black);
  border-radius: 0.75em;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: background 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
  transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
    background 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
  margin-left: auto;
  margin-right: auto;
  display: block;
}

button.publicar::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-blue);
  border-radius: inherit;
  -webkit-box-shadow: 0 0 0 2px var(--blue), 0 0.625em 0 0 var(--dark-blue);
  box-shadow: 0 0 0 2px rgb(63, 63, 65), 0 0.625em 0 0;
  -webkit-transform: translate3d(0, 0.75em, -1em);
  transform: translate3d(0, 0.75em, -1em);
  transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
    box-shadow 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1),
    -webkit-box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
}

button.publicar:hover {
  color: black;
  background: aliceblue;
  -webkit-transform: translate(0, 0.25em);
  transform: translate(0, 0.25em);
}

button.publicar::before {
  -webkit-box-shadow: 0 0 0 2px var(--alt-black), 0 0.5em 0 0 black;
  box-shadow: 0 0 0 2px grey, 0 0.5em 0 0 whitesmoke;
  -webkit-transform: translate3d(0, 0.5em, -1em);
  transform: translate3d(0, 0.5em, -1em);
}

button.publicar:active {
  background: whitesmoke;
  -webkit-transform: translate(0em, 0.75em);
  transform: translate(0em, 0.75em);
}

button.publicar::before {
  -webkit-box-shadow: 0 0 0 2px grey, 0 0 rgb(95, 88, 88);
  box-shadow: 0 0 0 2px rgb(65, 58, 58), 0 0 rgb(192, 178, 178);
  -webkit-transform: translate3d(0, 0, -1em);
  transform: translate3d(0, 0, -1em);
}

button a {
  color: white;
}
button:hover a {
  color: black;
}

button.noselect {
 margin-top: 12vh;
 margin-left: 32.5vw;
 width: 150px;
 height: 50px;
 cursor: pointer;
 display: flex;
 align-items: center;
 background: var(--blue);
 border: none;
 border-radius: 5px;
 box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
 background: var(--dark-blue);
}

button.noselect, button.noselect span {
 transition: 200ms;
}

button.noselect .text {
 transform: translateX(35px);
 color: aliceblue;
 font-weight: bold;
}

button.noselect .icon {
 position: absolute;
 border-left: 1px solid aliceblue;
 transform: translateX(110px);
 height: 40px;
 width: 40px;
 display: flex;
 align-items: center;
 justify-content: center;
}

button.noselect svg {
 width: 15px;
 fill: #eee;
}

button.noselect:hover {
 background: var(--alt-black);
}

button.noselect:hover .text {
 color: transparent;
}

button.noselect:hover .icon {
 width: 150px;
 border-left: none;
 transform: translateX(0);
}

button.noselect:focus {
 outline: none;
}

button.noselect:active .icon svg {
 transform: scale(0.8);
}

@media only screen and (max-width: 875px) and (max-height: 1098px) {
  .container {
    margin-top: 3%;
  }

  button.button-publicar {
    margin: 5%;
  }

  button.noselect{
    margin-left: 18vw;
  }
}

@media only screen and (min-width: 1440px) {
  .todo-publicar{
    width: 90vw;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
