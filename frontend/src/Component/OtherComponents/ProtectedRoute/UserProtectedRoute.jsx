import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const UserProtectedRoute = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    

    // useEfect only used for displaying toast
    useEffect(() => {
        if (!user) {
            toast.warn('You must login first');
        }
    }, []);

    if (user?.role === 'user') {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
};

export default UserProtectedRoute;