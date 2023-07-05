<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit="handleSubmit">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div class="captcha-container">
        <img :src="'data:image/png;base64,' + captchaImage" alt="Captcha" />
      </div>
      <div>
        <label for="captchaText">Enter Captcha:</label>
        <input type="text" id="captchaText" v-model="captchaText" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    <p v-if="validationMessage">{{ validationMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      captchaImage: "",
      captchaText: "",
      username: "",
      password: "",
      validationMessage: "",
    };
  },
  created() {
    this.fetchCaptchaImage();
  },
  methods: {
    async fetchCaptchaImage() {
      try {
        const response = await axios.get(
          "http://g2favue.com/service/api/Captcha/GetCaptcha"
        );
        this.captchaImage = response.data.captchaImage;
      } catch (error) {
        console.error("Error fetching captcha:", error);
      }
    },
    async handleSubmit(event) {
      event.preventDefault();

      try {
        const response = await axios.post(
          "http://g2favue.com/service/api/Captcha/ValidateCaptcha",
          { captcha: this.captchaText }
        );
        const { isValid } = response.data;

        if (isValid) {
          alert("Captcha validation successful");
          this.getToken();
        } else {
          // Handle invalid captcha
        }
      } catch (error) {
        alert("Invalid captcha");
        this.resetFields();
        this.fetchCaptchaImage();
        console.error("Error validating captcha:", error);
      }
    },
    getToken() {
      axios
        .post("http://g2favue.com/service/api/Users/token", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          const { token } = response.data;
          localStorage.setItem(this.username, token);
          console.log("Token:", token);
          // Use Vue Router to navigate to Home page with this.username
          this.$router.push({
            name: "Home",
            params: { username: this.username },
          });
        })
        .catch((error) => {
          alert("Invalid credentials");
          this.resetFields();
          console.error("Error getting token:", error);
        });
    },
    resetFields() {
      this.username = "";
      this.password = "";
      this.captchaText = "";
    },
  },
};
</script>

<style>
/* Add your CSS styles here */
body {
  padding-top: 7rem;
  background: url(https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80)
    no-repeat center center fixed;
  background-size: cover;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 3rem 4rem;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.8);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

img {
  display: block;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="text"] {
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
}

button[type="submit"] {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

p {
  text-align: center;
  color: red;
}

.captcha-container {
  margin-top: 20px; /* Adjust the value as needed for the desired vertical gap */
  margin-bottom: 10px;
}
</style>
