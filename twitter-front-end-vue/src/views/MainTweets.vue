<template>
  <div class="container">
    <div id="navbar-area" class="navbar-area">
      <!-- 插入 Navbar -->
      <Navbar />
    </div>

    <div id="main-area" class="main-area">
      <div class="upper-area d-flex align-items-top">
        <div class="upper-area-content">
          <strong class="mr-5">首頁</strong>
        </div>
      </div>
      <main>
        <!-- 插入NewTweet -->
        <NewTweet @after-post-submit="afterPostSubmit" :user="presentUser" />

        <!-- 插入Tweet -->
        <Spinner v-if="isLoading" />
        <div class="tweets-panel">
          <Tweet
            v-for="tweet in tweets"
            :key="tweet.id"
            :initial-tweet="tweet"
            :initial-user="presentUser"
            @delete-tweet="deleteTweet"
          />
        </div>
      </main>
    </div>

    <div id="follow-recommend-area" class="follow-recommend-area">
      <FollowRecommend />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import FollowRecommend from "../components/FollowRecommend";
import NewTweet from "../components/NewTweet";
import Tweet from "../components/Tweet";
import { mapState } from "vuex";
import TweetsAPI from "../apis/tweets";
import { Toast } from "../utils/helpers";
import Spinner from "../components/Spinner";
import userAPI from "../apis/users";

export default {
  name: "Main",
  components: {
    Navbar,
    FollowRecommend,
    NewTweet,
    Tweet,
    Spinner,
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  data() {
    return {
      tweets: [],
      presentUser: {},
      isLoading: false,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true;
        const { data } = await TweetsAPI.readAll();
        this.tweets = [...data];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得所有推文，請稍候再試！",
        });
      }
    },
    async afterPostSubmit(description) {
      try {
        // for (let [key, value] of formData.entries()) {
        //   console.log(key + ", " + value);
        // }
        const { data } = await TweetsAPI.post({ description });
        console.log(data);
        // 注意：新推文的資料，未納入Likes和Replys的陣列
        this.tweets.unshift({
          id: data.tweet.id,
          description,
          User: this.presentUser,
          UserId: this.presentUser.id,
          createdAt: new Date(),
          isLiked: false,
          repliedCount: 0,
          LikeCount: 0,
        });

        this.fetchData();
        this.fetchCurrentUser();
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法新增推文，請稍候再試！",
        });
      }
    },
    async fetchCurrentUser() {
      try {
        const response = await userAPI.getCurrentUser();
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        const { data } = response;
        this.presentUser = {
          ...this.presentUser,
          ...data,
        };
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得當前用戶資料，請稍候！",
        });
      }
    },
    async deleteTweet(tweetId) {
      try {
        const response = await TweetsAPI.delete(tweetId);
        console.log(response);
        this.tweets = this.tweets.filter((tweet) => tweet.id !== tweetId);
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法刪除推文，請稍候再試！",
        });
      }
    },
  },
  created() {
    this.fetchData();
    this.fetchCurrentUser();
  },
};
</script>

<style scoped>
.upper-area-content {
  padding-top: 15px;
  padding-left: 15px;
}

.make-reply:hover {
  cursor: pointer;
}
</style>