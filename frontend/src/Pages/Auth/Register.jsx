import { useRef, useState } from 'react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import backgroundImg from '../../assets/background.jpg';
import upload_image from "../../assets/upload_image.png";


const Register = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: null,
    password: "",
    role: "user"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
const inputRef = useRef();
const navigate = useNavigate();
const MAX_FILE_SIZE = 1 * 1024 * 1024;



 


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 1 MB');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        if(formData.password !== confirmPassword) {
          toast.error(`password don't match`);
          return
        };
        try {
          let photoUrl = null;
          if (formData.image) {
            const uploadFormData = new FormData();
            uploadFormData.append("image", formData.image);
              
            const photoUploadResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/register-image-upload`, uploadFormData );
            photoUrl = photoUploadResponse.data.data;
                }
            
               const updatedFormData = {
                 ...formData,
                 image: photoUrl
               };
          // if { updatedFormData } passed as this object in controller receive as req.body.updatedFormData in controller
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, { updatedFormData });
          if(response.data.success){
            setFormData({
              firstName: "",
              lastName:"",
              email: "",
              password: "",
              image: null,
              role: "user"
            });
            setConfirmPassword("")
          navigate(`/register-verification/${response.data._id}`);
          toast.success(response.data.message, { autoClose: false, position: 'top-center' });
          }
        } catch (error) {
          if(error.response && error.response.status === 400)
            toast.error(error.response.data.message);
          else{
            toast.error('registration failed! try again later')
            console.error(error);
        }
        }
        finally {
          setButtonDisabled(false);
      }
      };

      const togglePasswordVisibility = (type) => {
    
        if(type === "password"){
    setShowPassword(!showPassword);
        }
        else if (type === "confirmPassword") {
          setShowConfirmPassword(!showConfirmPassword);
        } 
      };


  return (
    <section
      className="h-[90vh] flex flex-col space-y-1 items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
        <p className="text-stone-800 text-2xl font-bold ">Register</p>
     <form className="flex flex-col flex-wrap justify-center items-center gap-y-2 bg-green-950 p-8" onSubmit={handleSubmit}>
        <label htmlFor="first-name" className="relative block">
          <div className="flex items-center">
            <input
              id="first-name"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter First Name"
              required
              type="text"
              name="first-name"
              ref={inputRef}
              autoFocus
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value})}
            />
          </div>
        </label>
        <label htmlFor="last-name" className="relative block">
          <div className="flex items-center">
            <input
              id="last-name"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Last Name"
              required
              type="text"
              name="last-name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value})}
            />
          </div>
        </label>
        <label htmlFor="email" className="relative block">
          <div className="flex items-center">
            <input
              id="email"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Email"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value})}
            />
          </div>
        </label>
        <label htmlFor="password" className="relative block">
          <div className="flex items-center">
            <input
              id="password"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10 w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-10 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Password"
              required
              // Toggle between text and password
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value})}
            />
            {/* Toggle icon */}
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-slate-500 h-6 w-6" />
              ) : (
                <AiFillEye className="text-slate-500 h-6 w-6" />
              )}
            </span>
          </div>
        </label>
        <label htmlFor="confirm-password" className="relative block">
          <div className="flex items-center">
            <input
              id="confirm-password"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10 w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-10 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Confirm Password"
              required
              // Toggle between text and password
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* Toggle icon */}
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="text-slate-500 h-6 w-6" />
              ) : (
                <AiFillEye className="text-slate-500 h-6 w-6" />
              )}
            </span>
          </div>
        </label>
              <p className="text-gray-500">
                Image types allowed: jpeg, jpg, png
              </p>
              <p className="text-gray-500">Image size shouldn't exceed 1 mb</p>
              <label
                htmlFor="file-input"
                className="flex items-center cursor-pointer"
              >
                <img
                  src={formData.image ? URL.createObjectURL(formData.image) : upload_image
                  }
                  alt="Register image preview"
                  className="w-28 h-28 rounded-lg border border-gray-300 object-cover"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="file-input"
                  hidden
                />
              </label>
        <button className= 'text-white font-semibold bg-green-950 hover:bg-green-700 rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed' type='submit' disabled={buttonDisabled}>Submit</button>
        </form>
    </section>
  )
}

export default Register;