import { useContext, type ReactNode } from "react";
import UserContext from "../context/UserContex";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({children}:ProtectedRouteProps){
    const {name} = useContext(UserContext)

    if(!name){
        return <Navigate to={"/login"} replace />
    }

    return <>{children}</>

}

export default ProtectedRoute