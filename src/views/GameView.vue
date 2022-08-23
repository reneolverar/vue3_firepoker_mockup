<script setup>
    import { defineProps, computed, ref } from "vue";
    import { useRouter } from 'vue-router'
    import PlayStory from "@/components/PlayStory";
    import { useUserStore } from '@/store/UserStore'
    import { useGameStore } from '@/store/GameStore'
    import { useStoryStore } from '@/store/StoryStore'

    // Props
    const props = defineProps({
        id: String
    })

    // Variables
    const router = useRouter()
    const userStore = useUserStore()
    const gameStore = useGameStore()
    const storyStore = useStoryStore()
    const isModalVisible = ref(false)
    const shareWith = ref("")

    // Lifecycle - code to run at setup:
    gameStore.fetchGame(props.id)
    .then( () => {
        storyStore.fetchGameStories(gameStore.game.stories)
    })

    storyStore.activeStory = {}

    // Computed values
    const isLoading = computed(() => {
        return (Object.keys(gameStore.game).length == 0) || (storyStore.activeGameStories.length == 0)
    });

    const shareOptions = computed(() => {
        return userStore.getMissingParticipantsNames(gameStore.getGameParticipantsIDs)
    });

    // Functions
    const openStory = (storyID) => {
        storyStore.setActiveStory(storyID)
    }

    const toggleShareGameModal = () => {
        isModalVisible.value = !isModalVisible.value
    }

    const acceptShareGameModal = () => {
        gameStore.game.participants.push({id: userStore.getUserIDByName(shareWith.value)})
        isModalVisible.value = false
    }

    const deleteGame = () => {
        gameStore.game.stories.forEach(storyID => {
            storyStore.deleteStory(storyID)
            .catch( error => {
                console.log(error)
            })
        });
        gameStore.deleteGame(props.id)
        .then( () => {
            router.push({
                name: 'home'
            })
        })
        .catch( error => {
            console.log(error)
        })
    }

</script>

<template>
    <div v-if="!isLoading">
        <fieldset>
            <legend><b>Game: {{gameStore.game.name}}</b></legend>
            <span>Description: {{gameStore.game.description}} </span>
            <span><br>Participants:</span>
            <li v-for="(participant, index) in gameStore.game.participants" :key="index">
                <span v-if="participant.userName">{{ participant.userName }}</span>
                <span v-else>{{ userStore.getUserNameByID(participant.id) }}</span>
            </li>
            <button @click="toggleShareGameModal">Share this game</button>
            <BaseModal
                v-show="isModalVisible"
                @closeModal="toggleShareGameModal"
                @acceptModal="acceptShareGameModal"
                acceptButton
                noFooter
            >
                <template v-slot:header>
                    Please select an user to share with
                </template>

                <template v-slot:body>
                    <BaseSelect
                        :options="shareOptions"
                        v-model="shareWith"
                    />
                </template>

                 <template v-slot:footer>
                </template>
            </BaseModal>
            <button @click="deleteGame">Delete Game</button>

        </fieldset>

        <div v-if="storyStore.getGameEstimatedStories.length > 0">
            <p class="estimated-stories">ESTIMATED STORIES</p>
            <li v-for="story in storyStore.getGameEstimatedStories" :key="story.id" @click="openStory(story.id)">
                Estimation for {{ story.storyName }}: {{story.finalValue}}
            </li>
        </div>
        <p class="gameIntroBox"><b>Hi {{gameStore.game.userName}}!</b> Add or select a story to start a new round.</p>
        <PlayStory v-if="Object.keys(storyStore.activeStory).length != 0"></PlayStory>
        <p class="open-stories">OPEN STORIES</p>
        <p>Story list</p>
        <ul>
            <li v-for="story in storyStore.getGameOpenStories" :key="story.id" @click="openStory(story.id)">
                {{ story.storyName }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .gameIntroBox {
        color: darkblue;
        background-color: lightblue;
    }

</style>