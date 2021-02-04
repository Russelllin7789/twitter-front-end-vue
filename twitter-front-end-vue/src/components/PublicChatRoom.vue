<template>
  <div class="chat-container">
    <div class="chat-message-container chatbox p-3">
      <div class="publicMessages"></div>

      <div class="realtimeMessages d-flex flex-column">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'message',
            'd-flex',
            { selfMessage: currentUser.id === message.user.id },
            { publicMessage: message.type === 'publicMessage' },
          ]"
        >
          <div
            class="sender-avatar-area mr-1"
            v-if="currentUser.id !== message.user.id"
          >
            <div class="image-cropper">
              <img :src="message.user.avatar" class="avatar" />
            </div>
          </div>
          <div class="message-area d-flex flex-column">
            <div class="message-box p-2">{{ message.content }}</div>
            <span class="small text-secondary sent-time">{{
              message.timeStamp | timeNow
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-text-container d-flex">
      <form
        class="form d-flex justify-content-center mx-2"
        @submit.stop.prevent="handleMessageSubmit"
      >
        <input
          class="text-input"
          type="text"
          placeholder="say hi to everyone!"
          v-model="message.content"
        />
        <button type="submit" class="send-out-btn" :disabled="!message.content">
          <img
            src="../assets/send-message.svg"
            alt="send-out-the-text"
            class="send-out"
          />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { timeNowFilter } from "../utils/mixins";
import { uuid } from "uuidv4";
// import socketio from "socket.io-client";

export default {
  // socket: {
  //   join: function(message) {
  //     console.log(message);
  //   }
  // },
  // methods: {
  //   join: function() {
  //     this.$socket.emit("join", '23');
  //   }
  // },
  // mounted() {
  //   console.log("page mounted");
  //   //向後端拋出需求，等後端回拋內容回宅
  //   this.join();
  // }
  name: "PublicChatRoom",
  data() {
    return {
      // Todo: 修改message內容
      message: {
        id: "",
        type: "",
        user: {},
        content: "",
        timeStamp: new Date(),
      },
      messages: [],
      onlineUsers: [],
      countOfUsers: 0,
      presentUser: {},
    };
  },
  mixins: [timeNowFilter],
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    fetchUser() {
      this.presentUser = {
        ...this.presentUser,
        ...this.currentUser,
      };
    },
    handleMessageSubmit() {
      if (!this.message.content) return;
      this.$socket.emit("clientSendMessage", this.message.content);
      // console.log("send out!!");
      // const userId = this.presentUser.id;
      // const message = this.message.content;
      // const room = "publicRoom";
      // this.$socket.emit("sendMessage", () => {
      //   userId, message, room;
      // });
      // this.$socket.on("serverSendMessage", (data) => {
      //   console.log("got message!");
      //   const { user, message, timeStamp } = data;
      //   this.message = {
      //     ...this.message,
      //     id: uuid(),
      //     user,
      //     type: '',
      //     content: message,
      //     timeStamp,
      //   };
      // });
    },
    socketOnline() {
      const userId = this.presentUser.id;
      this.$socket.emit("online", () => {
        userId;
      });
      this.$socket.on("onlineUsers", (data) => {
        console.log("connection succeed!");
        console.log({
          onlineUsers: data.onlineUsers,
          countOfUsers: data.countOfUsers
        });
        this.onlineUsers = data.onlineUsers;
        this.countOfUsers = data.countOfUsers;
      });
    },
  },
  created() {
    this.socketOnline();
    this.fetchUser();
  },
  mounted() {
    this.$socket.on("joinroom", () => {
      // Todo: 若後端確認回傳為一包物件時，改為註解中的payload寫法(參數加入payload)
      // this.message = {
      //   ...payload,
      //   type: "publicMessage",
      //   id: uuid()
      // }
      this.message = {
        id: uuid(),
        type: "publicMessage",
        user: {
          id: 5,
          name: "@user5",
          avatar: "https://i.imgur.com/qrr11vy.jpg",
        },
        content: "@user5 is online",
        timeStamp: new Date(),
      };

      this.messages.push({ ...this.message });

      // Todo: 修改message內容
      this.message = {
        id: "",
        type: "",
        user: {},
        content: "",
        timeStamp: new Date(),
      };

      //使對話框置底:對話框
      this.$nextTick(function () {
        const chatbox = document.querySelector(".chatbox");
        chatbox.scrollTop = chatbox.scrollHeight;
      });
    }),
      this.$socket.on("serverSendMessage", (payload) => {
        this.message = {
          ...payload,
          type: "chatMessage",
          id: uuid(),
        };

        this.messages.push({ ...this.message });
        // Todo: 修改message內容
        this.message = {
          id: "",
          type: "",
          user: {},
          content: "",
          timeStamp: new Date(),
        };

        //使對話框置底:對話框
        this.$nextTick(function () {
          const chatbox = document.querySelector(".chatbox");
          chatbox.scrollTop = chatbox.scrollHeight;
        });
      });
  },
};
</script>

<style scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat-container {
  height: 100%;
}

.chat-message-container {
  height: 80%;
}

.chat-text-container {
  width: 100%;
  border-top: 1px solid #e6ecf0;
}

.form {
  width: 100%;
  margin-top: 1rem;
}

.text-input {
  width: 90%;
  margin-right: 1rem;
  border: none;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 10px;
}

.send-out-btn {
  all: unset;
}

.send-out {
  width: 30px;
  height: 30px;
}

.send-out:hover {
  cursor: pointer;
  filter: invert(42%) sepia(19%) saturate(6136%) hue-rotate(2deg)
    brightness(106%) contrast(105%);
}

.send-out-btn[disabled="disabled"] .send-out {
  cursor: auto;
  filter: invert(50%) brightness(130%);
}

.chatbox {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.selfMessage {
  color: blueviolet;
  margin-left: auto;
}

.image-cropper {
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.avatar {
  width: auto;
  display: inline;
  height: 100%;
}

.message-box {
  background-color: #e6ecf0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.selfMessage .message-box {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 20px;
  background-color: #ff6601;
  color: white;
}

.publicMessage .sender-avatar-area {
  display: none;
}

.publicMessage .sent-time {
  display: none;
}

.publicMessage {
  margin: 5px auto;
}

.publicMessage .message-box {
  background-color: #e5e5e5;
  color: #7a8995;
  text-align: center;
  border-radius: 20px;
}
</style>>