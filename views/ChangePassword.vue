<script setup>
import { ref } from 'vue';
import { supabase } from '../clients/supabase';
const password = ref()
const password2 = ref()

async function cambiarContra() {
    const { data, error } = await supabase.auth.updateUser({
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