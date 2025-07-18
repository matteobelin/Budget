import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"

import { DepenseSchema } from "@/schema/DepenseSchema"
import type { DepenseData } from "@/interface/DepenseInterface"
import { useContext } from "react";
import CategoryContext from "@/context/CategoryContext";


import { cn } from "@/lib/utils"

interface Props {
  initialData?: DepenseData;
  onSubmit: (data: DepenseData) => Promise<void> | void;
  errorMessage?: string;
  creationMessage:string
}


function DepenseForm({ initialData, errorMessage, onSubmit ,creationMessage}: Props) {

  const [open, setOpen] = useState(false);
  const { categories, refreshCategories } = useContext(CategoryContext);


  useEffect(() => {
    if (!categories) {
      refreshCategories();
    }
  }, [categories, refreshCategories]);

  const form = useForm<DepenseData>({
    resolver: zodResolver(DepenseSchema),
    defaultValues: initialData
    ? {
        ...initialData,
        date: new Date(initialData.date),
      }
    : {
        montant: 0,
        description: "",
        date: new Date(),
        categoryName: "Default",
        tags: ""
      }
  });

  return (
   <Card className="relative w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Dépense</CardTitle>
        <CardDescription className="text-center">
          {initialData ? "Modifier les informations de la dépense" : "Créer une nouvelle dépense"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="montant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la dépense *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renseigner une description *</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea 
                          {...field}
                          placeholder="Entrez votre description..."
                          rows={4}
                          maxLength={250}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <div className="text-sm text-muted-foreground mt-1 text-right">
                          {(field.value?.length || 0)} / 250 caractères
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Sélectionner une date *</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value.toLocaleDateString("fr-FR") : <span>Choisir une date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                           onSelect={(date) => {
                                field.onChange(date);
                                setOpen(false); 
                              }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choisir une catégorie *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un thème" />
                        </SelectTrigger>
                        <SelectContent className="z-[110]" position="popper" sideOffset={5}>
                          <SelectItem value="Default">Default</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.categoryName} value={category.categoryName}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renseigner un tag (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} 
                        placeholder="Exemple : #BK"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              {creationMessage && (
                <Alert className="alert-success">
                    <AlertDescription>{creationMessage}</AlertDescription>
                </Alert>
            )}

              <Button type="submit" className="w-full cursor-pointer">
                {initialData ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default DepenseForm;
