<template>
  <div class="home">
    <h1>Welcome to your Firepoker App</h1>
    <p>You are logged in as: {{userStore.user.name}}</p>
    <p>To switch your user please select an option from below</p>

    <fieldset>
        <legend><b>Choose the user you want to use.</b></legend>
        <BaseSelect
            :options="userStore.getUsersExceptCurrent"
            v-model="selectedUser"
            label="Select a user"
            noLabel
        />
        <button @click="logIn">Log in</button>
    </fieldset>
    <p class="horizontal-banner">GAMES OWNED</p>
    <div class="games-container">
      <GameCard class="gameCard-container"
        v-for="game in gameStore.getGamesByUserID(userStore.user.id)"
        :key="game.id"
        :game="game"/>
    </div>
    <p class="horizontal-banner">GAMES PARTICIPATING</p>
    <div class="games-container">
      <GameCard class="gameCard-container"
        v-for="game in participatingGames"
        :key="game.id"
        :game="game"/>
    </div>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { ref, computed } from "vue";
import GameCard from '@/components/GameCard.vue'
import { useUserStore } from '@/store/UserStore'
import { useGameStore } from '@/store/GameStore'

// Variables
const userStore = useUserStore()
const gameStore = useGameStore()
const selectedUser = ref("")

// Lifecycle - code to run at setup:
gameStore.game = {}

// Computed values
const userGames = computed(() => {
    return gameStore.getGamesByUserID(userStore.user.id)
});

const participatingGames = computed(() => {
    return gameStore.getParticipatingGamesByUserID(userStore.user.id).filter(
        game => !gameStore.getGamesByUserID(userStore.user.id).includes(game)
    )
});

// Functions
const logIn = () => {
  console.log("logging in: ", selectedUser.value)
  userStore.user = userStore.getUserByName(selectedUser.value)
}

</script>

<style scoped>

  .gameCard-container {
    display: inline-block;
  }

  .horizontal-banner {
    color: white;
    background-color: green;
    margin: 5px;
  }
</style>