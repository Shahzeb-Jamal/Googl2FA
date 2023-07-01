import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Home = () => {
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
      const response = await axios.get('https://localhost:7114/api/Captcha/GetCaptcha?timestamp=${timestamp}');
      const { captchaImage } = response.data;
      setCaptchaImage(captchaImage);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('https://localhost:7114/api/Captcha/ValidateCaptcha', { captcha: captchaText });
      const { isValid } = response.data;
      
      console.log(isValid);
      if (isValid) {
        setValidationMessage('Captcha validation successful');
        getToken();
      } else {
        setValidationMessage('Invalid captcha');
        alert('Invalid captcha'); // Show alert for invalid captcha
        setCaptchaText(''); // Clear the captcha text input
        fetchCaptchaImage(); // Reload the captcha image
      }
    } catch (error) {
      console.error('Error validating captcha:', error);
    }
  };
  
  

  const getToken = () => {
    axios
      .post('https://localhost:7114/api/Users/token', {
        username,
        password,
        captcha: captchaText,
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem(username, token);
        console.log('Token:', token);
        navigate('/contact', { state: { username } }); // Pass the username as state when navigating to Contact
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  };

  return (
    <div>
      <h1>Home</h1>
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

export default Home;
