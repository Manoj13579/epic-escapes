import { useState, useEffect } from 'react';
import RentalsCarousel from '../OtherComponents/RentalsCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../Store/productSlice';
import statusCode from '../../Utils/statusCode';
import Loader from '../../Utils/Loader';
import StatusError from '../../Utils/StatusError';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import heroImg from '../../assets/heroimg.jpg';



const LayoutIndex = () => {

  const[searchTerm, setSearchTerm] = useState('');
  const products = useSelector(state => state.products.data);
  const status = useSelector(state => state.products.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  

  useEffect(()=> {
    dispatch(getProducts());
  }, []);
  
  if (status === statusCode.LOADING) {
    return <Loader />;
  }
  
  if (status === statusCode.ERROR) {
    return <StatusError />
  }
  const searchedProducts = products.filter(obj => obj.location.toLowerCase().startsWith(searchTerm.toLowerCase()))
  .reduce((uniqueProducts, current) => {
      const isDuplicate = uniqueProducts.find(item => item.location === current.location);
      if (!isDuplicate) {
          uniqueProducts.push(current);
      }
      return uniqueProducts;
  }, [])
  .slice(0, 8);

   
   const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate('/searched-page', { state: searchTerm });
      setSearchTerm("");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center bg-sky-100">
      <div className="relative w-full">
        {/* Hero image */}
        <img src={heroImg} alt="forest with mountain" className="w-full object-cover h-[50vh]" />

        {/* Search input field/form */}
        <form  onSubmit={handleSearchSubmit}
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <input
            className="placeholder:italic placeholder:text-slate-400 block bg-white h-10 w-full border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-slate-400"
            placeholder="Search Location..."
            required
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search dropdown */}
          {searchTerm && searchedProducts?.length > 0 ? (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {searchedProducts?.map((item) => (
                <div
                  key={item._id}
                  className="cursor-pointer p-2 hover:bg-cyan-100 transition-colors"
                  onClick={() => {
                    navigate('/searched-page', { state: item.location });
                    setSearchTerm("");
                  }}
                >
                  {item.location}
                </div>
              ))}
            </div>
          ) : null}
           {/* Search button */}
           <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent border-0 outline-none"
          >
            <IoIosSearch className="text-slate-900 w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Rentals Carousel */}
      <RentalsCarousel products={products} />
    </section>
  );
};

export default LayoutIndex;