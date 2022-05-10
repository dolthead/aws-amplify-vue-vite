<template>
  <div class="container">
    <authenticator>
      <transition name="f" appear>
        <form @submit.prevent="createItemLocal()">
          <label>New item</label>
          <input type="text" v-model="msg" autocomplete="off" />
          <button>Add item</button>
        </form>
      </transition>
      <TodoList :list="data" :delete-item="deleteItemLocal" />
      <transition name="m" appear>
        <w-notification
          v-show="showNotification"
          warning
          :bottom="true"
          round
          shadow
          transition="bounce"
        >
          Please enter a value
        </w-notification>
      </transition>
      <div>User: {{ auth.user?.username }}</div>
      <button @click="auth.signOut">Sign Out</button>
    </authenticator>
  </div>
</template>

<script setup lang="ts">
  import TodoList from './TodoList.vue';
  import { ref, onMounted, Ref } from 'vue';
  import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
  // import { AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
  import { API, graphqlOperation } from 'aws-amplify';
  import { listItems } from '../graphql/queries';
  import { createItem, deleteItem } from '../graphql/mutations';
  import { onCreateItem, onDeleteItem } from '../graphql/subscriptions';
  import { Item } from '../API';

  const auth = useAuthenticator();
  let user = ref({});
  let msg = ref('');
  let showNotification = ref(false);
  const timeout = 2000;
  let loading = ref(false);
  let data: Ref<Array<Item>> = ref([
    // { id: 1, name: 'Item 1' },
    // { id: 2, name: 'Item 2' },
    // { id: 3, name: 'Item 3' },
  ]);

  onMounted(() => {
    // await auth.signOut();
    // console.log('mounted')
    // onAuthUIStateChange((state, authUser) => {
    //   console.log('state changed')
    //   if (state === AuthState.SignedIn) {
    //     console.log('logged in')
    //     user.value = authUser;
    //   }
    // })
    // onAuthUIStateChange((state, user) => {
    //   if (state === AuthState.SignedIn) {
    //     this.user = user;
    //     this.getData();
    //   }
    // });

    // API.graphql(graphqlOperation(onCreateItem)).subscribe((sourceData) => {
    //   const newItem: Item = sourceData.value.data.onCreateItem;
    //   if (newItem) {
    //     if (data.value.some((r) => r.id == newItem.id)) return;
    //     data.value = [newItem, ...data.value];
    //   }
    // });

    // API.graphql(graphqlOperation(onDeleteItem)).subscribe((sourceData) => {
    //   const removedItem: Item = sourceData.value.data.onDeleteItem;
    //   if (removedItem) {
    //     data = TodoList.filter((r: Item) => r.id != removedItem.id);
    //   }
    // });

    getData()
  });

  const getData = async () => {
    try {
      loading.value = true;
      const r = await API.graphql(graphqlOperation(listItems));
      data.value = r.data.listItems.items;
    } catch (error) {
      console.log('There was an error loading the items...', error);
    } finally {
      loading.value = false;
    }
  };

  const createItemLocal = async () => {
    const name = msg.value;
    const item = { name };
    try {
      const r = await API.graphql(
        graphqlOperation(createItem, { input: item })
      );
      console.log('Item created...');
      data.value = [...data.value, r.data.createItem];
    } catch (error) {
      console.log('There was an error creating the item...', error);
    }
  };

  const deleteItemLocal = async (id: string) => {
    if (id) {
      try {
        await API.graphql(graphqlOperation(deleteItem, { input: { id: id } }));
        console.log('Item deleted...');
        data.value = data.value.filter((r) => r.id !== id);
      } catch (error) {
        console.log('There was an error deleting the item...', error);
      }
    }
  };

  const Create = () => {
    setTimeout(() => {
      showNotification.value = false;
    }, timeout);

    if (msg.value.length) {
      createItemLocal();
    } else {
      showNotification.value = true;
    }
  };

  const Delete = (idx) => {
    deleteItemLocal(idx);
  };
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
