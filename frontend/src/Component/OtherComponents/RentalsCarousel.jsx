import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RentalsCarousel = ({ products }) => {
  const vacationRentals = products;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(vacationRentals.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedItems = vacationRentals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNavigate = (itemId) => {
    // Scroll to the top before navigating
    window.scrollTo(0, 0);
    navigate(`/product-detail/${itemId}`);
  };

  return (
    <div className="text-center px-4">
      <h2 className="text-2xl font-semibold mb-4">Top-rated vacation rentals in Nepal</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {selectedItems.map((item) => (
          <div
            key={item._id}
            onClick={() => handleNavigate(item._id)}
            className="w-60 bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
          >
            <img src={item.image} alt={item.productName} className="w-full h-40 object-cover" />
            <div className="p-1">
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-gray-600">⭐ {item.rating} ({item.reviews})</p>
              <p className="text-gray-600">{item.description.split(" ").slice(0, 9).join(" ")}...</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-4 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          ❮
        </button>
        <span className="text-gray-700">{currentPage} / {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default RentalsCarousel;