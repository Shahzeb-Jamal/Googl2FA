const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const btnSubmit = document.getElementById("btn-submit");

btnSubmit.addEventListener("click" , (e) =>{
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.pwd.value;

    if(username === "Admin" && password=== "12345" ){
        successMsg.classList.remove("visually-hidden");
        errorMsg.classList.add("visually-hidden");
    }
    else{
        successMsg.classList.add("visually-hidden");
        errorMsg.classList.remove("visually-hidden");
    }
})




// function makeApiCall() {
//   $.ajax({
//     url: 'https://localhost:7114/User', // Replace with your actual URL
//     type: 'POST',
//     data: '{ "userName": "Admin", "password": "12345", "google2FACode": "" }',
//     contentType: "application/json",
//     dataType: 'json',
//     success: function(response) {
//       // Handle the response from the server
//       console.log(response);
//     },
//     error: function(xhr, status, error) {
//       // Handle errors
//       console.log(error);
//     }
//   });
//   }

$("#btn-submit").on("click", function(){
    //alert("click");
   // Get the username and password from the input fields
   var username = $('#username').val();
   var password = $('#pwd').val();
   
   // Create an object with the form data
   var formData = {
     userName: username,
     password: password,
     google2FACode: ""
   };
   //alert(formData.userName + formData.password);
   $.ajax({
     url: 'https://localhost:7114/User', // Replace with your actual URL
     type: 'POST',
     data: JSON.stringify(formData),
     contentType: "application/json",
     dataType: 'json',
     success: function(response) {
       // Handle the response from the server
          console.log(response);
    //    console.log(response.success);
    //    if(response.success)
    //    {
    //     alert("successful");
    //     // $(".alert-success").show();
    //    // $("#success_msg").html("success");
    //    }
    //     else{
    //         alert("failure");
    //     }  
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
});


// function makeApiCall() {
//     // Get the username and password from the input fields
//     var username = $('#username').val();
//     var password = $('#pwd').val();
    
//     // Create an object with the form data
//     var formData = {
//       userName: username,
//       password: password,
//       google2FACode: ""
//     };
  
//     $.ajax({
//       url: 'https://localhost:7114/User', // Replace with your actual URL
//       type: 'POST',
//       data: JSON.stringify(formData),
//       contentType: "application/json",
//       dataType: 'json',
//       success: function(response) {
//         // Handle the response from the server
//         console.log(response);
//       },
//       error: function(xhr, status, error) {
//         // Handle errors
//         console.log(error);
//       }
//     });
//   }
  


  