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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";



function DepenseList() {
  const { depenses, refreshDepenses } = useContext(DepenseContext);
  const [showFormCreate, setShowFormCreate] = useState(false)
  const [showFormEdit, setShowFormEdit] = useState(false)
  const [depenseToEdit, setDepenseToEdit] = useState<DepenseDataWithId|null>(null)
  const [sortField, setSortField] = useState<'date' | 'montant' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        } catch {
          toast.error("Erreur serveur");
        }
     };

  const handleSort = (field: 'date' | 'montant') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: 'date' | 'montant') => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // Sort the depenses array based on current sort settings
  const sortedDepenses = [...depenses].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortField === 'montant') {
      return sortDirection === 'asc' ? a.montant - b.montant : b.montant - a.montant;
    }

    return 0;
  });

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
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('montant')}
            >
              <div className="flex items-center">
                Montant
                {getSortIcon('montant')}
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="pl-8 cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center">
                Date
                {getSortIcon('date')}
              </div>
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDepenses.map((depense) => (
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
