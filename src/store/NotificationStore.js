import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('NotificationStore', {
  state: () => ({
    notifications: [],
    nextId: 1
  }),
  actions: {
    push(notification) {
        this.notifications.push({
            ...notification,
            id: this.nextId++
        })
    },
    delete(notificationToRemove) {
        this.notifications = this.notifications.filter(
            notification => notification.id !== notificationToRemove.id
        )
    }
  }
})