<script setup>

  import { useUserStore } from '@/store/UserStore'
  import { useGameStore } from '@/store/GameStore'
  import { useStoryStore } from '@/store/StoryStore'
  import { computed } from "vue";

  const gameStore = useGameStore()
  const storyStore = useStoryStore()
  const userStore = useUserStore()

  gameStore.fetchGames()
  storyStore.fetchStories()

  const isLoading = computed(() => {
    return ((gameStore.games.length == 0) || (storyStore.stories.length == 0))
  });

  const loggedUser = computed(() => {
    return userStore.user.name
  });

  console.log(":::APP script finished:::")

</script>

<template>
  <div v-if="!isLoading">
    <span>Logged in as: {{loggedUser}}</span>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link :to="{ name: 'CreateGameView' }">Create Firepoker Game</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.current-story {
    color: white;
    background-color: orange;
    margin: 5px;
}

.estimated-stories {
    color: white;
    background-color: green;
    margin: 5px;
}

.open-stories {
    color: white;
    background-color: gray;
    margin: 5px;
}

.options {
    display: inline-block;
    width: 35px;
    background-color: white;
    margin: 5px;
    text-align: center;
    border-color: black;
}
</style>
