<template>
  <div class="container">
    <form class="w-100 d-flex flex-column align-items-center" @submit.stop.prevent="handleSubmit">
      <img class="alphitterLogo" src="../assets/Logo.svg" />
      <h5>建立你的帳號</h5>

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
        type="email"
        id="email"
        name="email"
        class="form-control"
        placeholder="Email"
        v-model="email"
        required
      />

      <input
        type="text"
        id="name"
        name="name"
        class="form-control"
        placeholder="名稱"
        v-model="name"
        required
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

      <input
        type="password"
        id="checkPassword"
        name="checkPassword"
        class="form-control"
        placeholder="密碼確認"
        v-model="checkPassword"
        required
      />

      <button class="btn btn-primary btn-block my-4" type="submit" :disabled="isProcessing">註冊</button>

      <div class="others d-flex justify-content-center">
        <router-link to="/signin">取消</router-link>
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
      email: "",
      name: "",
      password: "",
      checkPassword: "",
      isProcessing: false
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.isProcessing = true;

        const checkList = [
          this.account,
          this.name,
          this.email,
          this.password,
          this.checkPassword
        ];
        const isBlank = checkList.map(data => data.trim()).some(data => !data);

        if (isBlank) {
          Toast.fire({
            icon: "warning",
            title: "請檢查是否有欄位未填寫"
          });
          return;
        }

        const response = await authorizationAPI.signUp({
          account: this.account,
          email: this.email,
          name: this.name,
          password: this.password,
          checkPassword: this.checkPassword
        });

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        //成功的話，發送註冊成功通知
        Toast.fire({
          icon: "success",
          title: "完成註冊！請登入以開始使用論壇"
        });

        //轉址到signIn頁
        this.$router.push({ name: "sign-in" });

      } catch ({ error, response }) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: response.data.message
        });
      }
    }
  }
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