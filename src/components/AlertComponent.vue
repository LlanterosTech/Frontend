<template>
    <transition name="fade">
        <div v-if="visible" class="alert-box" :class="typeClass">
            <p>{{ message }}</p>
            <button class="close-btn" @click="fadeOutAlert">&times;</button>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        message: String,
        type: { type: String, default: "error" }, 
        duration: { type: Number, default: 2000 } 
    },
    data() {
        return { visible: false };
    },
    computed: {
        typeClass() {
            return {
                "alert-error": this.type === "error",
                "alert-success": this.type === "success",
                "alert-warning": this.type === "warning",
                "alert-info": this.type === "info"
            };
        }
    },
    methods: {
        showAlert() {
            this.visible = true;
            setTimeout(() => {
                this.fadeOutAlert();
            }, this.duration);
        },
        fadeOutAlert() {
            this.visible = false; // Activa la transición de desvanecido
            setTimeout(() => {
                this.$emit("close"); // Emite el evento después de la animación
            }, 200); // Coincide con la duración de la transición CSS
        }
    },
    mounted() {
        this.showAlert();
    }
};
</script>

<style scoped>
.alert-box {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 24px;
    border-radius: 6px;
    font-size: 1rem;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    min-width: 200px;
    max-width: 400px;
    text-align: center;
    z-index: 1050;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
}

.alert-error {
    background: #d9534f;
}
.alert-success {
    background: #5cb85c;
}
.alert-warning {
    background: #f0ad4e;
}
.alert-info {
    background: #5bc0de;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 1.3rem;
    color: white;
    cursor: pointer;
    margin-left: 15px;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
