<template>
  <div class="container">
    <div id="navbar-area" class="navbar-area">
      <!-- 插入 Navbar -->
      <Navbar />
    </div>

    <div id="main-area" class="main-area">
      <div class="upper-area d-flex align-items-top">
        <div class="upper-area-content d-flex align-items-center">
          <router-link to="/main">
            <span class="mr-4" style="color: #000000">&larr;</span>
          </router-link>

          <div class="user">
            <strong class="name">{{ user.name }}</strong>
            <p class="tweets-count small">{{ user.tweetsCount }} 推文</p>
          </div>
        </div>
      </div>

      <main>
        <div class="info-area d-flex flex-column align-items-end pb-3">
          <div class="image-wrapper">
            <div class="cover-cropper" v-if="cover === '' && user.cover === '0'">
              <img src="../assets/default-cover.jpg" class="cover" />
            </div>
            <div class="cover-cropper" v-else>
              <img :src="user.cover" class="cover" />
            </div>
            <div class="image-cropper" v-if="avatar === '' && user.avatar === null">
              <img src="../assets/default-user.svg" class="avatar" />
            </div>
            <div class="image-cropper" v-else>
              <img :src="user.avatar" class="avatar" />
            </div>
          </div>
          <div
            class="edit-btn mt-2 mr-2"
            data-toggle="modal"
            data-target="#postEdit"
            v-if="user.isSelf"
          >
            <strong>編輯個人資料</strong>
          </div>
          <div class="contact-wrapper d-flex align-items-center mt-2" v-else>
            <div class="mail">
              <img src="../assets/Mail.svg" />
            </div>
            <div class="noti mx-2">
              <img src="../assets/Noti.svg" />
            </div>

            <div class="followship mr-3">
              <div class="following" v-if="user.isFollowed">正在跟隨</div>
              <div
                class="deleteFollow"
                v-if="user.isFollowed"
                @click.stop.prevent="deleteFollow(user.id)"
              >取消跟隨</div>

              <div class="unfollow" v-else @click.stop.prevent="follow(user.id)">跟隨</div>
            </div>
          </div>
        </div>

        <div class="intro-wrapper px-2">
          <strong class="name">{{ user.name }}</strong>
          <p class="account">{{ user.account }}</p>
          <p class="introduction">{{ user.introduction }}</p>
        </div>

        <div class="followship-wrapper p-2 d-flex">
          <router-link
            :to="{
              name: 'user-followlist',
              params: { id: user.id, followship: 'followings' },
            }"
          >
            <p class="followings-count mr-2">{{ user.followingsCount }}個跟隨中</p>
          </router-link>
          <router-link
            :to="{
              name: 'user-followlist',
              params: { id: user.id, followship: 'followers' },
            }"
          >
            <p class="followers-count">{{ user.followersCount }}位跟隨者</p>
          </router-link>
        </div>
        <!--modal-->
        <div
          class="modal fade"
          id="postEdit"
          tabindex="-1"
          role="dialog"
          aria-labelledby="postEditLabel"
          aria-hidden="true"
        >
          <form
            class="w-100 d-flex flex-column align-items-end"
            @submit.stop.prevent="handleEditSubmit"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    @click="cancelEdit"
                  >
                    <img src="../assets/Close.svg" />
                  </button>
                  <strong class="title">編輯個人資料</strong>
                  <button
                    type="submit"
                    class="btn btn-primary post"
                    :disabled="
                      this.name.length > 50 ||
                      this.introduction.length > 160 ||
                      this.name.length === 0
                    "
                  >儲存</button>
                </div>
                <div class="modal-body px-0">
                  <div class="edit-cover">
                    <div class="cover-edit-wrapper d-flex">
                      <!--如果user為剛註冊者或無上傳cover者-->
                      <img
                        src="../assets/default-cover.jpg"
                        alt="cover-default"
                        class="cover-sample"
                        v-if="user.cover === '0' && cover === ''"
                      />
                      <!--即時預覽效果-->
                      <img
                        :src="this.cover"
                        alt="cover-thumbnail"
                        class="cover-sample"
                        v-if="cover !== ''"
                      />
                      <!--即時帶入user的cover-->
                      <img :src="user.cover" alt="present-cover" class="edit-cover-photo" v-else />
                      <input
                        type="file"
                        id="cover-image"
                        name="cover"
                        accept="image/png, image/jpeg, image/gif, image/jpg"
                        class="new-cover-image"
                        @change="handleCoverChange"
                      />
                      <img src="../assets/camera.svg" class="cover-camera" />
                      <img src="../assets/plus.svg" alt class="cover-plus" />
                      <div class="cancel-edit">
                        <img
                          src="../assets/closeWhite.svg"
                          alt
                          class="cancal-edit"
                          @click="cancelEdit"
                        />
                      </div>
                    </div>
                    <div class="avatar-edit-wrapper">
                      <div class="edit-avatar">
                        <!--如果user為剛註冊者或無上傳avatar者-->
                        <img
                          src="../assets/default-user.svg"
                          alt="avatar-default"
                          class="avartar-sample"
                          v-if="avatar === '' && user.avatar === null"
                        />
                        <!--即時預覽效果-->
                        <img
                          :src="this.avatar"
                          alt="avatar-thumbnail"
                          class="avatar-sample"
                          v-if="avatar !== ''"
                        />
                        <!--即時帶入既有avatar-->
                        <img
                          :src="user.avatar"
                          alt="present-avatar"
                          class="edit-avatar-photo"
                          v-else
                        />
                        <input
                          type="file"
                          id="avatar-image"
                          name="avatar"
                          accept="image/png, image/jpeg, image/gif, image/jpg"
                          class="new-avatar-image"
                          @change="handleAvatarChange"
                        />
                        <img src="../assets/camera.svg" class="avatar-camera" />
                        <img src="../assets/plus.svg" alt="avatar-plus" class="avatar-plus" />
                      </div>
                    </div>
                  </div>

                  <div class="edit-area">
                    <div class="edit-title">名稱</div>
                    <textarea
                      name="name"
                      class="text-name w-100"
                      id="text-name"
                      cols="20"
                      rows="1"
                      v-model="name"
                      :placeholder="user.name"
                    ></textarea>
                    <div class="name-edit-num-limit">{{ this.name.length }}/50</div>
                    <div class="edit-title">自我介紹</div>
                    <textarea
                      name="introduction"
                      class="text-intro w-100"
                      id="text-intro"
                      cols="20"
                      rows="6"
                      v-model="introduction"
                      :placeholder="user.introduction"
                    ></textarea>
                    <div class="intro-edit-num-limit">{{ this.introduction.length }}/160</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="tab-area">
          <ul class="nav nav-tabs pt-2">
            <li class="nav-item" @click.stop.prevent="toggleTab(null)">
              <router-link
                :to="{
                  name: 'user-profile',
                  params: { id: user.id },
                }"
                class="nav-link"
              >推文</router-link>
            </li>
            <li class="nav-item" @click.stop.prevent="toggleTab('with_replies')">
              <router-link
                :to="{
                  name: 'user-profile',
                  params: { id: user.id, category: 'with_replies' },
                }"
                class="nav-link"
              >推文與回覆</router-link>
            </li>
            <li class="nav-item" @click.stop.prevent="toggleTab('likes')">
              <router-link
                :to="{
                  name: 'user-profile',
                  params: { id: user.id, category: 'likes' },
                }"
                class="nav-link"
              >喜歡的內容</router-link>
            </li>
          </ul>
        </div>

        <div class="tweets-area">
          <div class="user-tweets-panel" v-if="!nowTabbed">
            <!-- 拉取資料完成前顯示Spinner -->
            <Spinner v-if="isLoading" />

            <!-- 無建立任何推文時，顯示註明文字 -->
            <div class="no-data" v-else-if="!isLoading && !tweets.length">
              <h3>尚未建立任何推文</h3>
            </div>

            <!-- 綁入UserTweets.vue -->
            <UserTweets
              v-else-if="!isLoading"
              v-for="tweet in tweets"
              :key="tweet.id"
              :initial-tweet="tweet"
              :user="user"
              :current-user="currentUser"
            />
          </div>

          <div class="user-tweets-replies-panel" v-if="nowTabbed === 'with_replies'">
            <!-- 拉取資料完成前顯示Spinner -->
            <Spinner v-if="isLoading" />

            <!-- 無建立任何推文時，顯示註明文字 -->
            <div class="no-data" v-else-if="!isLoading && !replies.length">
              <h3>尚未回覆任何推文</h3>
            </div>

            <!-- 綁入UserTweetsReplies.vue -->
            <UserTweetsReplies
              v-else-if="!isLoading"
              v-for="reply in replies"
              :key="reply.id"
              :initial-reply="reply"
              :user="user"
              :current-user="currentUser"
            />
          </div>

          <div class="user-liked-tweets-panel" v-if="nowTabbed === 'likes'">
            <!-- 拉取資料完成前顯示Spinner -->
            <Spinner v-if="isLoading" />

            <!-- 無建立任何推文時，顯示註明文字 -->
            <div class="no-data" v-else-if="!isLoading && !likes.length">
              <h3>尚未有喜愛的推文</h3>
            </div>

            <!-- 綁入UserLikedTweets.vue -->
            <UserLikedTweets
              v-else-if="!isLoading"
              v-for="like in likes"
              :key="like.id"
              :initial-like="like"
              :current-user="currentUser"
            />
          </div>
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
import UserTweets from "../components/UserTweets";
import UserLikedTweets from "../components/UserLikedTweets";
import UserTweetsReplies from "../components/UserTweetsReplies";
import { Toast } from "../utils/helpers";
import { emptyImageFilter } from "../utils/mixins";
import $ from "jquery";
import { mapState } from "vuex";
import Spinner from "../components/Spinner";
import usersAPI from "../apis/users";
import followshipAPI from "../apis/followship";

