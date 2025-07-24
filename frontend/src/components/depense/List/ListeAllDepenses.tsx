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

      {/* Desktop view - Table */}
      <div className="hidden md:block">
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

      {/* Mobile view - Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        <div className="flex justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center" 
            onClick={() => handleSort('date')}
          >
            Trier par date {getSortIcon('date')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center" 
            onClick={() => handleSort('montant')}
          >
            Trier par montant {getSortIcon('montant')}
          </Button>
        </div>

        {sortedDepenses.map((depense) => (
          <div key={depense._id} className="bg-white rounded-lg shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full border border-black"
                  style={{ backgroundColor: depense.categoryColor }}
                ></span>
                <span className="font-medium">{depense.categoryName}</span>
              </div>
              <span className="font-bold">{depense.montant} €</span>
            </div>

            <div>
              <p className="text-sm text-gray-700">{depense.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{new Date(depense.date).toLocaleDateString("fr-FR")}</span>
              {depense.tags && <span>{depense.tags}</span>}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                size="sm" 
                onClick={() => {
                  setDepenseToEdit(depense)
                  setShowFormEdit(true)
                }}
              >
                Modifier
              </Button>
              <Button 
                variant="destructive" 
                className="cursor-pointer" 
                size="sm" 
                onClick={() => handleDelete(depense)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepenseList;
