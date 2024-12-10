import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// pages
import Layout from "./Component/Layout/Layout";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import NotFound from "./Component/OtherComponents/NotFound";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import RegisterVerification from "./Pages/Auth/RegisterVerification";
import ResetPassword from "./Pages/Auth/ResetPassword";
import UserProtectedRoute from "./Component/OtherComponents/ProtectedRoute/UserProtectedRoute";
import AdminProtectedRoute from "./Component/OtherComponents/ProtectedRoute/AdminProtectedRoute";
import GoogleLoginSuccess from "./Pages/Auth/GoogleLoginSuccess";
import DashboardLayout from "./Pages/ManagementDashboard/DashboardLayout";
import DashboardIndex from "./Pages/ManagementDashboard/DashboardIndex";
import AddProduct from "./Pages/ManagementDashboard/AddProduct";
import AllProducts from "./Pages/ManagementDashboard/AllProducts";
import LayoutIndex from "./Component/Layout/LayoutIndex";
import ProductDetail from "./Pages/OtherPages/ProductDetail";
import SearchedPage from "./Pages/OtherPages/SearchedPage";
import AllUsers from "./Pages/ManagementDashboard/AllUsers";
import AllBookings from "./Pages/ManagementDashboard/AllBookings";
import AllReport from "./Pages/ManagementDashboard/AllReport";
import GeoMap from "./Component/OtherComponents/GeoMap";
import BookingPage from "./Pages/OtherPages/BookingPage";
import GetUserBooking from "./Pages/OtherPages/GetUserBooking";
import UserProfileEdit from "./Pages/Auth/UserProfileEdit";
import AdminProfileEdit from "./Pages/Auth/AdminProfileEdit";




const App = () => {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
    <Route path="/" element={<Layout />}>
    <Route 
    index element = {<LayoutIndex />}
    />
    <Route path="login" element={<Login />} />
    <Route path="map" element={<GeoMap />} />
   
    <Route path="product-detail/:_id" element={<ProductDetail />} />
    <Route path="searched-page" element={<SearchedPage />} />
    <Route path="google-login-success" element={<GoogleLoginSuccess />} />
    <Route path="register" element={<Register />} />
    <Route path="register-verification/:id" element={<RegisterVerification />} />
    <Route path="forgot-password" element={<ForgotPassword />}/>
    <Route path="reset-password" element={<ResetPassword />}/>
    <Route element = {<UserProtectedRoute />}>
    <Route path="booking-page" element={<BookingPage />} />
    <Route path="get-user-booking" element={<GetUserBooking />} />
    <Route path="user-profile-edit" element={<UserProfileEdit />} />
    </Route>
    </Route>
     <Route element = {<AdminProtectedRoute />}>
<Route path="management-dashboard" element={<DashboardLayout />}>
      <Route index element ={<DashboardIndex />}/>
      <Route path="admin-add-product" element={<AddProduct />} />
      <Route path="admin-all-products" element={<AllProducts />} />
      <Route path="admin-all-users" element={<AllUsers />} />
      <Route path="admin-all-bookings" element={<AllBookings />} />
      <Route path="admin-all-report" element={<AllReport />} />
      <Route path="admin-profile-edit" element={<AdminProfileEdit />} />
      </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  ))

  return (
    <div>
     <RouterProvider router={router} />
    </div>
  )
}

export default App;