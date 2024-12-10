const AddModal = ({ onConfirm, onClose }) => {
    return (
      <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="modal-content bg-white rounded-lg p-5 w-96 shadow-md">
          <div className="modal-header flex justify-end">
            <span className="close cursor-pointer text-2xl text-gray-700 hover:text-blue-500 transition duration-300" onClick={onClose}>&times;</span>
          </div>
          <h2 className="text-xl font-bold">Product added successfully</h2>
          <p>Do you want to see added products on the View page?</p>
          <div className="button-container flex justify-end mt-4">
            <button className="edit-button bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-2 hover:bg-gray-400 transition duration-300" onClick={onClose}>Cancel</button>
            <button className="edit-button bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300" onClick={onConfirm}>Yes, Redirect</button>
          </div>
        </div>
      </div>
    );
  };
  export default AddModal;