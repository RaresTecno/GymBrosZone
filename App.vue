<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/header.vue'
import Nav from './components/BarraLateral.vue'
import Footer from './components/footer.vue'
import './assets/index.css'

/* 
const showHeader = ref(true)
const showNav = ref(false)
const showFooter = ref(false)

const toggleHeader = () => {
  showHeader.value = !showHeader.value
}

const toggleNav = () => {
  showNav.value = !showNav.value
}

const toggleFooter = () => {
  showFooter.value = !showFooter.value
} 
*/
</script>

<template>
<!-- <Header v-if="showHeader"/>
<Nav v-if="showNav"/> 
<Footer v-if="showFooter"/>
 -->
  <Header />
  <RouterView />
  <Nav />
  <Footer/>
</template>

<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
:root{
    --bg-color:#DBE4F6;
    --dark-blue:#0B1E44;
    --alt-black:#121212;
    --greeny-cyan:#caeff6;
    --blue:#3D5A98;
}
body{
    background-color: var(--bg-color);
}
</style>