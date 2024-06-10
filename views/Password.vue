<script setup>
import { ref } from 'vue';
import { supabase } from '../clients/supabase';
const email = ref()

/*Función para enviar el correo.*/
async function recuperarContra() {
    let { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: 'https://gymbroszone.com/recovery',
    })
}

</script>
<template>
    <div class="password">
        <input v-model="email">
        <button @click="recuperarContra()">Enviar correo</button>
    </div>
</template>
<style scoped>
.password {
    margin: 200px;
}
</style>