
$(document).ready(function() {
  var url = document.location.href;
  var username = url.split('?')[1].split('=')[1];
  const token = localStorage.getItem(username); // Retrieve the token from local storage using the key "username"

  document.getElementById('welcome-text').innerHTML = "Welcome " + username;

  if (username) {
    // Token exists
    // Perform any necessary operations with the token
    $.ajax({
      url: 'http://localhost:8080/api/Users',
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
          if (xhr.status === 404) {
            // Handle specific error status (e.g., not found)
            console.log("QR code URL not found");
          } else {
            // Handle other error statuses
            console.log("Error fetching QR code URL: " + error);
          }
        }
       });

       $('form').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission
  
        const pin = $('#CodeDigit').val(); // Get the PIN entered by the user
  
        // Make an AJAX request to the backend with the PIN and token
        $.ajax({
          url: 'http://localhost:8080/api/Users/Validate2FACode',
          type: 'POST',
          contentType: "application/json",
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + token
          },
          data: JSON.stringify({
            Google2FACode: pin
          }),
          success: function(response) {
            // Handle the response from the backend after PIN verification
            //console.log(response);
            $("#success-msg").removeClass("visually-hidden");
            $(".qrCode").addClass("visually-hidden");

            console.log("PIN verification successful");
            

          },
          error: function(xhr, textStatus, error) {
            // Handle error in PIN verification
            // $("#success-msg").addClass("visually-hidden");
             $("#error-msg").removeClass("visually-hidden");
            //alert("invalid PIN");
            $("#CodeDigit").val("");
            console.log("Error verifying PIN: " + error);
          }
        });
      });
  }  else {
    
    // Redirect to the login page or perform any other actions
     window.location.href = "index.html";
  }
 });
