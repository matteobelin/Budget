import { TableRow, TableCell } from "../../ui/table";
import { useState } from "react";
import { Button } from "../../ui/button";
import DeleteAlertDialog from "@/components/AlertDialog/DeleteAlertDialog";
import type { EditDepenseData } from "@/interface/DepenseInterface";

interface Props {
  depense: EditDepenseData;
  onEdit?: () => void;
  onDelete?: () => void;
}

function DepenseRow({ depense, onEdit, onDelete }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) await onDelete();
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full border border-black"
              style={{ backgroundColor: depense.categoryColor }}
            ></span>
            <span>{depense.categoryName}</span>
          </div>
        </TableCell>

        <TableCell>{depense.montant} €</TableCell>
        <TableCell>{depense.description}</TableCell>
        <TableCell className="pl-8">{new Date(depense.date).toLocaleDateString("fr-FR")}</TableCell>
        <TableCell>{depense.tags}</TableCell>

        <TableCell className="text-right space-x-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              Supprimer
            </Button>
          )}
        </TableCell>
      </TableRow>

      {onDelete && (
        <DeleteAlertDialog
          message={`la dépense "${depense.description}"`}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
        />
      )}
    </>
  );
}

export default DepenseRow;
