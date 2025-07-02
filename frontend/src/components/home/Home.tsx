import UserContext from "../../context/UserContex"
import { useContext } from "react"
import CreateCategory from "../categorie/CreateCategory"

function Home(){

    const {logout} = useContext(UserContext)


    return(
        <>
            <p>Home</p>
            <button onClick={logout}>Deconnexion</button>
            <CreateCategory />
        </>
    )
}
export default Home