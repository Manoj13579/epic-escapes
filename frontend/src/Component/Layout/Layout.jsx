import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { Disclosure, DisclosureButton, DisclosurePanel, 
    Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { toast } from 'react-toastify';
import axios from 'axios';


const Layout = () => {

const navigate = useNavigate();
const user = JSON.parse(sessionStorage.getItem('user'));


const handleLogout = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true});
    if(response.data.success) {
    navigate('/login');
    sessionStorage.removeItem('user');
    toast.success("successfully logged out");
    }
  } catch (error) {
    if(error.response && error.response.status === 400){
      toast.error(error.response.data.message)
    }
    else{
      toast.error('logout failed try again later');
      console.error(error);
    }
  }
};


const handleGoogleLogout = async () =>{ 
  try {
    await  axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/googlelogout`, {}, {
      withCredentials: true
    })
      sessionStorage.removeItem('user');
      navigate('/login')
      toast.success("logged out successfully")
    }
  catch (error) {
    toast.error("error in logout try again");
    console.log(error)
  }
};


  return (
    <div>
    <nav>
    <Disclosure as="nav" className="bg-gray-900">
 <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
   <div className="relative flex h-16 items-center justify-between">
     <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
       {/* Mobile menu button */}
       <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
         <span className="absolute -inset-0.5" />
         <Bars3Icon className="block h-6 w-6 group-data-[open]:hidden" />
         <XMarkIcon className="hidden h-6 w-6 group-data-[open]:block" />
       </DisclosureButton>
     </div>
     <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
       <div className="flex flex-shrink-0 items-center">
         <img
           alt="epic escapes logo"
           src={logo}
           className="h-10 w-auto"
         />
       </div>
       <Link to = '/'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
            <span className='text-green-700 font-bold text-lg'>Epic</span><span className='text-blue-700 font-bold text-lg'>Escapes</span>
           </Link>
       <div className="hidden sm:ml-6 sm:block mt-1">
           <div className="flex space-x-8">
           <Link to = '/'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
             Home
           </Link>
           <Link to = '/'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
             About
           </Link>
           <Link to = '/'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
             Contact
           </Link>
         </div>
       </div>
     </div>
     {
      !user &&<div className='flex gap-x-1 md:gap-x-0'>
       <Link to = '/register'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md md:px-3 md:py-2 text-sm font-medium">
             Signup
           </Link>
           <Link to = '/login'
             className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md md:px-3 md:py-2 text-sm font-medium">
             Login
           </Link>
      </div>
     }
     {/* jwt Profile dropdown */}
      {user?.authProvider === 'jwt' &&
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
       <button
         type="button"
         className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
       >
         <span className="absolute -inset-1.5" />
         <BellIcon className="h-6 w-6" />
       </button>
<Menu as="div" className="relative ml-3">
<div>
  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    <span className="absolute -inset-1.5" />
    {user?.image ? <img
      src={user.image}
      alt="user image"
      className="h-8 w-8 rounded-full"
    />: <p className="h-8 w-8 rounded-full text-white font-bold text-2xl flex items-center justify-center bg-blue-500">{user?.firstName.charAt(0).toUpperCase()}</p>}
    
  </MenuButton>
</div>
<MenuItems
  transition
  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
>
  <MenuItem>
    <Link to = '/user-profile-edit'className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
      Edit Profile
    </Link>
  </MenuItem>
  <MenuItem>
    <Link to = '/get-user-booking'className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
      My Bookings
    </Link>
  </MenuItem>
  <MenuItem>
    <span className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer" onClick={handleLogout}>
      Sign out
    </span>
  </MenuItem>
</MenuItems>
</Menu>
</div>
      }
      {/* google profile dropdown */}
       {user?.authProvider === 'google' &&
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
       <button
         type="button"
         className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
       >
         <span className="absolute -inset-1.5" />
         <BellIcon className="h-6 w-6" />
       </button>
<Menu as="div" className="relative ml-3">
<div>
  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    <span className="absolute -inset-1.5" />
    {user?.image ? <img
      alt="user image"
      className="h-8 w-8 rounded-full"
    />: <p className="h-8 w-8 rounded-full text-white font-bold text-2xl flex items-center justify-center">{user?.firstName.charAt(0).toUpperCase()}</p>}
    
  </MenuButton>
</div>
<MenuItems
  transition
  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
>
  <MenuItem>
    <Link to = '/get-user-booking' className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
      My Bookings
    </Link>
  </MenuItem>
  <MenuItem>
    <span className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer" onClick={handleGoogleLogout}>
      Sign out
    </span>
  </MenuItem>
</MenuItems>
</Menu>
</div>
      }
   </div>
 </div>
{/* for small screen */}
<DisclosurePanel className="sm:hidden absolute inset-x-0 top-16 bg-gray-900 z-20">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <DisclosureButton
                as={Link}
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Home
              </DisclosureButton>
              <DisclosureButton
                as={Link}
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                About
              </DisclosureButton>
              <DisclosureButton
                as="a"
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Contact
              </DisclosureButton>
            </div>
          </DisclosurePanel>
</Disclosure>
    </nav>
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout;
