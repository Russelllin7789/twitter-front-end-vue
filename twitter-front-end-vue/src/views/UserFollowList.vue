<template>
  <div class="container">
    <div id="navbar-area" class="navbar-area">
      <!-- 插入 Navbar -->
      <Navbar />
    </div>

    <div id="main-area" class="main-area">
      <div class="upper-area d-flex align-items-top">
        <div class="upper-area-content d-flex align-items-center">
          <router-link
            :to="{
              name: 'user-profile',
              params: { id: user.id },
            }"
          >
            <span class="mr-4" style="color: #000000">&larr;</span>
          </router-link>

          <div class="user">
            <strong class="name">{{ user.name }}</strong>
            <p class="tweets-count small">{{ user.tweetsCount }} 推文</p>
          </div>
        </div>
      </div>
      <main>
        <ul class="nav nav-tabs">
          <li class="nav-item" @click.stop.prevent="toggleTab('followers')">
            <router-link
              :to="{
                name: 'user-followlist',
                params: { id: user.id, followship: 'followers' },
              }"
              class="nav-link"
            >追隨者</router-link>
          </li>
          <li class="nav-item" @click.stop.prevent="toggleTab('followings')">
            <router-link
              :to="{
                name: 'user-followlist',
                params: { id: user.id, followship: 'followings' },
              }"
              class="nav-link"
            >正在追隨</router-link>
          </li>
        </ul>

        <div class="followers-panel" v-if="nowTabbed === 'followers'">
          <!-- 拉取資料完成前顯示Spinner -->
          <Spinner v-if="isLoading" />

          <!-- 無建立任何推文時，顯示註明文字 -->
          <div class="no-data" v-else-if="!isLoading && !followers.length">
            <h3>尚未有追隨者</h3>
          </div>

          <Follower
            v-for="follower in followers"
            :key="follower.followerId"
            :initial-follower="follower"
          />
        </div>
        <div class="followings-panel" v-if="nowTabbed === 'followings'">
          <!-- 拉取資料完成前顯示Spinner -->
          <Spinner v-if="isLoading" />

          <!-- 無建立任何推文時，顯示註明文字 -->
          <div class="no-data" v-else-if="!isLoading && !followings.length">
            <h3>尚未有正在追隨者</h3>
          </div>

          <Following
            v-for="following in followings"
            :key="following.followingId"
            :initial-following="following"
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
import Follower from "../components/Follower";
import Following from "../components/Following";
import userAPI from "../apis/users";
import Spinner from "../components/Spinner";
import { Toast } from "../utils/helpers";

export default {
  components: {
    Navbar,
    FollowRecommend,
    Follower,
    Following,
    Spinner
  },
  data() {
    return {
      followers: [],
      followings: [],
      user: {},
      userTweetsCount: -1,
      nowTabbed: this.$route.params.followship,
      isLoading: true
    };
  },
  methods: {
    async fetchUser(id) {
      try {
        const response = await userAPI.readUser({ id });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.user = {
          ...this.user,
          ...data
        };
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試"
        });
      }
    },
    async fetchFollowers(id) {
      try {
        const response = await userAPI.readFollowers({ id });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.followers = [...data];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得跟隨者資料，請稍後再試"
        });
      }
    },
    async fetchFollowings(id) {
      try {
        const response = await userAPI.readFollowings({ id });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.followings = [...data];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得跟隨中資料，請稍後再試"
        });
      }
    },
    toggleTab(item) {
      this.nowTabbed = item;
    }
  },
  created() {
    const { id } = this.$route.params;
    this.fetchUser(id);
    this.fetchFollowers(id);
    this.fetchFollowings(id);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchUser(id);
    this.fetchFollowers(id);
    this.fetchFollowings(id);
    next();
  },
  // 當使用者追隨某人時，同步就重新拉一次資料到followings當中
  watch: {
    followings() {
      const { id } = this.$route.params;
      this.fetchFollowings(id);
    }
  }
};
</script>

<style lang="scss" scoped>
.upper-area-content {
  @include upper-area-content;
  p {
    margin: 0;
    line-height: 10px;
  }
  .name {
    line-height: 19px;
    font-size: 19px;
  }

  .tweets-count {
    color: $small_text;
  }
}

.nav {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  .nav-link {
    color: $small_text;
    &.active {
      border: hidden;
      border-bottom: 2px solid $theme_orange;
      color: $theme_orange;
    }
  }
}

.no-data {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $small_text;
}
</style>