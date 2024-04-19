<script setup>

</script>

<template>
    <div class="error-container">
        <h1 class="error-title">404</h1>
        <p class="error-text">Oops, not found <span class="animate-blink">!!!!</span></p>
    </div>
</template>

<style scope>
.error-container {
    text-align: center;
    background-color: var(--alt-black);
    margin-top: 6%;
}

.error-title {
    font-size: 190px;
    font-weight: bold;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
    color: aliceblue;
}

.error-text {
    font-size: 1.125rem;
    color: aliceblue;
}

.animate-blink {
    animation: blink 1s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes blink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

</style>