import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Utils/Loader";
import axiosInstance from "../../Utils/axiosInstance";


const GetUserBooking = () => {

const user = JSON.parse(sessionStorage.getItem("user"));
const[myBooking, setMyBooking] = useState([]);
const[loading, setLoading] = useState(false);



const getUserBooking = async () => {
    setLoading(true);
    try {
       const response = await axiosInstance.get("/api/booking/get-user-booking", {userId: user._id}) 
       if(response.data.success){
        setMyBooking(response.data.data);
        toast.success(response.data.message)
       }
    } catch (error) {
       /*Navigate to login if token refresh fails from axios instance. using here to use useNavigate(it cn't be used in js file in axios instance) */
       if (error.response && error.response.status === 401) {
        navigate("/login"); 
       };
        toast.error("can't fetch booking! try again later");
        console.error(error);  
    };
    setLoading(false);
};

useEffect(() => {
    getUserBooking();
}, []);

  return (
    <section className="min-h-[85vh]">
    {loading && <Loader /> }  
    <div className="text-center px-4">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {myBooking?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => (
          <div
            key={item._id}
            className="w-60 bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img src={item.products.image} alt={item.products.productName} className="w-full h-40 object-cover" />
            <div className="p-1">
              <h3 className="text-lg font-semibold">{item.products.productName}</h3>
              <p className="text-gray-600">⭐ {item.products.rating} ({item.products.reviews})</p>
              <p className="text-gray-600">{item.products.description.split(" ").slice(0, 9).join(" ")}...</p>
              <p className="text-gray-600">total price: {item.totalPrice?.toFixed(2)}</p>
              <p className="text-gray-600">booking start: {item.bookStartDate?.substring(0, 10)}</p>
              <p className="text-gray-600">booking end: {item.bookEndDate?.substring(0, 10)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
   
  )
}

export default GetUserBooking;
