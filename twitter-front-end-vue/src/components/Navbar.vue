<template>
  <nav class="sidebar" style="height: 100%">
    <div class="sidebar-sticky d-flex flex-column" style="height: 100%">
      <div class="top-area">
        <router-link class="navbar-brand" to="/">
          <img src="../assets/Logo.svg" />
        </router-link>

        <div class="nav-list">
          <router-link class="nav-item" to="/main">
            <div class="d-flex" style="width: 115px">
              <img src="../assets/Home.svg" class="icon" />
              <img src="../assets/Home-hovered.svg" class="icon-hovered" />
              <p>首頁</p>
            </div>
          </router-link>
          <router-link
            class="nav-item"
            :to="{
              name: 'public-chat',
            }"
          >
            <div class="d-flex" style="width: 143px">
              <img src="../assets/email.svg" class="email-icon" />
              <img src="../assets/email-open.svg" class="email-icon-hovered" />
              <p>公開聊天室</p>
            </div>
          </router-link>
          <router-link
            class="nav-item"
            :to="{
              name: 'private-chat',
              params: { id: currentUser.id },
            }"
          >
            <div class="d-flex" style="width: 143px">
              <img src="../assets/email.svg" class="email-icon" />
              <img src="../assets/email-open.svg" class="email-icon-hovered" />
              <p>私人訊息</p>
            </div>
          </router-link>
          <router-link
            class="nav-item"
            :to="{
              name: 'user-profile',
              params: { id: currentUser.id },
            }"
          >
            <div class="d-flex" style="width: 143px">
              <img src="../assets/User.svg" class="icon" />
              <img src="../assets/User-hovered.svg" class="icon-hovered" />
              <p>個人資料</p>
            </div>
          </router-link>
          <router-link class="nav-item" to="/user/setting">
            <div class="d-flex" style="width: 115px">
              <img src="../assets/Setting.svg" class="icon" />
              <img src="../assets/Setting-hovered.svg" class="icon-hovered" />
              <p>設定</p>
            </div>
          </router-link>
        </div>

        <div
          type="button"
          class="btn btn-primary post"
          data-toggle="modal"
          data-target="#postModal"
          @click="handleClickConfig"
        >
          推文
        </div>
      </div>

      <div class="bottom-area mt-auto">
        <div
          class="signout-wrapper d-flex"
          style="width: 115px"
          @click.stop.prevent="handleSignOut"
        >
          <img src="../assets/Signout.svg" class="icon" />
          <p>登出</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Navbar",
  components: {},
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    handleSignOut() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    },
    handleClickConfig() {
      //確保使用者都會在首頁下新增推文
      this.$router.push({ name: "main-tweets" });
    },
  },
};
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
}

a {
  color: black;
  text-decoration: none;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
}

.nav-item {
  div {
    height: 46px;
    padding: 10px;
    margin-top: 14px;
  }
  img {
    margin-right: 21px;
  }
  .email-icon {
    width: 20px;
    height: 20px;
  }
  .icon-hovered {
    display: none;
    margin-right: 21px;
  }
  .email-icon-hovered {
    width: 22px;
    height: 22px;
    display: none;
    margin-right: 21px;
  }
  
  &:hover div {
    background-color: #faceaf;
    border-radius: 25px;
  }
  &:hover p {
    color: $theme_orange;
  }
  &:hover .icon, .email-icon {
    display: none;
  }
  &:hover .icon-hovered, .email-icon-hovered {
    display: block;
  }
  &:hover .email-icon-hovered {
    filter: invert(42%) sepia(19%) saturate(6136%) hue-rotate(2deg)
    brightness(106%) contrast(105%);
  }
}

.active {
  p {
    color: $theme_orange;
  }
  .icon, .email-icon {
    display: none;
  }
  .icon-hovered, .email-icon-hovered {
    display: block;
  }
  .email-icon-hovered {
    filter: invert(42%) sepia(19%) saturate(6136%) hue-rotate(2deg)
    brightness(106%) contrast(105%);
  }
}

.signout-wrapper {
  cursor: pointer;
  height: 46px;
  padding: 10px;
  .icon {
    margin-right: 21px;
  }
  &:hover {
    background-color: $light_orange;
    border-radius: 25px;
  }
}

.post {
  width: 210px;
  border-radius: 20px;
  margin-top: 27px;
}

.btn-primary:not(:disabled):not(.disabled):active {
  background-color: #cc5302;
}
</style>