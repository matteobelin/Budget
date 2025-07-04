import { useState } from "react"
import type { DepenseData } from "@/interface/DepenseInterface"
import DepenseForm from "./DepenseForm"

function CreateDepense(){

    const [errorMessage, setErrorMessage] = useState("")

    const onSubmit= async (data:DepenseData)=>{
            setErrorMessage("")
            try{
                const response = await fetch("http://localhost:3000/depense/create",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    credentials: "include"
                })
                const responseData = await response.json()
                if(!response.ok){
                    setErrorMessage(responseData.message || "Erreur lors de la création de la dépense")
                    return;
                }
    
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la création de la dépense")
            }
        }

        return (
            <>
                <DepenseForm onSubmit={onSubmit} errorMessage={errorMessage} />
            </>
        )

}
export default CreateDepense