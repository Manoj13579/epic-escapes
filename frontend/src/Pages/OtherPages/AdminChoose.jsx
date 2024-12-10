import { useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Choose = () => {

const [result, setResult] = useState('');
const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // No need to pass baseURL and withCredentials since it's already configured in axiosInterceptor
      const response = await axiosInstance.get('/api/auth/admin');
      const data = response.data;
      setResult(data);
    } catch (error) {
      console.error(error);
       /*Navigate to login if token refresh fails from axios instance. using here to use useNavigate(it cn't be used in js file in axios instance) */
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
    }  
  }}

  return (
    <div className='h-[90vh] text-center text-2xl'>
      Choose🎉🎉
      <button onClick={handleClick}>test interceptor</button>
      <h1>{result}</h1>
    </div>
  )
}

export default Choose;