import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../components/style/Login.css";



const Login = () => {
  const navigate = useNavigate();
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    fetchCaptchaImage();
  }, []);

  const fetchCaptchaImage = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/Captcha/GetCaptcha');
      const { captchaImage } = response.data;
      setCaptchaImage(captchaImage);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3000/api/Captcha/ValidateCaptcha', { captcha: captchaText });
      const { isValid } = response.data;
      console.log('isValid:', isValid);
      
      if (isValid) {
        //setValidationMessage('Captcha validation successful');
        alert('Captcha validation successful');
        getToken();
      } else {
        
      }
    } catch (error) {
      //setValidationMessage('Invalid captcha');
      alert('Invalid captcha'); // Show alert for invalid captcha
     // setCaptchaText(''); // Clear the captcha text input
     resetFields();
      fetchCaptchaImage(); // Reload the captcha image
      console.error('Error validating captcha:', error);
    }
  };
  
  const getToken = () => {
    axios
      .post('http://localhost:3000/api/Users/token', {
        username,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem(username, token);
        console.log('Token:', token);
        navigate('/Home', { state: { username } }); // Pass the username as state when navigating to Contact
      })
      .catch((error) => {
        //setValidationMessage('Invalid credentials');
        alert('Invalid credentials');
        resetFields();
        console.error('Error getting token:', error);
      });
  };

  const resetFields = () => {
      setUsername('');
      setPassword('');
      //setCaptchaImage('');
      setCaptchaText('');
  }
  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <img src={`data:image/png;base64,${captchaImage}`} alt="Captcha" />
        </div>
        <div>
          <label htmlFor="captchaText">Enter Captcha:</label>
          <input
            type="text"
            id="captchaText"
            value={captchaText}
            onChange={(event) => setCaptchaText(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {validationMessage && <p>{validationMessage}</p>}
    </div>
  );
};

export default Login;