export default {
  name: "UserProfile",
  components: {
    Navbar,
    FollowRecommend,
    UserTweets,
    UserLikedTweets,
    UserTweetsReplies,
    Spinner
  },
  mixins: [emptyImageFilter],
  computed: {
    ...mapState(["currentUser", "isAuthenticated"])
  },
  data() {
    return {
      tweets: [],
      likes: [],
      replies: [],
      user: {},
      nowTabbed: this.$route.params.category,
      cover: "",
      avatar: "",
      name: "",
      introduction: "",
      isLoading: true
    };
  },
  methods: {
    async fetchUserTweets(id) {
      try {
        const response = await usersAPI.readTweets({ id });

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.tweets = [...data];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);

        Toast.fire({
          icon: "error",
          title: "無法取得使用者推文，請稍後再試"
        });
      }
    },
    async fetchUserLikes(id) {
      try {
        const response = await usersAPI.readLikes({ id });
        console.log(response);

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.likes = [...data];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者喜歡的內容，請稍後再試"
        });
      }
    },
    async fetchUser(id) {
      try {
        const response = await usersAPI.readUser({ id });

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
    async fetchReplies(id) {
      try {
        const response = await usersAPI.readRepliedTweets({ id });

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        const { data } = response;
        //建構set()建構子實例，取出TweetId不重複的物件
        const set = new Set();
        this.replies = data.filter(reply =>
          !set.has(reply.TweetId) ? set.add(reply.TweetId) : false
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者推文與回覆，請稍後再試"
        });
      }
    },
    toggleTab(item) {
      this.nowTabbed = item;
    },
    async follow(id) {
      try {
        const response = await followshipAPI.follow({ id });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        console.log(response);
        this.user = {
          ...this.user,
          isFollowed: true
        };
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法成功追蹤，請稍後再試"
        });
      }
    },
    async deleteFollow(id) {
      try {
        const response = await followshipAPI.unfollow({ id });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        console.log(response);
        this.user = {
          ...this.user,
          isFollowed: false
        };
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取消追蹤，請稍後再試"
        });
      }
    },
    // modal表單資料交付
    async handleEditSubmit(e) {
      try {
        // 必須至少修改名字，否則無法提交
        if (!this.name.trim()) return;

        const form = e.target;
        const formData = new FormData(form);
        for (let [name, value] of formData.entries()) {
          console.log(name + ":" + value);
        }

        // 資料處理：假如使用者並未修改名字以外的三個key，則刪除該key
        const otherKey = ["introduction", "cover", "avatar"];
        otherKey.forEach(item => {
          if (!item) {
            formData.delete(item);
          }
          return;
        });

        // 回拋資料給對應 API
        const id = this.currentUser.id;
        const { data } = await usersAPI.updateUser(id, { formData });

        // 解構賦值回前端渲染
        const { user } = data;
        const { avatar, cover, name, introduction } = user;

        this.user = {
          ...this.user,
          avatar,
          cover,
          name,
          introduction
        };
      } catch (error) {
        console.log("error:", error);
        Toast.fire({
          icon: "error",
          title: "暫時無法更新用戶資料，請稍候再試！"
        });
      }
      $("#postEdit").modal("hide");
    },
    handleCoverChange(e) {
      const { files } = e.target;
      if (files.length === 0) return; // 使用者並未上傳封面照
      const imageURL = window.URL.createObjectURL(files[0]);
      this.cover = imageURL;
    },
    handleAvatarChange(e) {
      const { files } = e.target;
      if (files.length === 0) return; //使用者並未上傳大頭照
      const imageURL = window.URL.createObjectURL(files[0]);
      this.avatar = imageURL;
    },
    cancelEdit() {
      this.cover = "";
      this.avatar = "";
      this.name = "";
      this.introduction = "";
    }
  },
  created() {
    const { id } = this.$route.params;
    this.fetchUserTweets(id);
    this.fetchUserLikes(id);
    this.fetchUser(id);
    this.fetchReplies(id);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchUserTweets(id);
    this.fetchUser(id);
    this.fetchReplies(id);
    this.fetchUserLikes(id);
    next();
  },
  watch: {
    // 控制名字 & 自介字數上限
    name: {
      handler: function(value) {
        if (value.length > 50) {
          Toast.fire({
            icon: "error",
            title: "名字字數不可超過上限，煩請重新編輯！"
          });
        }
      }
    },
    introduction: {
      handler: function(value) {
        if (value.length > 160) {
          Toast.fire({
            icon: "error",
            title: "自我介紹字數不可超過上限，煩請重新編輯！"
          });
        }
      }
    },
    cover(newValue) {
      this.cover = newValue;
    },
    avatar(newValue) {
      this.avatar = newValue;
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
  }

  .tweets-count {
    color: $small_text;
  }
}

