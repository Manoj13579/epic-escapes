import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Utils/Loader";
import { IoIosSearch } from "react-icons/io";
import DeleteModal from "../../Utils/DeleteModal";
import axiosInstance from "../../Utils/axiosInstance";




const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");


  const getallUsers = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/api/auth/all-users`);
      if (response.data.success) {
        setAllUsers(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login"); 
        return;
      }
      toast.error("Cannot fetch users. try again later");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getallUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // allUsers gets data from api so await
    const filtered = await allUsers.filter((item) =>
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Default to showing the results if no filter is applied
  const dataToDisplay = searchTerm ? filteredData : allUsers;


const handleDelete = (_id) => {
  setOpenDeleteModal(true);
  setDeleteId(_id);
}
const confirmDelete = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.delete( `/api/auth/delete-user`, {data:{_id: deleteId}});
    if(response.data.success) {
      toast.success('user deleted');
      getallUsers();
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      navigate("/login"); 
      return;
    }
    toast.error('error in deleting !try again');
  console.error(error);
  };
  setOpenDeleteModal(false);
  setLoading(false);
};


  return (
    <>
      {loading && <Loader />}
      {/* Search Input */}
      <section>
        <form onSubmit={handleSubmit} className="w-60 md:w-96" >
          <label className="block">
            <div className="relative flex items-center">
  <input
    className="placeholder:italic placeholder:text-slate-400 block bg-white h-10 w-60 md:w-96 border-2 border-slate-400 rounded-md pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-slate-400 mb-2"
    placeholder="Search Users..."
    required
    type="text"
    name="search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    // establishes a connection between the input field and the list of options defined in the <datalist>.
    list="userslist"
  />
  {/* As the user types in the search field, they get auto-suggestions from the datalist as per value */}
  <datalist id="userslist">
    {allUsers?.map((item) => (
      <option key={item._id} value={item.firstName} />
    ))}
  </datalist>
  <button
    type="submit"
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent border-0 outline-none"
  >
    <IoIosSearch className="text-slate-900 w-5 h-5" />
  </button>
</div>
   </label>
        </form>
      </section>
      {/* Table */}
      <section className="bg-white p-6">
        <table className="table-auto border-collapse border border-slate-500 w-full">
          <caption className="caption-top text-gray-600">All Users</caption>
          <thead>
            <tr>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                #
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Users
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Name
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Email
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Role
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Authprovider
              </th>
              <th className="border border-slate-600 p-2 text-gray-600 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
              <tr key={item._id}>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  <img
                    src={item.photo}
                    className="w-6 h-6"
                    alt={item.firstName}
                  />
                </td>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  {item.firstName}
                </td>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  {item.email}
                </td>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  {item.role}
                </td>
                <td className="border border-slate-700 p-2 text-gray-600 text-center">
                  {item.authProvider}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  <button onClick={()=> handleDelete(item._id)} className="bg-red-500 text-white text-sm p-1 rounded-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {openDeleteModal && 
       <DeleteModal
       onConfirm={confirmDelete}
       onClose={() => setOpenDeleteModal(false)}
       />
      }
     
    </>
  );
};

export default AllUsers;