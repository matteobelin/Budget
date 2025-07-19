import { Link, useNavigate } from "react-router"
import UserContext from "../../context/UserContex"
import { useContext, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SignUpData, SignUpDataReception } from "../../interface/SignUpDataInterface"
import SignUpSchema from "../../schema/SignUpSchema"
import { Eye, EyeOff } from "lucide-react"

// Import des composants shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import DepenseContext from "@/context/DepenseContext"
import CategoryContext from "@/context/CategoryContext"

function SignUp() {
    const {refreshDepenses} = useContext(DepenseContext)
    const {refreshCategories} = useContext(CategoryContext)
    const { name, login } = useContext(UserContext)
    const navigation = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (name) {
            navigation("/");
        }
    }, [name, navigation]);

    const form = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            lastname: "",
            firstname: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: SignUpData) => {
        try {
            setErrorMessage("");
            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include"
            })
            const responseData = await response.json();
            if (!response.ok) {
                setErrorMessage(responseData.message || "Erreur lors de la création du compte")
                return;
            }
            const user: SignUpDataReception = responseData;
            login(user);
            refreshDepenses()
            refreshCategories()
            navigation("/");
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la création du compte")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
                    <CardDescription className="text-center">
                        Rejoignez-nous en créant votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Dupont" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Jean" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jean.dupont@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="*********"
                                                    {...field}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" /> }
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="*********"
                                                    {...field}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                                </button>
                                            </div>
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

                            <Button type="submit" className="w-full"> Créer mon compte </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-muted-foreground">Déjà un compte ? </span>
                        <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                            Se connecter
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp