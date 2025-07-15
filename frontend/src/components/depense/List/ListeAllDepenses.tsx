import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useContext, useEffect } from "react";
import DepenseContext from "@/context/DepenseContext";
import DepenseRow from "./DepenseRow";

function DepenseList() {
  const { depenses, refreshDepenses } = useContext(DepenseContext);

  useEffect(() => {
    if (!depenses) {
      refreshDepenses();
    }
  }, [depenses, refreshDepenses]);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Liste des Dépenses</h2>
        <Button size="sm" onClick={() => console.log("Ajouter une dépense")}>
          Ajouter une dépense
        </Button>
      </div>

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
              onEdit={() => console.log("Modifier", depense._id)}
              onDelete={() => console.log("Supprimer", depense._id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DepenseList;
