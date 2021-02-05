<template>
  <div class="container d-flex">
    <div id="navbar-area" class="navbar-area">
      <Navbar />
    </div>
    <div class="main">
      <div class="main-title d-flex">
        <router-link :to="{ name: 'main-tweets' }" class="arrow"></router-link>
        <div class="title">推文</div>
      </div>
      <div class="tweet-detail-container">
        <!-- 插入TweetDetail -->
        <TweetDetail
          :user="user"
          :initial-tweet="tweet"
          @after-post-submit="afterPostSubmit"
          v-if="tweet.id !== -1"
          :initial-user="user"
        />
      </div>
      <div class="tweet-reply-container">
        <!-- 插入TweetReply -->
        <h5 class="no-reply" v-if="replies.length < 1">本推文目前沒有回覆Q__Q</h5>
        <TweetReply
          v-for="reply in replies"
          :key="reply.id"
          :initial-reply="reply"
          :initial-user="user"
          :tweet="tweet"
        />
      </div>
    </div>
    <div id="follow-recommend-area" class="follow-recommend-area">
      <!-- 插入FollowRecommend -->
      <FollowRecommend />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import FollowRecommend from "../components/FollowRecommend";
import TweetReply from "../components/TweetReply";
import TweetDetail from "../components/TweetDetail";
import { Toast } from "../utils/helpers";
import ReplyAPI from "../apis/replies";
import TweetAPI from "../apis/tweets";
import userAPI from "../apis/users";
import { mapState } from "vuex";

// GET /api/users/:id
// const dummyUser = {
//   currentUser: {
//     id: 15,
//     email: "user1@example.com",
//     password: "123445",
//     name: "user666",
//     avatar: "https://i.imgur.com/NZWqfN3.jpg",
//     introduction: "Quam et veniam.",
//     isAdmin: false,
//     account: "@user666",
//     cover:
//       "https://www.myvideo.net.tw/blog/assets/2020/06-30/blog0162964980.jpg",
//     createdAt: "2020-12-16T06:02:24.000Z",
//     updatedAt: "2020-12-16T06:02:24.000Z",
//   },
//   isAuthenticated: true,
// };

export default {
  name: "MainTweetsReplyList",
  components: {
    Navbar,
    FollowRecommend,
    TweetReply,
    TweetDetail
  },
  data() {
    return {
      user: {},
      tweet: {
        id: -1,
        UserId: -1,
        description: "",
        createdAt: "",
        updatedAt: "",
        User: {
          id: -1,
          account: "",
          name: "",
          avatar: ""
        },
        isLiked: false,
        repliedCount: 0,
        LikeCount: 0,
        isSelf: false
      },
      replies: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchTweet(id);
    this.fetchReply(id);
    next();
  },
  created() {
    const { id: tweetId } = this.$route.params;
    this.fetchTweet(tweetId);

    const { id: replyId } = this.$route.params;
    this.fetchReply(replyId);

    this.fetchCurrentUser();
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"])
  },
  methods: {
    async fetchTweet(tweetId) {
      try {
        const { data } = await TweetAPI.read(tweetId);
        this.tweet = data;
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文細節，請稍候再試！"
        });
      }
    },
    async fetchReply(replyId) {
      try {
        const { data } = await ReplyAPI.getReply(replyId);
        this.replies = [...data];
      } catch (error) {
        console.log("error:", error);
        const { data } = await ReplyAPI.getReply(replyId);
        if (data.length === 0) return;
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文回覆，請稍候再試！"
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
        this.user = {
          ...this.user,
          ...data
        };
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得用戶資料，請稍等！"
        });
      }
    },
    async afterPostSubmit(comment) {
      try {
        const { id: tweetId } = this.$route.params;
        const data = await ReplyAPI.addReply(tweetId, { comment });
        if (data.statusText !== "OK") {
          throw new Error(data.message);
        }
        //拉資料回前端渲染;
        const { id } = data;
        this.replies.unshift({
          id,
          TweetId: tweetId,
          UserId: this.user.id,
          createdAt: new Date(),
          updateAt: new Date(),
          comment,
          User: {
            account: this.user.account,
            avatar: this.user.avatar,
            name: this.user.name
          }
        });
        this.tweet.repliedCount++;
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法新增回覆，請稍候再試！"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.upper-area-content {
  display: flex;
  align-items: top;
  padding-left: 15px;
  p {
    margin: 0;
    line-height: 10px;
  }
}

.main {
  padding: 0;
  width: 500px;
  height: 3000px;
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  border-bottom: 1px solid #e6ecf0;
  .main-title {
    border-bottom: 1px solid #e6ecf0;
    height: 55px;
    .arrow {
      background-image: url("https://i.imgur.com/MHQuvWA.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      margin: auto 43px auto 1.3rem;
      width: 17px;
      height: 14px;
    }

    .title {
      padding: 0 10px 10px 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 55px;
    }
  }
}

.tweet-reply-container {
  height: 100%;
  .no-reply {
    margin: 15% 25%;
  }
}
</style>