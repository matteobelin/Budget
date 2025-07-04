import { useState } from "react"
import CategoryForm from "./CategoryForm";
import type { CategoryData } from "@/interface/CategoryInterface";

interface Props {
    onClose: () => void;
}


function CreateCategory({ onClose }: Props){

    const [errorMessage, setErrorMessage] = useState("")

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
                onClose()
    
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la création de la catégorie")
            }
        }
    
    return (
        <>
        <CategoryForm onClose={onClose} onSubmit={onSubmit} errorMessage={errorMessage} />
        </>
    )
    


}
export default CreateCategory