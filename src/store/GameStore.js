import { defineStore } from 'pinia'
import APIService from '@/services/APIService.js'
import { useNotificationStore as notificationStore } from '@/store/NotificationStore'

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},
        gamesTotal: 0,
        categories: [
            'Scrum: 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100 and ?',
            'Fibonacci: 0, ½, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 and ?',
            'Sequential: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 and ?',
            'Hourly: 0, 4, 8, 16, 24, 32, 40, 60, 80, and ?',
            'T-Shirt: XXS, XS, S, M, L, XL, XXL and ?'
        ],
    }),
    getters: {
        // catLength: state => state.categories.length,
        numberOfGames: state => state.gamesTotal,
        getGameById: state => id => {
            return state.games.find(game => game.id == id)
        },
        getGamesByCategory: state => category => {
            let count = 0
            state.games.forEach(game => {
                if (game.category == category) {
                count++
                }
            })
            return count
        },
        getGamesByUserID: state => userID => {
            let userGames = []
            state.games.forEach(game => {
                if (game.organizer == userID) {
                    userGames.push(game)
                }
            })
            return userGames
        },
        getParticipatingGamesByUserID: state => userID => {
            let userGames = []
            state.games.forEach(game => {
                game.participants.forEach(participant => {
                    if (participant.id == userID) {
                        userGames.push(game)
                    }
                })
            })
            return userGames
        },
        getGameParticipantsIDs: state => {
            let participantsIDs = []
            Object.keys(state.game).length != 0 ?
                state.game.participants.forEach(
                    participant => participantsIDs.push(participant.id)
                ) : []
            return participantsIDs
        },
    },
    actions: {
        async createGame(game) {
            return await APIService.postGame(game)
            .then(() => {
                this.games.push(game)
                const notification = {
                    type: 'success',
                    message: 'Your game has been created!'
                }
                notificationStore().push(notification)
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching games: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        async deleteGame(gameToDelete) {
            return await APIService.deleteGame(gameToDelete)
            .then(() => {
                this.games = this.games.filter(game => game.id == gameToDelete)
                this.game = {}
                const notification = {
                    type: 'success',
                    message: 'Your game has been deleted!'
                }
                notificationStore().push(notification)
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching games: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        async deleteGameStory(storyID) {
            let remainingStories = this.game.stories.filter(story => story != storyID)
            let updatedGame = {...this.game}
            updatedGame.stories = remainingStories
            return await APIService.updateGame(this.game.id, updatedGame)
            .then(() => {
                this.game.stories = remainingStories
            })
            .catch(error => {
                console.log(error)
                throw(error)
            })
        },
        async fetchGames() {
            console.log(":::Fetching Games:::")
            return await APIService.getGames()
            .then(response => {
                this.games = response.data
                this.gamesTotal = parseInt(response.data.length)
                console.log(":::Games Fetched :::")
            })
            .catch(error => {
                console.log(error)
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching games: ' + error.message
                }
                notificationStore().push(notification)
                throw(error)
            })
        },
        async fetchGame(id) {
            console.log(":::Fetching Game:::")
            const existingGame = this.getGameById(id)
            if (existingGame) {
                this.game = existingGame
                console.log(":::Game Fetched :::")
            } else {
                return await APIService.getGame(id)
                .then(response => {
                    this.game = response.data
                    console.log(":::Game Fetched :::")
                })
                .catch(error => {
                    console.log(error)
                    const notification = {
                        type: 'error',
                        message: 'There was a problem fetching games: ' + error.message
                    }
                    notificationStore().push(notification)
                    throw(error)
                })
            }
        }
    }
})