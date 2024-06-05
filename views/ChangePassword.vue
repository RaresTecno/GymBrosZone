<script setup>
import { ref } from 'vue';
import { supabase, seeCurrentUser } from '../clients/supabase';
const password = ref()
const password2 = ref()

async function cambiarContra() {
    const usuario = seeCurrentUser()
    const { data, error } = await supabase.auth.updateUser({
        email: usuario.email,
        password: password.value
    })
}

</script>
<template>
    <div class="password">
        <input v-model="password">
        <input v-model="password2">
        <button @click="cambiarContra()">Cambiar Contraseña</button>
    </div>
</template>
<style scoped>
.password {
    margin: 200px;
}
</style>