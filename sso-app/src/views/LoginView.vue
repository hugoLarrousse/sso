<template>
  <div class="about">
    <h1 v-if="errorMessage">{{ errorMessage }}</h1>
    <h1 v-else>OK</h1>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute();
// create error message
const errorMessage = ref(null);

onBeforeMount(() => {
  console.log('routeAA', route.query);
  const { client_id, redirect_uri, response_type, scope, state } = route.query;
  if (!client_id) {
    errorMessage.value = 'client_id is required';
  } else if (!redirect_uri) {
    errorMessage.value = 'redirect_uri is required';
  } else if (!response_type) {
    errorMessage.value = 'response_type is required';
  } else if (!scope) {
    errorMessage.value = 'scope is required';
  } else if (!state) {
    errorMessage.value = 'state is required';
  }

  // TODO later: request backend to check client_id & redirect_uri

  // check in cookies and session storage if user is logged in
  

  // if not, redirect to login page
  // if yes, redirect to redirect_uri with code

});
  // check client_id
  // check state? nonce?
  // check redirect_uri
  // check response_type?
  // check scope?


//   {
//     "client_id": "83416031478-s1vtcg0hf8nqhb8phhno10tl6tcn6bel.apps.googleusercontent.com",
//     "state": "3da48088-d881-4fce-938b-394430dc0305",
//     "nonce": "927df5d9-fd2b-4aa6-9cec-5a4ee9fc9403",
//     "redirect_uri": "https://dashboard.render.com/oauth/google",
//     "response_type": "id_token",
//     "scope": "email profile"
// }
//   {
//     "client_id": "83416031478-s1vtcg0hf8nqhb8phhno10tl6tcn6bel.apps.googleusercontent.com",
//     "state": "df549211-7757-4487-a2a9-c7ee869d2bf6",
//     "nonce": "81f8ac0c-e2a6-4b67-a4c2-475672f10ecb",
//     "redirect_uri": "https://dashboard.render.com/oauth/google",
//     "response_type": "id_token",
//     "scope": "email profile",
//     "service": "lso",
//     "o2v": "2",
//     "flowName": "GeneralOAuthFlow"
// }

</script>


<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
