import { useState, useEffect } from "react"
import type { DepenseData,EditDepenseData } from "@/interface/DepenseInterface"
import DepenseForm from "./DepenseForm"

interface Props{
    _id:string
}

function editDepense({_id}:Props){

    const [errorMessage, setErrorMessage] = useState("")
    const [depense, setDepense] = useState<DepenseData>()


    const onSubmit= async (data:DepenseData)=>{
                setErrorMessage("")
                const sendData:EditDepenseData = {
                    _id,
                    ...data
                }

                try{
                    const response = await fetch("http://localhost:3000/depense/update",{
                        method: "POST",
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
        
                }catch (error){
                    setErrorMessage("Une erreur est survenue lors de la mise à jour de la dépense")
                }
            }

    useEffect(() => {
        const fetchDepense = async () => {
          try {
            const response = await fetch(`http://localhost:3000/depense/id=${_id}`, {
              method: "GET",
              credentials: "include"
            });
    
            const responseData: DepenseData = await response.json();
    
            if (response.ok) {
              setDepense(responseData);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de la dépense :", error);
          }
        }
        fetchDepense()
    },[]);

    return (
            <>
                <DepenseForm initialData={depense} onSubmit={onSubmit} errorMessage={errorMessage} />
            </>
        )

}
export default editDepense