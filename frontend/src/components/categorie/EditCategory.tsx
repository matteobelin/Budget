
import { useState, useEffect } from "react"
import type { CategoryData, EditCategoryData} from "@/interface/CategoryInterface";
import CategoryForm from "./CategoryForm";

interface Props{
    onClose: () => void;
    _id:string
}

function EditCategory({onClose,_id}:Props){

    const [errorMessage, setErrorMessage] = useState("")

    const [category, setCategory] = useState<CategoryData>()



    const onSubmit= async (data:CategoryData)=>{
            setErrorMessage("")
            const sendData:EditCategoryData = {
                _id,
                ...data
            }
            try{
                const response = await fetch("http://localhost:3000/category/update",{
                    method: "POST",
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
                onClose()
    
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la mise à jour de la catégorie")
            }
        }
    
    useEffect(() => {
            const fetchCategory = async () => {
              try {
                const response = await fetch(`http://localhost:3000/depense/id=${_id}`, {
                  method: "GET",
                  credentials: "include"
                });
        
                const responseData: CategoryData = await response.json();
        
                if (response.ok) {
                  setCategory(responseData);
                }
              } catch (error) {
                console.error("Erreur lors de la récupération de la category :", error);
              }
            }
            fetchCategory()
        },[]);
    
        return (
            <>
                <CategoryForm initialData={category} onClose={onClose} onSubmit={onSubmit} errorMessage={errorMessage} />
            </>
        )
    

}
export default EditCategory