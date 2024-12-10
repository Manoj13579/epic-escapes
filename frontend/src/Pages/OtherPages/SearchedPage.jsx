import { useLocation, useNavigate } from 'react-router-dom';
import StatusError from '../../Utils/StatusError';
import Loader from '../../Utils/Loader';
import { useSelector } from 'react-redux';
import statusCode from '../../Utils/statusCode';


const SearchedPage = () => {
  const location = useLocation();
  const { state } = location;
  const { data, status } = useSelector((state) => state.products);
  const searchedProducts = data.filter(item => item.location === state);
  const navigate = useNavigate();

  if (status === statusCode.LOADING) {
    return <Loader />;
  }
  
  if (status === statusCode.ERROR) {
    return <StatusError />
  }

  
  return (
    <section className='min-h-[80vh]'>
    <div className="flex flex-col md:flex-row md:flex-wrap items-center  justify-center space-x-4 mt-4">
      {searchedProducts.length > 0 ?  (searchedProducts.map((item) => (
        <div key={item._id} onClick={() => navigate(`/product-detail/${item._id}`)} className="w-60 bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
          <img src={item.image} alt={item.productName} className="w-full h-40 object-cover" />
          <div className="p-1">
            <h3 className="text-lg font-semibold">{item.productName}</h3>
            <p className="text-gray-600">⭐ {item.rating} ({item.reviews})</p>
            <p className="text-gray-600">{item.description.split(" ").slice(0, 9).join(" ")}...</p>
          </div>
        </div>
      ))): <p className='text-2xl'>No Property Found for: {state}</p>}
    </div>
  </section>   
  );
};

export default SearchedPage;