import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    users: [
      {
        id: 'User1',
        name: 'Rene Olvera'
      },
      {
        id: 'User2',
        name: 'Emir Rencber'
      },
      {
        id: 'User3',
        name: 'Toni Gress'
      },
    ],
    user: {
      id: 'User1',
      name: 'Rene Olvera'
    }
  }),
  getters: {
    getUserIDsList(state) {
      let userList = []
      state.users.forEach(user => userList.push(user.id))
      return userList
    },
    getUserNamesList(state) {
      let userList = []
      state.users.forEach(user => userList.push(user.name))
      return userList
    },
    getUsersExceptCurrent(state) {
        let userList = this.getUserNamesList
        return userList.filter(user => user != state.user.name)
    },
    getMissingParticipantsNames() {
        return (participantsIDs) => {
            let missingParticipansIDs = this.getUserIDsList.filter(userID => !participantsIDs.includes(userID))
            let missingParticipansNames = []
            missingParticipansIDs.forEach(id => {
                missingParticipansNames.push(this.getUserNameByID(id))
            });
            return missingParticipansNames
        }
    },
    getUserByName: state => name => {
        return state.users.find(user => user.name == name)
    },
    getUserIDByName: state => name => {
      let user = state.users.find(user => user.name == name)
        return user.id
    },
    getUserNameByID: state => id => {
      let user = state.users.find(user => user.id == id)
        return user.name
    },
  }
})