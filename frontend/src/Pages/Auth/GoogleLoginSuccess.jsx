import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../Utils/Loader';

const GoogleLoginSuccess = () => {

  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const fetchUserData = async () => {
    
    
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/login/success`, { withCredentials: true });
      if (response.data.success) {
        const { email, firstName, role, _id, createdAt, updatedAt, authProvider, photo } = response.data.user;
        sessionStorage.setItem("user", JSON.stringify({
          email, 
          firstName, 
          role, 
          _id,
          photo, 
          createdAt, 
          updatedAt,
          authProvider
        }));
        toast.success("Successfully logged in");
          navigate('/choose');
      }
    } catch (error) {
      toast.error('An error occurred in login try again');
      console.error(error);
    }
    setLoading(false);
  };
  
  
  useEffect(() => {
  fetchUserData();
}, []);
  // Render a loading message while processing
  if (loading) {
    return (
      <Loader />
    );
  }

  // Render nothing as the user will be redirected
  return null;
};

export default GoogleLoginSuccess;