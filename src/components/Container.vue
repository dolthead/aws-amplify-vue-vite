<template>
  <div class="container">
    <!-- <div class="welcome"> -->
      <!-- <authenticator :login-mechanisms="['email']"> -->
      <authenticator>
        <transition name="f" appear>
          <form @submit.prevent="addItem()">
            <label>New item</label>
            <input type="text" v-model="msg" autocomplete="off">
            <button>Add item</button>
          </form>
        </transition>
        <TodoList :list="data" :delete-item="deleteItem" />
        <transition name="m" appear>
          <w-notification v-show="showNotification" warning :bottom="true" round shadow transition="bounce">
            Please enter a value
          </w-notification>
        </transition>
        <!-- <amplify-sign-out /> -->


        <h1>Hello {{ auth.user?.username }}!</h1>
        <button @click="auth.signOut">Sign Out</button>
      </authenticator>
    <!-- </div> -->
        <!-- <amplify-sign-out /> -->
  </div>
</template>

<script setup lang="ts">
import TodoList from './TodoList.vue'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import { ref, onMounted } from 'vue';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";

const auth = useAuthenticator();
let user = ref({});
let msg = ref('')
let showNotification = ref(false)
const timeout = 2000
let data = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
])

onMounted(async () => {     
  await auth.signOut();
  console.log('mounted')
  onAuthUIStateChange((state, authUser) => {
    console.log('state changed')
    if (state === AuthState.SignedIn) {
      console.log('logged in')
      user.value = authUser;
    }
  })
})

function addItem() {
  if (msg.value.length) {
    const id = Math.floor(Math.random() * 100)
    const next = { id, name: msg.value }
    data.value.push(next)
  } else {
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, timeout)
  }
}
function deleteItem(id: number) {
  data.value = data.value.filter(item => item.id !== id)
}
</script>


<style scoped>
.f-enter-from,
.f-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.f-enter-to,
.f-leave-from {
  opacity: 1;
  transform: translateX(0px);
}

.f-enter-active,
.f-leave-active {
  transition: all 0.5s ease;
}

.m-enter-active {
  animation: shake 0.5s ease-in;
}

@keyframes shake {
  0% {
    transform: translateX(-40px);
    opacity: 0;
  }

  25% {
    transform: translateX(-10px);
    opacity: 1;
  }

  50% {
    transform: translateY(-40px);
  }

  75% {
    transform: translateY(0px);
  }

  100% {
    transform: translateX(0px);
  }
}
</style>
