import { useState,useContext } from "react"
import type {DepenseDataWithId,DepenseData } from "@/interface/DepenseInterface"
import DepenseForm from "./DepenseForm"
import DepenseContext from "@/context/DepenseContext";

interface Props{
    onClose:()=>void;
    depense:DepenseDataWithId
}

function editDepense({onClose,depense}:Props){

    const [errorMessage, setErrorMessage] = useState("")
    const { refreshDepenses } = useContext(DepenseContext);
    const [creationMessage, setCreationMessage] = useState("")


    const onSubmit= async (data:DepenseData)=>{
                setErrorMessage("")
                const sendData:DepenseDataWithId = {
                                _id: depense._id,
                                ...data
                            }
                try{
                    const response = await fetch("http://localhost:3000/depense/update",{
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(sendData),
                        credentials: "include"
                    })
                    const responseData = await response.json()
                    if(!response.ok){
                        setErrorMessage(responseData.message || "Erreur lors de la mise à jour de la dépense")
                        return;
                    }

                    setCreationMessage(responseData.message)
                    await refreshDepenses()
                    setTimeout(onClose, 1000);
        
                }catch (error){
                    setErrorMessage("Une erreur est survenue lors de la mise à jour de la dépense")
                }
            }

    return (
            <>
                <DepenseForm initialData={depense} onSubmit={onSubmit} errorMessage={errorMessage} creationMessage={creationMessage}/>
            </>
        )

}
export default editDepense