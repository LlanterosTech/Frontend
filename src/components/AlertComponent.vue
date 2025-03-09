<template>
    <transition name="fade">
        <div v-if="visible" class="alert-box" :class="typeClass">
            <p>{{ message }}</p>
            <button class="close-btn" @click="closeAlert">&times;</button>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        message: String,
        type: { type: String, default: "error" }, 
        duration: { type: Number, default: 4000 } 
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
                this.closeAlert();
            }, this.duration);
        },
        closeAlert() {
            this.visible = false;
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
    top: 20px; /* 📌 Se mostrará en la parte superior */
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
    z-index: 1050; /* 🔥 Se asegurará de estar por encima de otros elementos */
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

.fade-enter {
    opacity: 0;
}

.fade-leave-active {
    opacity: 0;
}
</style>
