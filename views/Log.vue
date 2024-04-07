<script setup>
    import Register from '../components/Register.vue';
    import Login from '../components/Login.vue';
    import { ref } from 'vue';


    const mostrarRegisterBool = ref(false);

    const mostrarRegister = () => {
        mostrarRegisterBool.value = true;
    }


</script>
    <template>
        <Register v-if="mostrarRegisterBool"/>
        <Login v-else @irARegister="mostrarRegister"/>
    </template>
