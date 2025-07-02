import { createContext } from "react"
import type UserContextType from "../interface/UserContextTypeInterface"

const UserContext = createContext<UserContextType>({
    name :undefined,
    login:()=>{},
    logout:()=>{}

})
export default UserContext