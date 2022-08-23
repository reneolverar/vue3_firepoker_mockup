<!-- Example of how to call the BaseModal component from a parent component:
    <BaseModal
        v-show="isModalVisible"
        @closeModal="toggleShareGameModal"
        @acceptModal="acceptShareGameModal"
        acceptButton
        noFooter
        noBody
    >
        <template v-slot:header>
            Do you want to accept the round before all participants estimated?
        </template>
        <template v-slot:body>
        </template>
            <template v-slot:footer>
        </template>
    </BaseModal>
-->

<script setup>
    import { defineEmits, defineProps } from 'vue'

    const props = defineProps({
        noFooter: {
            type: Boolean,
            default: false
        },
        noBody: {
            type: Boolean,
            default: false
        },
        acceptButton: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['closeModal', 'acceptModal'])

    const closeModal = () => {
        emit('closeModal');
    }
    const acceptModal = () => {
        emit('acceptModal');
    }
</script>

<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal">
            <header class="modal-header">
                <slot name="header">
                This is the default title!
                </slot>
                <button
                type="button"
                class="btn-close"
                @click="closeModal"
                >
                x
                </button>
            </header>

            <section class="modal-body">
                <slot name="body">
                <p :class="{noBody: noBody}">This is the default body!</p>
                </slot>
            </section>

            <footer class="modal-footer">
                <slot name="footer">
                <p :class="{noFooter: noFooter}">This is the default footer!</p>
                </slot>
                <button v-if="acceptButton"
                type="button"
                class="btn-green"
                @click="acceptModal"
                >
                    Accept
                </button>
                <button
                    type="button"
                    class="btn-red"
                    @click="closeModal"
                >
                    Close
                </button>
            </footer>
            </div>
        </div>
    </transition>
</template>

<style scoped>
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: #FFFFFF;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-header,
    .modal-footer {
        padding: 25px;
        display: flex;
    }

    .modal-header {
        position: relative;
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }

    .modal-footer {
        border-top: 1px solid #eeeeee;
        flex-direction: column;
        justify-content: flex-end;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        font-size: 20px;
        padding: 10px;
        cursor: pointer;
        font-weight: bold;
        color: #4AAE9B;
        background: transparent;
    }

    .btn-green {
        color: white;
        background: #4AAE9B;
        border: 1px solid #4AAE9B;
        border-radius: 2px;
    }

    .btn-red {
        color: white;
        background: red;
        border: 1px solid red;
        border-radius: 2px;
    }

    .noFooter,
    .noBody {
        display: none;
    }

    .modal-fade-enter,
    .modal-fade-leave-to {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 1s ease;
    }

</style>