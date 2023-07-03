import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../components/style/Home.css";

const Home = () => {
  const location = useLocation();
  const { username } = location.state;
  const [qrCodeSetupImageUrl, setQRCodeSetupImageUrl] = useState('');
  const [authenticationPin, setAuthenticationPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(username);
    console.log('Contact-Token:', token);
    axios
      .get('http://localhost/service/api/Users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(response.data.qrCodeSetupImageUrl);
      setQRCodeSetupImageUrl(response.data.qrCodeSetupImageUrl);
        console.log(qrCodeSetupImageUrl);
      })
      .catch((error) => {
        console.error('Error fetching QR code:', error);
      });
  }, []);

  const handlePinChange = (e) => {
   setAuthenticationPin(e.target.value);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem(username);
    axios
      .post(
        'http://localhost/service/api/Users/Validate2FACode',
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
       resetPIN();
      });
  };

  const resetPIN = () => {
    setAuthenticationPin('');
}

  return (
    <div className='container'>
      {isAuthenticated ? (
        <h1>Welcome {username}</h1>
      ) : (
        <>
          <img src={`${qrCodeSetupImageUrl}`} alt="Google 2FA QR Code" width="300" height="300" />
          {!isAuthenticated && (
            <form onSubmit={handlePinSubmit}>
              <input type="text" value={authenticationPin} onChange={handlePinChange} placeholder="Enter PIN" />
              <button type="submit">Submit</button>
            </form>
          )}
          {error && <p>{error}</p>}
        </>
      )}
    </div>
  );
};

export default Home;
