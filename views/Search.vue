<script setup>
    import { ref } from 'vue';
    const busqueda = ref("737628064502");

    async function verApi() {
        
        const url = 'https://world.openfoodfacts.org/api/v3/product/'+busqueda.value;
    
        try {
            const response = await fetch(url);
            const result = await response.text();
            console.log(result);
            
        } catch (error) {
            console.log(error)
        }
    }

</script>

<template>
    <div class="prueba">
        <input type="text" v-model="busqueda">
        <button @click="verApi">A</button>
    </div>
</template>
<style scoped>
.prueba{
    margin: 100px;
}
</style>