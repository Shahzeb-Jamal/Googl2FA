
$(document).ready(function() {
  var url = document.location.href;
  var username = url.split('?')[1].split('=')[1];
  const token = localStorage.getItem(username); // Retrieve the token from local storage using the key "username"

  document.getElementById('welcome-text').innerHTML = "Welcome " + username;

  if (username) {
    // Token exists
    // Perform any necessary operations with the token
    $.ajax({
      url: 'https://localhost:7114/api/Users',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      },
      success: function(qrCodeResponse) {
        const qrCodeUrl = qrCodeResponse.qrCodeSetupImageUrl;
        document.getElementById('qr-code').src = qrCodeUrl;
      },
      error: function(xhr, textStatus, error) {
        // Handle error in fetching QR code URL
      }
       });
  } else {
    // Token does not exist or has expired
    // Handle the case where the user is not authenticated or needs to log in again
    // Redirect to the login page or perform any other actions
    // Example:
    // window.location.href = "login.html";
  }
 });
