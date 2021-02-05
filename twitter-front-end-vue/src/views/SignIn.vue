<template>
  <div class="container">
    <form
      class="w-100 d-flex flex-column align-items-center"
      @submit.stop.prevent="handleSubmit"
    >
      <img class="alphitterLogo" src="../assets/Logo.svg" />
      <h5>登入 Alphitter</h5>

      <input
        type="text"
        id="account"
        name="account"
        class="form-control"
        placeholder="帳號"
        v-model="account"
        required
        autofocus
      />

      <input
        type="password"
        id="password"
        name="password"
        class="form-control"
        placeholder="密碼"
        v-model="password"
        required
      />

      <button
        class="btn btn-primary btn-block"
        type="submit"
        :disabled="isProcessing"
      >
        登入
      </button>

      <div class="others d-flex justify-content-end pt-4">
        <router-link to="/signup">註冊 Alphitter</router-link>·
        <router-link to="/admin">後台登入</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "../apis/authorization";
import { Toast } from "../utils/helpers";
export default {
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.account || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "請填入account和password",
          });
          return;
        }

        this.isProcessing = true;

        const { data } = await authorizationAPI.signIn({
          account: this.account,
          password: this.password,
        });

        // 防範管理員誤登前台
        if (data.user.role !== "user") {
          this.$router.push("/admin");
          return;
        }

        localStorage.setItem("token", data.token);

        //將user資料放到vuex當中
        this.$store.commit("setCurrentUser", data.user);

        this.$router.push("/main");
      } catch ( { response }) {
        this.isProcessing = false;
        this.password = "";
        Toast.fire({
          icon: "error",
          title: response.data.message
        });
        console.log("response", response)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.alphitterLogo {
  margin-top: 72.51px;
  height: 50px;
  width: 50px;
}

h5 {
  margin-top: 40px;
}

input {
  @include input-style;
}

.others {
  width: 40%;
}

button {
  @include button-style;
}
</style>