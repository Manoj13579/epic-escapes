import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const AdminProtectedRoute = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    useEffect(() => {
        if (!user) {
            toast.warn('You must login first');
        }
    }, []);

    if (user?.role === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
};

export default AdminProtectedRoute;