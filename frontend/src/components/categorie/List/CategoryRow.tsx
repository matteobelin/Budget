import { TableRow,TableCell} from "../../ui/table";
import { useState } from "react";
import { Button } from "../../ui/button";
import type { CategoryData } from "@/interface/CategoryInterface";
import DeleteAlertDialog from "@/components/AlertDialog/DeleteAlertDialog";


interface Props {
  category: CategoryData;
  onEdit?: () => void;        
  onDelete?: () => Promise<void>;
  isDefault?: boolean;        
}

function CategoryRow({ category, onEdit, onDelete, isDefault = false }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    if (isDefault) return;  
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
      <TableRow key={category.categoryName}>
        <TableCell>
          <div className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full border border-black"
              style={{ backgroundColor: isDefault ? "#A9A9A9" : category.color }}
            ></span>
            <span>{isDefault ? "Default" : category.categoryName}</span>
          </div>
        </TableCell>
        <TableCell className="text-right space-x-2">
          {!isDefault && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Modifier
            </Button>
          )}
          {!isDefault && onDelete && (
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              Supprimer
            </Button>
          )}
        </TableCell>
      </TableRow>

      {!isDefault && (
        <DeleteAlertDialog
          message={`la catégorie "${category.categoryName}"`}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
        />
      )}
    </>
  );
}

export default CategoryRow