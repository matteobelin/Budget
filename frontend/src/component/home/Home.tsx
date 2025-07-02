import UserContext from "../../context/UserContex"
import { useContext } from "react"

function Home(){

    const {logout} = useContext(UserContext)


    return(
        <>
            <p>Home</p>
            <button onClick={logout}>Deconnexion</button>
        </>
    )
}
export default Home