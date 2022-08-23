import { defineStore } from 'pinia'
import APIService from '@/services/APIService.js'
import { useNotificationStore as notificationStore } from '@/store/NotificationStore'

export const useStoryStore = defineStore('StoryStore', {
    state: () => ({
        stories: [],
        activeGameID: "",
        activeGameStories: [],
        activeStory: {},
        storiesTotal: 0,
    }),
    getters: {
        numberOfStories: state => state.storiesTotal,
        getStoryById: state => id => {
            return state.stories.find(story => story.id == id)
        },
        getGameStories: state => storyIDs => {
            return state.stories.filter(story => storyIDs.includes(story.id))
        },
        getGameEstimatedStories: state => {
            return state.activeGameStories.filter(story => story.estimated == true)
        },
        getGameOpenStories: state => {
            return state.activeGameStories.filter(story => story.estimated == false)
        },
    },
    actions: {
        async createStory(story) {
            return await APIService.postStory(story)
            .then(() => {
                this.stories.push(story)
                const notification = {
                    type: 'success',
                    message: 'Your storie has been created!'
                }
                notificationStore().push(notification)
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching stories: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        async deleteStory(storyID) {
            return await APIService.deleteStory(storyID)
            .then(() => {
                this.stories = this.stories.filter(story => story.id == storyID)
                const notification = {
                    type: 'success',
                    message: 'Your story has been deleted!'
                }
                notificationStore().push(notification)
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching stories: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        fetchGameStories (storyIDs) {
            this.activeGameStories = this.getGameStories(storyIDs)
        },
        async fetchStories() {
            console.log(":::Fetching Stories:::")
            return await APIService.getStories()
            .then(response => {
                this.stories = response.data
                this.storiesTotal = parseInt(response.data.length)
                console.log(":::Stories fetched:::")
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching stories: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        async fetchStory(id) {
            const existingStory = this.getStoryById(id)
            if (existingStory) {
                this.activeStory = existingStory
            } else {
                return await APIService.getStory(id)
                .then(response => {
                    console.log("storie fetched")
                    this.activeStory = response.data
                })
                .catch(error => {
                    console.log(error)
                    const notification = {
                        type: 'error',
                        message: 'There was a problem fetching stories: ' + error.message
                    }
                    notificationStore().push(notification)
                    throw(error)
                })
            }
        },
        setActiveStory(storyID) {
            this.activeStory = this.getStoryById(storyID)
        }
    }
})