import UserContext from "../../context/UserContex"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import LoginSchema from "../../schema/LoginSchema"
import { useForm } from "react-hook-form"
import type { LoginData, LoginDataReception } from "../../interface/LoginDataInterface"
import { Eye, EyeOff } from "lucide-react"


// Import des composants shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CategoryContext from "@/context/CategoryContext"
import DepenseContext from "@/context/DepenseContext"


function Login() {

    const {refreshDepenses} = useContext(DepenseContext)
    const {refreshCategories} = useContext(CategoryContext)
    const { name, login } = useContext(UserContext)
    const navigation = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (name) {
            navigation("/");
        }
    }, [name, navigation]);

    const form = useForm<LoginData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginData) => {
        setErrorMessage("");
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include"
            })
            const responseData = await response.json();
            if (!response.ok) {
                setErrorMessage(responseData.message || "Erreur lors de la connexion")
                return;
            }
            const user: LoginDataReception = responseData;
            login(user);
            refreshDepenses()
            refreshCategories()
            navigation("/");
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la connexion")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">
                        Connectez-vous à votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jean.dupont@gmail.com" {...field}/>
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
                                                <Input type={showPassword ? "text" : "password"} placeholder="*********" {...field} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-primary"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
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

                            <Button type="submit" className="w-full"> Connexion</Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center space-y-2">
                        <div>
                            <span className="text-sm text-muted-foreground">Pas de compte ? </span>
                            <Link to="/signup" className="text-sm font-medium text-primary hover:underline">
                                Créer un compte
                            </Link>
                        </div>
                        <div>
                            <a href="/rest-password" className="text-sm text-muted-foreground hover:underline">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login