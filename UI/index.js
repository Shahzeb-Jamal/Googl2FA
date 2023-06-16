$(document).ready(function() {
  const loginForm = $("#login-form");
  const errorMsg = $("#error-msg");
  const successMsg = $("#success-msg");
  const btnSubmit = $("#btn-submit");
  const captchaImage = $("#captcha-image");

  // Function to generate and display captcha image
  function generateCaptchaImage() {
    $.ajax({
      url: 'http://localhost:8080/api/Captcha/GetCaptcha',
      type: 'GET',
      success: function(captchaResponse) {
        const captcha = captchaResponse.captchaImage;
        const encryptedString = captchaResponse.encryptedCaptcha;
        console.log(captcha);
        console.log(encryptedString);
        captchaImage.attr('src', 'data:image/png;base64,' + captcha);
      },
      error: function(xhr, textStatus, error) {
        // Handle error in fetching CAPTCHA
        console.error("Failed to fetch CAPTCHA image: " + error);
      }
    });
  }

  // Call the generateCaptchaImage function when the page loads
  generateCaptchaImage();

  // Submit form event
  loginForm.on("submit", function(e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#pwd").val();
    const captcha = $("#captcha").val();

    var tokenRequest = {
      userName: username,
      password: password
    };

    
    var capthaRequest = {
      captcha : captcha
    };

    // Send captcha validation request
    $.ajax({
      url: 'http://localhost:8080/api/Captcha/ValidateCaptcha',
      type: 'POST',
      data: JSON.stringify(capthaRequest),
      contentType: "application/json",
      dataType: 'json',
      success: function(captchaValidationResponse) {
        if (captchaValidationResponse.isValid) {
          // Captcha validated successfully, send user credentials validation request
          $.ajax({
            url: 'http://localhost:8080/api/Users/token',
            type: 'POST',
            data: JSON.stringify(tokenRequest),
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

              // Redirect to home.html page
              window.location.href = "Home.html?username=" + username;
            },
            error: function(xhr, textStatus, error) {
              // Show error message
              errorMsg.text("Invalid username or password");
              errorMsg.removeClass("visually-hidden");
              //successMsg.addClass("visually-hidden");

              // Generate new captcha image
              generateCaptchaImage();
            }
          });
        } else {
          // Invalid captcha, show error message
          errorMsg.text("Invalid captcha");
          errorMsg.removeClass("visually-hidden");
        }
      },
      error: function(xhr, textStatus, error) {
        // Show error message
        errorMsg.text("Failed to validate captcha");
        errorMsg.removeClass("visually-hidden");

        // Generate new captcha image
        generateCaptchaImage();
      }
    });
  });
});
