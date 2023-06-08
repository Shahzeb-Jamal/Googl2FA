$(document).ready(function() {
  const loginForm = $("#login-form");
  const errorMsg = $("#error-msg");
  const successMsg = $("#success-msg");
  const btnSubmit = $("#btn-submit");

  btnSubmit.on("click", function(e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#pwd").val();

    var formData = {
      userName: username,
      password: password,
      google2FACode: ""
    };

    $.ajax({
      url: 'https://localhost:7114/api/Users/token',
      type: 'POST',
      data: JSON.stringify(formData),
      contentType: "application/json",
      dataType: 'json',
      success: function(response) {
        // Clear form inputs
        loginForm[0].reset();

        // Store response in local storage
        localStorage.setItem("username", response.token);

        // Show success message
        successMsg.removeClass("visually-hidden");
        errorMsg.addClass("visually-hidden");

        // Send another request to get QR code URL if token exists
        if (localStorage.getItem("username")) {
          $.ajax({
            url: 'https://localhost:7114/api/Users',
            type: 'GET',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem("username")
            },
            success: function(qrCodeResponse) {
              // Redirect to the new page with QR code URL as a parameter
              const qrCodeUrl = qrCodeResponse.QrCodeSetupImageUrl;
              window.location.href = "index.html?url=" + encodeURIComponent(qrCodeUrl);
            },
            error: function(xhr, textStatus, error) {
              // Handle error in fetching QR code URL
            }
          });
        }
      },
      error: function(xhr, textStatus, error) {
        // Show error message
        errorMsg.removeClass("visually-hidden");
        successMsg.addClass("visually-hidden");
      }
    });
  });
});
