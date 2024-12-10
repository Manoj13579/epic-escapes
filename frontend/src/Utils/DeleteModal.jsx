// components/modals/DeleteModal.js
import React from 'react';

const DeleteModal = ({ material, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-sm mx-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-2xl font-bold text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p className="mt-2 text-gray-600">Are you sure you want to delete ?</p>
        <div className="flex gap-4 justify-end mt-5">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;