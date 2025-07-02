import { Link, useNavigate } from "react-router"
import UserContext from "../../context/UserContex"
import { useContext, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SignUpData,SignUpDataReception } from "../../interface/SignUpDataInterface"
import SignUpSchema from "../../schema/SignUpSchema"

function SignUp(){

    const {name,login} = useContext(UserContext)
    const navigation = useNavigate()
    const [errorMessage,setErrorMessage] = useState("")


    useEffect(() => {
        if (name) {
            navigation("/");
        }
    }, [name, navigation]);

    const { register, handleSubmit, formState:{ errors } } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema)
    });

    const onSubmit = async (data: SignUpData)  => {
            try{
                setErrorMessage("");
                const response = await fetch("http://localhost:3000/auth/signup",{
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
                const user: SignUpDataReception = responseData;
                login(user); 
                navigation("/");
            } catch (error) {
                setErrorMessage("Une erreur est survenue lors de la connexion")
            }
        }


     return(
        <>
        <div className="signup-container">
            <h1>Créer un compte</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="lastname">Nom :</label>
                <input {...register("lastname")} type="text" name="lastname" required/>
                <p>{errors.lastname?.message}</p>

                <label htmlFor="firstname">Prénom :</label>
                <input {...register("lastname")} type="text" name="firstname" required/>
                <p>{errors.firstname?.message}</p>

                <label htmlFor="email">Email :</label>
                <input {...register("email")} type="email" placeholder="jean.dupont@gmail.com" required/>
                <p>{errors.email?.message}</p>

                <label htmlFor="password">Mot de passe :</label>
                <input {...register("password")} type="password" placeholder="*********" required/>
                <p>{errors.password?.message}</p>

                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input {...register("confirmPassword")} type="password" placeholder="*********" required/>
                <p>{errors.confirmPassword?.message}</p>
                
                <p>{errorMessage}</p>

                <Link to={"/login"}>Se connecter</Link>
                <button type="submit">Créer</button>
            </form>
        </div>
        </>
    )

}
export default SignUp