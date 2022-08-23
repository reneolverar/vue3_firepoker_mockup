import axios from 'axios'

const apiClient = axios.create({
  // This code is for using the my-json-server online, but changes will not be persisted (only fakely added)
  // baseURL: 'https://my-json-server.typicode.com/reneolverar/Vue3_Real_World_Course',
  // This code is for using the local my-json-server, no limitations
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  async getGames() {
    return await apiClient.get('/games')
  },
  async getGame(id) {
    return await apiClient.get('/games/' + id)
  },
  async postGame(game) {
    return await apiClient.post('/games', game)
  },
  async deleteGame(id) {
    return await apiClient.delete('/games/' + id )
  },
  async updateGame(id, value) {
    return await apiClient.put('/games/' + id, value )
  },
  async getStories() {
    return await apiClient.get('/stories')
  },
  async getStory(id) {
    return await apiClient.get('/stories/' + id)
  },
  async postStory(story) {
    return await apiClient.post('/stories', story)
  },
  async deleteStory(id) {
    return await apiClient.delete('/stories/' + id )
  },
  async updateStory(id, value) {
    return await apiClient.put('/stories/' + id, value )
  },
}
