import UserContext from "../../context/UserContex"
import { useContext } from "react"
import CreateCategory from "../categorie/CreateCategory"
import { useState } from "react"
import CreateDepense from "../depense/CreateDepense"
import CategorieList from "../categorie/List/ListAllCategories"

function Home(){

    const {logout} = useContext(UserContext)
    const [showForm, setShowForm] = useState(false)


    return(
        <>
            <p>Home</p>
            <button onClick={logout}>Deconnexion</button>
            <button onClick={() => setShowForm(true)}>Ajouter une catégorie</button>
            {showForm && (
                <CreateCategory onClose={() => setShowForm(false)} />
            )}
            <CreateDepense />
            <CategorieList />
        </>
    )
}
export default Home