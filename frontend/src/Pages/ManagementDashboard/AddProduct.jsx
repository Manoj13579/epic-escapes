import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload_image from "../../assets/upload_image.png";
import Loader from "../../Utils/Loader";
import AddModal from "../../Utils/AddModal";
import { useDispatch } from "react-redux";
import { addProduct } from "../../Store/productSlice";
import axiosInstance from "../../Utils/axiosInstance";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    description: "",
    image: null,
    location: "",
    availableDates: [
      {
        startDate: "",
        endDate: "",
      },
    ],
  });


  const dispatch = useDispatch();
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // max file size to be uploaded set to 1 mb.

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size should be less than 1 MB");
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = null;
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.image);
        const photoUploadResponse = await axiosInstance.post(`/api/upload/admin-image-upload`,
          uploadFormData
        );
        photoUrl = photoUploadResponse.data.data;
      }

      const updatedFormData = {
        ...formData,
        image: photoUrl,
      };

      const response = await axiosInstance.post(
        `/api/products/add-product`,
        updatedFormData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(addProduct(updatedFormData));
        setFormData({
          productName: "",
          price: 0,
          description: "",
          image: null,
          location: "",
          availableDates: [
            {
              startDate: "",
              endDate: "",
            },
          ],
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      /*Navigate to login if token refresh fails from axios instance and error is 401 which happens when new access token is not generated. using here to use useNavigate(it can't be used in js file in axios instance) */
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      toast.error("Error in creating materials! Please try later");
      console.error("Error adding material:", error);
    }
    setLoading(false);
  };

  const handleDateChange = (e, field) => {
    const updatedAvailableDate = [...formData.availableDates];
    updatedAvailableDate[0][field] = e.target.value; // Dynamically update either startDate or endDate
    setFormData({ ...formData, availableDates: updatedAvailableDate });
  };
  
  
  
  const confirmRedirect = () => {
    navigate("/management-dashboard/admin-all-products");
    setIsModalOpen(false);
  };

  return (
    <section>
      {loading && <Loader />}
      <>
        {/* form */}
        <div className="container max-w-md mx-auto p-5 bg-white rounded-lg space-y-4">
          <div className="text-2xl font-bold">Add Product</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Product Title</label>
              <input
                type="text"
                name="name"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="quantity"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter full Address"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">
                Available Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.availableDates[0].startDate} // Access the first object in the array
                onChange={(e) => handleDateChange(e, "startDate")} // Pass the field name
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Available End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.availableDates[0].endDate} // Access the first object in the array
                onChange={(e) => handleDateChange(e, "endDate")}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              />
            </div>
            <div className=" mb-4">
              <p className="text-gray-500">
                Image types allowed: jpeg, jpg, png
              </p>
              <p className="text-gray-500">Image size shouldn't exceed 1 mb</p>
              <label
                htmlFor="file-input"
                className="flex items-center cursor-pointer"
              >
                <img
                  src={
                    formData.image
                      ? URL.createObjectURL(formData.image)
                      : upload_image
                  }
                  alt="Raw material preview"
                  className="w-28 h-28 rounded-lg border border-gray-300 object-cover"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="file-input"
                  hidden
                />
              </label>
            </div>
            <div className="button-container flex justify-end mt-4">
              <button
                type="submit"
                className="submit-button bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        {isModalOpen && (
          <AddModal
            onConfirm={confirmRedirect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    </section>
  );
};

export default AddProduct;
