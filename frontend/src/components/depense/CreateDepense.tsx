import { useContext, useState } from "react"
import type { DepenseData } from "@/interface/DepenseInterface"
import DepenseForm from "./DepenseForm"
import DepenseContext from "@/context/DepenseContext"

interface Props{
    onClose:()=>void
}

function CreateDepense({onClose}:Props){

    const [errorMessage, setErrorMessage] = useState("")
    const [creationMessage, setCreationMessage] = useState("")
    const {refreshDepenses} = useContext(DepenseContext)

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
    
                setCreationMessage(responseData.message)
                await refreshDepenses()
                setTimeout(onClose,1000)
            }catch (error){
                setErrorMessage("Une erreur est survenue lors de la création de la dépense")
            }
        }

        return (
            <>
                <DepenseForm onSubmit={onSubmit} errorMessage={errorMessage} creationMessage={creationMessage}/>
            </>
        )

}
export default CreateDepense