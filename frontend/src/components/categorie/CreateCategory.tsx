import { useState,useContext  } from "react"
import CategoryForm from "./CategoryForm";
import type { CategoryData } from "@/interface/CategoryInterface";
import CategoryContext from "@/context/CategoryContext"

interface Props {
    onClose: () => void;
}


function CreateCategory({ onClose }: Props){
    const { refreshCategories } = useContext(CategoryContext);

    const [errorMessage, setErrorMessage] = useState("")
    const [creationMessage, setCreationMessage] = useState("")

    const onSubmit= async (data:CategoryData)=>{
            setErrorMessage("")
            try{
                const response = await fetch("http://localhost:3000/category/create",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    credentials: "include"
                })
                const responseData = await response.json()
                if(!response.ok){
                    setErrorMessage(responseData.message || "Erreur lors de la création de la catégorie")
                    return;
                }

                setCreationMessage(responseData.message)
                await refreshCategories()
                setTimeout(onClose, 1000);
                return
    
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la création de la catégorie")
            }
        }
    
    return (
        <>
        <CategoryForm onClose={onClose} onSubmit={onSubmit} errorMessage={errorMessage} creationMessage={creationMessage}/>
        </>
    )
    


}
export default CreateCategory