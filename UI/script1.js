const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const btnSubmit = document.getElementById("btn-submit");

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


btnSubmit.addEventListener("click" , (e) =>{
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.pwd.value;

    var formData = {
      userName: username,
      password: password,
      google2FACode: ""
    };

    $.ajax({
      url: 'https://localhost:7114/api/Users/authenticate',
      type: 'POST',
      data: JSON.stringify(formData),
      contentType: "application/json",
      dataType: 'json',
      success: function(response) {
        // Handle the response from the server
           console.log(response);
        if(response.success){

          //successful login
          successMsg.classList.remove("visually-hidden");
          errorMsg.classList.add("visually-hidden");
          console.log("successful");

          
      
          // Parse the JWT
          const token = response.jwt;
          const decodedToken = parseJwt(token);
          console.log(decodedToken); // Access the decoded token properties

          // Store the token in local storage
          localStorage.setItem('token', token);

          //to print token on console
          console.log(localStorage.getItem('token'))

          //window.location.replace("/index.html");
        }
        else{
          successMsg.classList.add("visually-hidden");
          errorMsg.classList.remove("visually-hidden");
          console.log("failure");
        }  
      },
      error: function(xhr, status, error) {
        // Handle errors
       if (xhr.status === 401) {
        // Handle the 401 error
        alert("Authentication failed. Please check your credentials.");
        console.log(xhr.responseText); // Print the response body to the console
        console.log(error);
        } else {
        alert("An error occurred. Please try again.");
        console.log(error);
      }
      }
    });  
})

