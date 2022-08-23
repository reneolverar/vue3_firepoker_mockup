<script setup>
    import { ref } from "vue";
    import { useRouter, useRoute } from 'vue-router'
    import APIService from '@/services/APIService.js'
    import { v4 as uuidv4 } from 'uuid'
    import { useGameStore } from '@/store/GameStore'
    import { useStoryStore } from '@/store/StoryStore'
    import { useUserStore } from '@/store/UserStore'
    import { mapState } from 'pinia'


    // const { capacity, attending, spacesLeft, increaseCapacity } = useEventSpace();
    const gameStore = useGameStore()
    const storyStore = useStoryStore()
    const userStore = useUserStore()

    const router = useRouter()

    const user = ref({});
    const game = ref({});
    const stories = ref("")

    // Initialize values for testing
    user.value.userName = "Rene"
    game.value.name = "Firepoker"
    game.value.description = "Description"
    stories.value = "Story 1\nStory 2\nStory 3"
    game.value.category = "Scrum: 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100 and ?"

    const sendForm = () => {
        // Split stories
        let spliStories = stories.value.split("\n")
        // Save stories
        game.value.stories = []
        let storyValues = []
        spliStories.forEach(story => {
            let storyID = uuidv4()
            game.value.stories.push(storyID)
            storyValues.push({id: storyID, storyName: story, estimated: false})
        });

        const newGame = {
            ...game.value,
            ...user.value,
            organizer: userStore.user.id,
            participants: [
                {
                    id: userStore.user.id,
                    userName: user.value.userName + "(moderator)"
                }
            ],
            id: uuidv4()
        }
        console.log("New game:", newGame)

        // Post game and stories
        gameStore.createGame(newGame)
        .then( () => {
            storyValues.forEach(story => {
                storyStore.createStory(story)
                .catch( error => {
                    console.log(error)
                })
            });
            router.push({
                name: 'GameView',
                params: { id: newGame.id }
            })
        })
        .catch( error => {
            console.log(error)
        })
    }

</script>

<template>
    <h1>Create a new game</h1>
    <p>Logged in as {{userStore.user.name}}</p>
    <p>You can start inviting estimators after you have created the game.</p>

    <form @submit.prevent="sendForm">
        <fieldset>
            <legend><b>Your name (what other team members will see)</b></legend>
            <BaseInput
                v-model="user.userName"
                label="Enter your name"
                type="text"
                noLabel
            />
        </fieldset>

        <fieldset>
            <legend><b>Game name</b></legend>
            <BaseInput
                v-model="game.name"
                label="Enter game name"
                type="text"
                noLabel
            />
            <span><br>For example: 'FirePoker project'</span>
        </fieldset>


        <fieldset>
            <legend><b>Game description (optional)</b></legend>
            <BaseInput
                v-model="game.description"
                label="Enter game description"
                type="text"
                noLabel
            />
        </fieldset>

        <fieldset>
            <legend><b>Import stories (optional, one per line)</b></legend>
            <BaseTextArea
                v-model="stories"
                label="Enter stories"
                type="text"
                noLabel
            />
            <span><br>Copy and paste to import stories into your game.</span>
        </fieldset>

        <fieldset>
            <legend><b>Choose the set of estimate cards you want to use.</b></legend>
            <BaseSelect
                :options="gameStore.categories"
                v-model="game.category"
                label="Select a category"
            />
        </fieldset>

        <div>
            <button>Create game</button>
            or
            <a href="url">Cancel</a>
        </div>
    </form>
</template>