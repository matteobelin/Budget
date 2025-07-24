import { Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { useContext, useEffect, useState } from "react"
import CategoryContext from "@/context/CategoryContext"
import CategoryRow from "./CategoryRow"
import CreateCategory from "../CreateCategory"
import EditCategory from "../EditCategory"
import type { CategoryDataWithId } from "@/interface/CategoryInterface"
import {Dialog,DialogContent,DialogTitle,DialogDescription } from "@/components/ui/dialog"
import DepenseContext from "@/context/DepenseContext"

function CategorieList(){

    const {categories, refreshCategories } = useContext(CategoryContext)
    const { refreshDepenses }= useContext(DepenseContext)
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryDataWithId | null>(null);
    const [showFormCreate, setShowFormCreate] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false)

    useEffect(() => {
        if (!categories) {
          refreshCategories();
        }
      }, [categories, refreshCategories]);

     const handleDelete = async(data:CategoryDataWithId)=>{
        try {
          const response = await fetch("http://localhost:3000/category/delete",{
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
                  await refreshCategories()

                  await refreshDepenses()
        } catch {
          toast.error("Erreur serveur");
        }
     };

    return (
    <div className="w-full space-y-4"  >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Liste des catégories</h2>
        <Button size="sm" className="cursor-pointer" onClick={() => setShowFormCreate(true)}>
          Ajouter une catégorie
        </Button>
      </div>

      {showFormCreate && (
        <Dialog open={showFormCreate} onOpenChange={setShowFormCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="hidden"/>
            <DialogDescription />
            <CreateCategory onClose={() => setShowFormCreate(false)} />
          </DialogContent>
        </Dialog>
      )}


      {showFormEdit && categoryToEdit  && (
        <Dialog open={showFormEdit} onOpenChange={setShowFormEdit}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="hidden"/>
            <DialogDescription />
            <EditCategory onClose={() => setShowFormEdit(false)} category={categoryToEdit}/>
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop view - Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Catégorie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CategoryRow
              category={{ categoryName: "Default", color: "#A9A9A9" }}
              isDefault={true}
            />
            {categories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                onEdit={() => {
                  setCategoryToEdit(category);
                  setShowFormEdit(true);
                }}
                onDelete={() => handleDelete(category)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view - Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {/* Default category card */}
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-full border border-black"
              style={{ backgroundColor: "#A9A9A9" }}
            ></span>
            <span className="font-medium">Default</span>
          </div>
        </div>

        {/* Category cards */}
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full border border-black"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="font-medium">{category.categoryName}</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="cursor-pointer" 
                  onClick={() => {
                    setCategoryToEdit(category);
                    setShowFormEdit(true);
                  }}
                >
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  className="cursor-pointer" 
                  size="sm" 
                  onClick={() => handleDelete(category)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorieList
