import React, { useState, useEffect } from 'react';
import upload_image from "../assets/upload_image.png";
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const UpdateModal = ({ material, onSave, onClose }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [newImageUploaded, setNewImageUploaded] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (material) {
      setProductName(material.productName);
      setLocation(material.location);
      setDescription(material.description);
      setPrice(material.price);
      setImage(material.image);
    }
  }, [material]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size should be less than 1 MB');
        return;
      }
      setNewImageUploaded(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = material.image;
 // Only upload the new image if new one is uploaded
      if (newImageUploaded) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", newImageUploaded);

        const photoUploadResponse = await axiosInstance.post('/api/upload/admin-image-upload', uploadFormData);
        photoUrl = photoUploadResponse.data.data;
      }

      const updatedProduct = {
        productName,
        description,
        price,
        location,
        image: photoUrl,
        _id: material._id
      };
await onSave(updatedProduct);     
      onClose();

    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      toast.error("Update failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md mx-auto ">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-2xl font-bold text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <h2 className="text-lg font-semibold mb-4">Update Material</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-[80vh] overflow-auto">
          <label className="font-semibold">Name:</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="p-2 border border-gray-300 rounded" />

          <label className="font-semibold">Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 border border-gray-300 rounded" />

          <label className="font-semibold">Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border border-gray-300 rounded min-h-16"></textarea>

          <label className="font-semibold">Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="p-2 border border-gray-300 rounded" />

          <label className="font-semibold">Image:</label>
          <input type="file" onChange={handleFileChange} className="p-2 border border-gray-300 rounded" />
          <img 
          /* new image uploaded is true then create image url and show or image with existing url show or show upload_image. showing image here so need to handle three conditions. */
          src={newImageUploaded ? URL.createObjectURL(newImageUploaded) : image || upload_image} 
          alt="Preview" 
          className="w-28 h-28 rounded-lg border border-gray-300 object-cover"
/>

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4">{loading ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;