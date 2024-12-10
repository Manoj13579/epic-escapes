import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import GeoMap from "../../Component/OtherComponents/GeoMap";
import Loader from "../../Utils/Loader";
import { getProducts } from "../../Store/productSlice";
import statusCode from "../../Utils/statusCode";
import StatusError from "../../Utils/StatusError";
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";



const BookingPage = () => {
  const [bookStartDate, setBookStartDate] = useState("");
  const [bookEndDate, setBookEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const _id = JSON.parse(sessionStorage.getItem("bookedProduct"));
  const vacationRentals = useSelector((state) => state.products.data);
  const status = useSelector(state => state.products.status);
  const selectedVacationRental = vacationRentals.find((item) => item._id === _id);
const dispatch = useDispatch();
const navigate = useNavigate();
const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  if (status === statusCode.LOADING) {
    return <Loader />;
  }
  
  if (status === statusCode.ERROR) {
    return <StatusError />
  }
  
  
  const handleClick = async () => {
    if (!bookStartDate || !bookEndDate) {
      toast.warn("both dates should be selected");
      return;
    };
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/booking/create-booking`,
        {
          productsId: selectedVacationRental._id,
          bookStartDate,
          bookEndDate,
          userId: user._id,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (
        (error.response && error.response.status === 400) ||
        error.response.status === 404
      ) {
        toast.error(error.response.data.message);
      }
      else if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      else {
        toast.error("booking failed try again later");
        console.error(error);
      }
    };
    setLoading(false);
  };

  return (
    <>
    {loading && <Loader />}
    <section>
      {selectedVacationRental ? (
        <div className="flex items-center justify-center flex-col w-full">
          <img
            src={selectedVacationRental.image}
            alt={selectedVacationRental.productName}
            className="w-4/5 h-[90vh] object-cover mt-4"
          />
          <div className="flex items-center justify-center flex-col md:flex-row py-8">
            <div className=" w-3/5 px-8">
              <h3 className="text-lg font-semibold">
                {selectedVacationRental.productName}
              </h3>
              <p className="text-gray-600">
                ⭐ {selectedVacationRental.rating} (
                {selectedVacationRental.reviews})
              </p>
              <p className="text-gray-600">
                {selectedVacationRental.description}
              </p>
              <p className="text-gray-600">
                location: {selectedVacationRental.location}
              </p>
              <div className="text-gray-600">
              Booking Availability: {selectedVacationRental?.availableDates.map((item) => (
                    <p key={item._id}>
                     {item.startDate.substring(0, 10)} to{" "}
                      {item.endDate.substring(0, 10)}
                    </p>
                  ))}
              </div>
            </div>
            <div className="flex flex-col mt-16 md:mt-0 p-4 rounded-lg border border-gray-300">
              From
              <input
                type="date"
                name="bookStartDate"
                value={bookStartDate}
                onChange={(e) => setBookStartDate(e.target.value)}
                className="border border-gray-300 rounded"
              />
              To
              <input
                type="date"
                name="bookEndDate"
                value={bookEndDate}
                onChange={(e) => setBookEndDate(e.target.value)}
                className="border border-gray-300 rounded"
              />
              <button
                onClick={handleClick}
                className="bg-rose-500 text-white mt-2"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </section>
    <div className="p-8">
    <GeoMap location={selectedVacationRental?.location}/>
    </div>
    </>
  );
};

export default BookingPage;