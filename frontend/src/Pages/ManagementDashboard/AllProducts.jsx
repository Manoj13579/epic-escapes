import { useState, useEffect } from 'react';
import Loader from '../../Utils/Loader';
import { toast } from 'react-toastify';
import UpdateModal from '../../Utils/UpdateModal';
import DeleteModal from '../../Utils/DeleteModal';
import { deleteProduct, getProducts, updateProduct } from '../../Store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import statusCode from '../../Utils/statusCode';
import StatusError from '../../Utils/StatusError';
import axiosInstance from '../../Utils/axiosInstance';



const AllProducts = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [clickedProduct, setClickedProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
  
  const dispatch = useDispatch();

  
  const products = useSelector((state) => state.products.data);
  const status = useSelector((state) => state.products.status);
  
 
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    // Set initial filtered products to all products
    setFilteredProducts(products);
  }, [products]);


  if (status === statusCode.LOADING) {
    return <Loader />;
  }

  if (status === statusCode.ERROR) {
    return <StatusError />
  }
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = products.filter(product =>
        product.location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
        setFilteredProducts(products);
    }
  };

  const handleUpdate = (material) => {
    setClickedProduct(material);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setClickedProduct(id);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (updatedProduct) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/products/update-product', updatedProduct);
      if (response.data.success) {
        toast.success("Successfully updated");
        dispatch(updateProduct(
          updatedProduct
        ));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      toast.error('Error updating material! Please try again later.');
      console.error('Error saving material:', error);
    }
    setLoading(false);
    setIsUpdateModalOpen(false);
  };

  const confirmDelete = async () => {
    
    setLoading(true);
    try {
      /* When using the delete method in Axios, you should pass the data as part of the request configuration's data field, not directly in the options*/
      const response = await axiosInstance.delete('/api/products/delete-product', {
        data: { _id: clickedProduct },
      });
      if (response.data.success) {
        toast.success('Successfully deleted');
        dispatch(deleteProduct(clickedProduct));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      toast.error('Error deleting material! Please try again later.');
      console.error('Error deleting material:', error);
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="max-w-3xl mx-auto p-5 bg-white rounded-md shadow">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">All Products</h1>
          <div className="flex flex-col">
            <label className="text-center text-lg mb-1">Search by Location</label>
            <input
              type="search"
              placeholder="Search by Location"
              value={query}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((material) => (
              <div key={material._id} className="flex bg-gray-100 rounded-lg p-4 shadow-md gap-5">
                <div className="flex-shrink-0 w-24">
                  <img src={material.image} alt={material.productName} className="w-full h-auto rounded object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {material.productName}
                  </h3>
                  <p>Price: ${material.price.toFixed(2)}</p>
                  <p>location: {material.location}</p>
                  <p>{material.description}</p>
                  <div className="flex gap-3 mt-3">
                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={() => handleDelete(material._id)}>Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => handleUpdate(material)}>Update</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No materials found for your search.</p>
          )}
        </div>

        {isUpdateModalOpen && (
          <UpdateModal
            material={clickedProduct}
            /* In React, you can pass functions as props from a parent component to a child component. In this case, UpdateModal is a child component of AllProducts, and handleSave is passed as a prop to UpdateModal. This allows UpdateModal to call handleSave and pass the updatedMaterial data when the user clicks the "Save" button.*/
            onSave={handleSave}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            onConfirm={confirmDelete}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default AllProducts;