<script setup>
    import { defineProps, ref, computed } from "vue";
    import { useUserStore } from '@/store/UserStore'
    import { useGameStore } from '@/store/GameStore'
    import { useStoryStore } from '@/store/StoryStore'

    const props = defineProps({
        activeStory: Object
    })

    const userStore = useUserStore()
    const gameStore = useGameStore()
    const storyStore = useStoryStore()
    const finalValue = ref("")
    const isModalVisible = ref(false)
    const showParticipantsEstimates = ref(false)

    // Check if an option is already selected
    const selectedOption = ref("")

    if (storyStore.activeStory.estimate != undefined) {
        for (const estimate of storyStore.activeStory.estimate) {
            if (estimate.userID == userStore.user.id) {
                selectedOption.value = {'userID': userStore.user.id, 'option': estimate.option}
            }
        }
    }

    // Define options: Categories start as string, need to remove title and split, then push the ? option
    let defineOptions = gameStore.game.category
    defineOptions = defineOptions.substring(defineOptions.search(": ") + 2, defineOptions.search(" and "))
    defineOptions = defineOptions.split(", ")
    defineOptions.push("?")
    const options = ref(defineOptions)

    // Template needs to display the estimates of all participants, and know
    // which estimate is the one from the logged user, because before
    // finalizing the round, the other estimates have to be hidden
    const selectEstimate = (option) => {
        finalValue.value = option
        selectedOption.value = {'userID': userStore.user.id, 'option': option}
        if (storyStore.activeStory.estimate == undefined) {
            storyStore.activeStory.estimate = [selectedOption.value]
        } else {
            let estimateExists = false
            for (const estimate of storyStore.activeStory.estimate) {
                if (estimate.userID == userStore.user.id) {
                    estimate.option = option
                    estimateExists = true
                }
            }
            if (!estimateExists) {
                storyStore.activeStory.estimate.push(selectedOption.value)
            }
        }
    }

    const acceptRound = () => {
        if (finalValue.value == "") {
            alert("Please enter a final story value to accept round")
        }
        else if ((storyStore.activeStory.estimate == undefined) || (storyStore.activeStory.estimate.length < gameStore.game.participants.length)) {
            isModalVisible.value = true
        }
        else {
            storyStore.activeStory.finalValue = finalValue.value
            storyStore.activeStory.estimated = true
            storyStore.activeStory = {}
        }
    }

    const toggleMissingParticipantsModal = () => {
        isModalVisible.value = !isModalVisible.value
    }

    const acceptMissingParticipantsModal = () => {
        storyStore.activeStory.finalValue = finalValue.value
        storyStore.activeStory.estimated = true
        storyStore.activeStory = {}
    }

    const playAgain = () => {
        finalValue.value = ""
        selectedOption.value = ""
        storyStore.activeStory.estimate = null
    }

    const revealCards = () => {
        showParticipantsEstimates.value = !showParticipantsEstimates.value
    }

    const cancelRound = () => {
        storyStore.activeStory.estimate = null
        storyStore.activeStory = {}
    }

    const deleteStory = () => {
        storyStore.deleteStory(storyStore.activeStory.id)
        .catch( error => {
            console.log(error)
        })
        gameStore.deleteGameStory(storyStore.activeStory.id)
        .catch( error => {
            console.log(error)
        })
        storyStore.fetchGameStories(gameStore.game.stories)
        storyStore.activeStory = {}
    }

    console.log("script end")

</script>

<template>
    <p class="current-story">CURRENT  STORY</p>
    <form @submit.prevent="sendForm">
        <fieldset>
            <legend><b>Story Name</b></legend>
            <BaseInput
                v-model="storyStore.activeStory.storyName"
                label="Enter the story name"
                type="text"
                noLabel
            />
        </fieldset>

        <fieldset>
            <legend><b>Story Description</b></legend>
            <BaseInput
                v-model="storyStore.activeStory.description"
                label="Enter the story description"
                type="text"
                noLabel
            />
        </fieldset>

        <div class="greyBox">
            <fieldset>
                <legend><b>Select your estimate</b></legend>
                <div class="options" v-for="(estimate, index) in storyStore.activeStory.estimate" :key="index">
                    <div :class="estimate.userID != userStore.user.id && !showParticipantsEstimates ? 'hide-participants-selections' : ''">{{estimate.option}}</div>
                </div>
                <hr>
                <div class="options" v-for="(option, index) in options" :key="index" @click="selectEstimate(option)">
                    <div :class="option == selectedOption.option ? 'selected-option' : ''">{{option}}</div>
                </div>
            </fieldset>
            <BaseModal
                v-show="isModalVisible"
                @closeModal="toggleMissingParticipantsModal"
                @acceptModal="acceptMissingParticipantsModal"
                acceptButton noFooter noBody
                >
                <template v-slot:header>
                    Do you want to accept the round before all participants estimated?
                </template>
            </BaseModal>
        </div>

        <div class="greyBox">
            <fieldset>
                <legend><b>Final value</b></legend>
                <BaseInput
                    v-model="finalValue"
                    label="Enter the story final value"
                    type="text"
                    noLabel
                />
                <hr>
                <button @click="acceptRound">Accept round</button>
                <button @click="playAgain">Play again</button>
                <button @click="revealCards">Reveal cards</button>
                <button @click="cancelRound">Cancel round</button> |
                <button class="delete-button" @click="deleteStory">Delete story</button>
            </fieldset>

        </div>

    </form>
</template>

<style scoped>

button {
    margin: 0px 5px;
}

.greyBox {
    background-color: lightgray;
    margin: 5px;
    border-color: darkgray;
}

.selected-option {
    background-color: green;
    color: white;
    width: 100%;
    text-align: center;
}

.hide-participants-selections {
    color: white;
    text-align: center;
    width: 100%;
}

.delete-button {
    background-color: red;
}

</style>