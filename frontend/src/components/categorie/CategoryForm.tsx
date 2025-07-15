import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"

import type { CategoryData } from "@/interface/CategoryInterface"
import { CreateCategorySchema } from "@/schema/CategorySchema"

interface Props {
    initialData?: CategoryData;
    onClose: () => void;
    onSubmit: (data: CategoryData) => Promise<void> | void
    errorMessage: string;
    creationMessage:string
}


function CategoryForm({initialData,onClose,onSubmit,errorMessage,creationMessage}:Props){

    const form = useForm<CategoryData>({
                resolver:zodResolver(CreateCategorySchema),
                defaultValues: initialData ??{
                    categoryName:"",
                    color:"#000"
                }
            }
        )


    return (
        <>
        <Card className="relative w-full max-w-md">
            <Button
                size="icon"
                onClick={onClose}
                variant="ghost"
                className="absolute right-2 top-2 rounded-full cursor-pointer"
            >
                <X className="h-4 w-4" />
            </Button>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Catégorie</CardTitle>
                <CardDescription className="text-center">
                    {initialData ? "Modifier une catégorie" : "Créer une catégorie"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="categoryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom de la catégorie</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Abonnement" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Choisir une couleur</FormLabel>
                                        <FormControl>
                                            <Input type="color" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertDescription> {errorMessage} </AlertDescription>
                                </Alert>
                            )}

                            {creationMessage && (
                                <Alert className="alert-success">
                                    <AlertDescription>{creationMessage}</AlertDescription>
                                </Alert>
                            )}
                            <Button className="cursor-pointer" type="submit">{initialData ? "Modifier" : "Créer"}</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
        </>
    )
}
export default CategoryForm