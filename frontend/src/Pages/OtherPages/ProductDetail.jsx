import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import GeoMap from "../../Component/OtherComponents/GeoMap";
import Loader from "../../Utils/Loader";
import { getProducts } from "../../Store/productSlice";
import statusCode from "../../Utils/statusCode";
import StatusError from "../../Utils/StatusError";



const ProductDetail = () => {
  const { _id } = useParams();
  const vacationRentals = useSelector((state) => state.products.data);
  const status = useSelector(state => state.products.status);
  const selectedVacationRental = vacationRentals.find((item) => item._id === _id);
const dispatch = useDispatch();
const navigate = useNavigate();


  useEffect(() => {
    dispatch(getProducts());
  }, []);

  if (status === statusCode.LOADING) {
    return <Loader />;
  }
  
  if (status === statusCode.ERROR) {
    return <StatusError />
  }
  
  const handleClick = (itemId) => {
    window.scrollTo(0, 0);
    sessionStorage.setItem('bookedProduct', JSON.stringify(itemId));
    navigate(`/booking-page`);
  };

  return (
    <>
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
              <button
                onClick={() => handleClick(selectedVacationRental._id)}
                className="bg-rose-500 text-white w-32 h-12"
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

export default ProductDetail;