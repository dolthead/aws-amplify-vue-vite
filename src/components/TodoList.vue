<template>
    <transition name="a" mode="out-in">
        <div v-if="props.list.length">
            <transition-group tag="ul" name="todo">
                <li v-for="todo in props.list" :key="todo.id">
                    <span class="name">{{ todo.name }}</span>
                    <button @click="props.deleteItem(todo.id)">X</button>
                </li>
            </transition-group>
        </div>
        <div v-else>
            <p>No items to show!</p>
        </div>
    </transition>
</template>

<script setup lang="ts">
    const props = defineProps<{
        list: Array<any>,
        deleteItem: Function
    }>()
</script>

<style scoped>
    .a-enter-from,
    .a-leave-to {
        opacity: 0;
        transform: translateX(-50px);
    }
    .a-enter-to,
    .a-leave-from {
        opacity: 1;
        transform: translateX(0px);
    }
    .a-enter-active,
    .a-leave-active {
        transition: all 0.5s ease;
    }

    .todo-enter-from,
    .todo-leave-to {
        opacity: 0;
        transform: scale(0.15);
    }
    .todo-enter-to,
    .todo-leave-from {
        opacity: 1;
        transform: scale(1);
    }
    .todo-enter-active,
    .todo-leave-active {
        transition: all 0.5s ease;
    }
</style>