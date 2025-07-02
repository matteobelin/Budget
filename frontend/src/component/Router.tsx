import { Route,Routes } from "react-router"
import Login from "./login/Login"
import SignUp from "./signup/SignUp"
import ProtectedRoute from "./ProtectedRoute"
import { useEffect, useState } from "react"
import UserContext from "../context/UserContex"
import type User from "../interface/UserInterface"
import Home from "./home/Home"

function Router(){

    const [name,setName] = useState<User | undefined>(undefined);

    const login = (data: User) => {
        setName(data);
    }

    const logout = () => {
        fetch("http://localhost:3000/auth/logout",{
            method:"POST",
            credentials:"include"
        })

        setName(undefined);
    };

    useEffect(() => {
        fetch("http://localhost:3000/me",{
            method:'GET',
            credentials: 'include'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } 
            throw new Error("Non connecté");
        })
        .then((json: User) => {
            
            setName(json);
        })
        .catch(() => {
            setName(undefined);
        });
    }, []);


    return(
        <UserContext.Provider value={{name,login,logout}}>
            <Routes>
                <Route path="/login" element={<Login />} />  
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
        </UserContext.Provider>
    )
}
export default Router