import { useState, useContext } from "react"
import type { CategoryData, CategoryDataWithId} from "@/interface/CategoryInterface";
import CategoryForm from "./CategoryForm";
import CategoryContext from "@/context/CategoryContext";

interface Props{
    onClose: () => void;
    category:CategoryDataWithId
}

function EditCategory({onClose,category}:Props){

    const [errorMessage, setErrorMessage] = useState("")

    const { refreshCategories } = useContext(CategoryContext);

    const [creationMessage, setCreationMessage] = useState("")


    const onSubmit= async (data:CategoryData)=>{
            setErrorMessage("")
            const sendData:CategoryDataWithId = {
                _id: category._id,
                ...data
            }
            try{
                const response = await fetch("http://localhost:3000/category/update",{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sendData),
                    credentials: "include"
                })
                const responseData = await response.json()
                if(!response.ok){
                    setErrorMessage(responseData.message || "Erreur lors de la mise à jour de la catégorie")
                    return;
                }
                setCreationMessage(responseData.message)
                await refreshCategories()
                setTimeout(onClose, 1000);
    
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la mise à jour de la catégorie")
            }
        }
    
    
        return (
            <>
                <CategoryForm initialData={category} onClose={onClose} onSubmit={onSubmit} errorMessage={errorMessage} creationMessage={creationMessage} />
            </>
        )
    

}
export default EditCategory