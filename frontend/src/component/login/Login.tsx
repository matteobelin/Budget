import UserContext from "../../context/UserContex"
import { useContext, useEffect, useState } from "react"
import { Link,useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import LoginSchema from "../../schema/LoginSchema"
import { useForm } from "react-hook-form"
import type { LoginData, LoginDataReception } from "../../interface/LoginDataInterface"

function Login(){

    const {name,login} = useContext(UserContext)
    const navigation = useNavigate()
    const [errorMessage,setErrorMessage] = useState("")


    useEffect(() => {
        if (name) {
            navigation("/");
        }
    }, [name, navigation]);

    const { register, handleSubmit, formState:{ errors } } = useForm<LoginData>({
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (data: LoginData)  => {
        setErrorMessage("");
        try{
            const response = await fetch("http://localhost:3000/auth/login",{
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
            navigation("/");
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la connexion")
        }
    }

    return(
        <>
        <div className="login-container">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email :</label>
                <input {...register("email")} type="email" placeholder="jean.dupont@gmail.com" required/>
                <label htmlFor="password">Mot de passe :</label>
                <p>{errors.email?.message}</p>
                <input {...register("password")} type="password" placeholder="*********" required/>
                <p>{errors.password?.message}</p>
                <p>{errorMessage}</p>
                <button type="submit">Connexion</button>
                <Link to={"/signup"}>Créer un compte</Link>
                <a href="/rest-password">Mot de passe oublié</a>
            </form>
        </div>
        </>
    )
}
export default Login