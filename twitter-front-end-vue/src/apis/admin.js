import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')


export default {
  getAdminTweets() {
    return apiHelper.get('/api/admin/tweets', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getAdminUsers() {
    return apiHelper.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteTweet(tweetId) {
    return apiHelper.delete(`/api/admin/tweets/${tweetId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}