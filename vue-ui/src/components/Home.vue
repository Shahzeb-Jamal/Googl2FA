<template>
  <div class="container">
    <template v-if="isAuthenticated">
      <h1>Welcome {{ username }}</h1>
    </template>
    <template v-else>
      <img
        :src="qrCodeSetupImageUrl"
        alt="Google 2FA QR Code"
        width="200"
        height="200"
      />
      <form @submit.prevent="handlePinSubmit">
        <input
          type="text"
          v-model="authenticationPin"
          placeholder="Enter PIN"
        />
        <button type="submit">Submit</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "HomeComponent",
  setup() {
    const route = useRoute();
    const username = ref("");
    const qrCodeSetupImageUrl = ref("");
    const authenticationPin = ref("");
    const isAuthenticated = ref(false);
    const error = ref("");

    onMounted(() => {
      const token = localStorage.getItem(route.params.username);
      console.log("Contact-Token:", token);
      axios
        .get("http://g2favue.com/service/api/Users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          //console.log(response.data);
          //console.log(response.data.qrCodeSetupImageUrl);
          qrCodeSetupImageUrl.value = response.data.qrCodeSetupImageUrl;
          username.value = route.params.username; // Set the username here
          //console.log(qrCodeSetupImageUrl.value);
        })
        .catch((error) => {
          console.error("Error fetching QR code:", error);
        });
    });

    const handlePinChange = (e) => {
      authenticationPin.value = e.target.value;
    };

    const handlePinSubmit = () => {
      const token = localStorage.getItem(route.params.username);
      axios
        .post(
          "http://g2favue.com/service/api/Users/Validate2FACode",
          { Google2FACode: authenticationPin.value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          isAuthenticated.value = true;
          error.value = "";
        })
        .catch((error) => {
          console.error("Error validating 2FA code:", error);
          isAuthenticated.value = false;
          //console.log(isAuthenticated.value);
          // after setting the error value
          alert("Google Two Factor PIN is expired or wrong!");
          resetPIN();
        });
    };

    const resetPIN = () => {
      authenticationPin.value = "";
    };

    return {
      username,
      qrCodeSetupImageUrl,
      authenticationPin,
      isAuthenticated,
      error,
      handlePinChange,
      handlePinSubmit,
      resetPIN,
    };
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
  margin-top: 1rem;
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
</style>