.info-area {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  .image-wrapper {
    position: relative;
    width: 100%;
    .cover-cropper {
      width: 100%;
      height: 200px;
      overflow: hidden;
      .cover {
        width: 100%;
        display: inline;
        object-fit: cover;
      }
    }
    .image-cropper {
      @include image-cropper(140px);
      border: 4px solid #ffffff;
      position: absolute;
      top: 60%;
      left: 14px;
      .avatar {
        width: auto;
        display: inline;
        height: 100%;
      }
    }
  }
}

.edit-btn {
  width: 122px;
  height: 40px;
  border-radius: 100px;
  border: 1px solid $theme_orange;
  text-align: center;
  line-height: 40px;
  color: $theme_orange;
  cursor: pointer;
}

.mail,
.noti,
.noti-clicked {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid $theme_orange;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.noti-clicked {
  background-color: $theme_orange;
}

.following {
  width: 92px;
  height: 40px;
  line-height: 40px;
  background-color: $theme_orange;
  border-radius: 100px;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  &:hover {
    display: none;
  }
  &:hover ~ .deleteFollow {
    display: block;
  }
}

.deleteFollow {
  display: none;
  width: 92px;
  height: 40px;
  line-height: 40px;
  background-color: #c82456;
  border-radius: 100px;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}

.unfollow {
  width: 62px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 100px;
  font-size: 15px;
  color: $theme_orange;
  border: 1px solid $theme_orange;
  cursor: pointer;
  &:hover {
    background-color: #ffede0;
  }
}

.intro-wrapper {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  .name {
    font-size: 19px;
  }
  .account {
    color: $small_text;
    line-height: 10px;
    font-size: 15px;
  }
  .introduction {
    font-size: 14px;
    margin-bottom: 0;
  }
}

.followship-wrapper {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  .followers-count,
  .followings-count {
    margin-bottom: 0;
    font-size: 14px;
    color: $small_text;
  }
}

.tab-area {
  border-left: 1px solid #e6ecf0;
  border-right: 1px solid #e6ecf0;
  .nav-link {
    color: $small_text;
    &.active {
      border: hidden;
      border-bottom: 2px solid #ff6600;
      color: #ff6600;
    }
  }
}

.modal-content {
  border-radius: 1rem;
  width: 500px;
  .close {
    height: 48px;
    margin: -1rem -1rem -1rem -1rem;
  }
  .title {
    margin: auto 66% auto 0;
  }
}

.edit-cover {
  width: 100%;
  height: 200px;
  opacity: 80%;
  background-color: #999999;
  position: relative;
  .cover-edit-wrapper {
    height: 100%;
    width: 100%;
    background-color: #9d9d9d;
    .cover-sample,
    .edit-cover-photo {
      width: 100%;
      display: inline;
      object-fit: cover;
    }
    .new-cover-image {
      border: 1px solid #000;
      position: absolute;
      width: 20px;
      top: 50%;
      left: 50%;
      transform: translate(-200%, -50%);
      z-index: 10;
      opacity: 0;
    }
    .cover-camera {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-200%, -50%);
      cursor: pointer;
    }

    .cover-plus {
      width: 10px;
      height: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-350%, -40%);
      cursor: pointer;
    }
  }
  .avatar-edit-wrapper {
    position: relative;
    background-color: #9d9d9d;
    .edit-avatar {
      border: 4px solid #fff;
      width: 120px;
      height: 120px;
      position: absolute;
      background-color: #fff;
      overflow: hidden;
      border-radius: 50%;
      top: -5rem;
      left: 0.8rem;
      .avatar-sample,
      .edit-avatar-photo {
        width: auto;
        display: inline;
        height: 100%;
        opacity: 80%;
        object-fit: cover;
      }
      .avatar-camera {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
      .avatar-plus {
        width: 10px;
        height: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -40%);
        cursor: pointer;
      }
      .new-avatar-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        z-index: 999;
      }
      .cancel-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(40%, -50%);
        z-index: 20;
        cursor: pointer;
      }
    }
  }
}

.edit-area {
  margin: 1rem;
}

textarea {
  width: 100%;
  border: none;
  resize: none;
  -moz-appearance: none;
  padding-left: 8px;
  &:focus {
    outline: 0;
  }
}

.edit-title {
  background-color: #f5f8fa;
  color: #657786;
  margin: 60px 0 0 0;
  font-size: 15px;
  font-weight: 500;
  padding: 1px 0 0 8px;
}

.text-name,
.text-intro {
  background-color: #f5f8fa;
  border-radius: 0 0 4px 4px;
  border-bottom: 1px solid #657786;
}

.name-edit-num-limit,
.intro-edit-num-limit {
  font-size: 1rem;
  font-weight: 500;
  color: #657786;
  margin-left: 90%;
}

.btn {
  position: absolute;
  top: 0.6rem;
  right: 1rem;
  border-radius: 100px;
  width: 4rem;
}

.no-data {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #657786;
}
</style>