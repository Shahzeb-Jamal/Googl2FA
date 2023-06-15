$(document).ready(function() {
  const loginForm = $("#login-form");
  const errorMsg = $("#error-msg");
  const successMsg = $("#success-msg");
  const btnSubmit = $("#btn-submit");
  const captchaImage = $("#captcha-image");


  // Function to generate and display captcha image
  function generateCaptchaImage() {
    $.ajax({
      url: 'https://localhost:7114/api/Captcha/GetCaptcha',
      type: 'GET',
      success: function(CaptchaResponse) {
        const captcha = CaptchaResponse.captchaImage;
        const encryptedString = CaptchaResponse.encryptedCaptcha;
        console.log(captcha);
        console.log(encryptedString);
        document.getElementById('captcha-image').src = 'data:image/png;base64,' + captcha;
      },
      error: function(xhr, textStatus, error) {
        // Handle error in fetching CAPTCHA
        console.error("Failed to fetch CAPTCHA image: " + error);
      }
    });
  }

  // Call the generateCaptchaImage function when the page loads
  generateCaptchaImage();

  btnSubmit.on("click", function(e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#pwd").val();
    //const captcha = $("#captcha").val();

    var formData = {
      userName: username,
      password: password,
      google2FACode: "",
      //captcha: captcha
    };

    $.ajax({
      url: 'http://localhost:8080/api/Users/token',
      type: 'POST',
      data: JSON.stringify(formData),
      contentType: "application/json",
      dataType: 'json',
      success: function(response) {
        // Clear form inputs
        loginForm[0].reset();

        // Store response in local storage
        localStorage.setItem(username, response.token);

        // Show success message
        successMsg.removeClass("visually-hidden");
        errorMsg.addClass("visually-hidden");

        // to navigate to home.html page
        window.location.href = "Home.html?username="+username;

      },
      error: function(xhr, textStatus, error) {
        // Show error message
        errorMsg.removeClass("visually-hidden");
        successMsg.addClass("visually-hidden");

        // Generate new captcha image
        generateCaptchaImage();
      }
    });
  });

  // Call the generateCaptchaImage function again after a failed login attempt
  function handleFailedLogin() {
    // Reset form inputs
    loginForm[0].reset();

    // Show error message
    errorMsg.removeClass("visually-hidden");
    successMsg.addClass("visually-hidden");
  }
});

