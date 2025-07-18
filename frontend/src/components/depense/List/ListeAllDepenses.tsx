import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useContext, useEffect, useState } from "react";
import DepenseContext from "@/context/DepenseContext";
import DepenseRow from "./DepenseRow";
import CreateDepense from "../CreateDepense";
import EditDepense from "../EditDepense";
import {Dialog,DialogContent,DialogTitle,DialogDescription} from "@/components/ui/dialog"
import type { DepenseDataWithId } from "@/interface/DepenseInterface";
import { toast } from "sonner"



function DepenseList() {
  const { depenses, refreshDepenses } = useContext(DepenseContext);
  const [showFormCreate, setShowFormCreate] = useState(false)
  const [showFormEdit, setShowFormEdit] = useState(false)
  const [depenseToEdit, setDepenseToEdit] = useState<DepenseDataWithId|null>(null)

  useEffect(() => {
    if (!depenses) {
      refreshDepenses();
    }
  }, [depenses, refreshDepenses]);



  const handleDelete = async(data:DepenseDataWithId)=>{
        try {
          const response = await fetch("http://localhost:3000/depense/delete",{
                      method: "DELETE",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                      credentials: "include"
                  })
                  const responseData = await response.json()
                  if(!response.ok){
                      toast.error(responseData.message || "Erreur lors de la suppression");
                      return;
                  }
                  toast.success(responseData.message || "Suppression réussie !");
                  await refreshDepenses()
        } catch (error) {
          toast.error("Erreur serveur");
        }
     };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Liste des Dépenses</h2>
        <Button size="sm" className="cursor-pointer" onClick={() => setShowFormCreate(true)}>
          Ajouter une dépense
        </Button>
      </div>

      {showFormCreate && (
        <Dialog open={showFormCreate} onOpenChange={setShowFormCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="hidden"/>
            <DialogDescription />
            <CreateDepense onClose={() => setShowFormCreate(false)} />
          </DialogContent>
        </Dialog>
      )}

      {showFormEdit && depenseToEdit  && (
        <Dialog open={showFormEdit} onOpenChange={setShowFormEdit}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="hidden" />
            <DialogDescription />
            <EditDepense onClose={() => setShowFormEdit(false)} depense={depenseToEdit}/>
          </DialogContent>
        </Dialog>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="pl-8">Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depenses.map((depense) => (
            <DepenseRow
              key={depense._id}
              depense={depense}
              onEdit={() =>{
                setDepenseToEdit(depense)
                setShowFormEdit(true)
              }}
              onDelete={() => handleDelete(depense)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DepenseList;
