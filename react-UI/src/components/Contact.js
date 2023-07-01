import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
  const location = useLocation();
  const { username } = location.state;
  const [qrCodeSetupImageUrl, setQRCodeSetupImageUrl] = useState('');
  const [authenticationPin, setAuthenticationPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(username);
    console.log('Contact-Token:', token);
    // You can use the token for further operations or set it in the component's state
    axios
      .get('https://localhost:7114/api/Users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
       // const { QrCodeSetupImageUrl } = response.data.qrCodeSetupImageUrl;
        console.log(response.data.qrCodeSetupImageUrl);
        setQRCodeSetupImageUrl(response.data.qrCodeSetupImageUrl);
        //console.log(QrCodeSetupImageUrl);
        console.log(qrCodeSetupImageUrl);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error fetching QR code:', error);
      });
  }, [username,qrCodeSetupImageUrl]);

  const handlePinChange = (e) => {
    setAuthenticationPin(e.target.value);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem(username);
    axios
      .post(
        'https://localhost:7114/api/Users/Validate2FACode',
        { Google2FACode: authenticationPin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsAuthenticated(true);
        setError('');
      })
      .catch((error) => {
        console.error('Error validating 2FA code:', error);
        setIsAuthenticated(false);
        setError('Google Two Factor PIN is expired or wrong!');
      });
  };

  return (
    <div>
    {/* <h1>Contact</h1> */}
   <img src={`${qrCodeSetupImageUrl}`} alt="Google 2FA QR Code" width="300" height="300"/>
   {!isAuthenticated && (
            <form onSubmit={handlePinSubmit}>
              <input type="text" value={authenticationPin} onChange={handlePinChange} placeholder="Enter PIN" />
              <button type="submit">Submit</button>
            </form>
          )}
          {isAuthenticated && <p>Successfully authenticated!</p>}
          {error && <p>{error}</p>}
  </div>
  );
};

export default Contact;
