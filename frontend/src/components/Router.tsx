import { Route, Routes } from "react-router"
import Login from "./login/Login"
import SignUp from "./signup/SignUp"
import ProtectedRoute from "./ProtectedRoute"
import { useEffect, useState } from "react"
import UserContext from "../context/UserContex"
import CategoryContext from "../context/CategoryContext"
import type User from "../interface/UserInterface"
import Home from "./home/Home"
import CreateDepense from "./depense/CreateDepense"
import type { GetListCategoryData } from "@/interface/CategoryInterface"

function Router() {
    const [name, setName] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const login = (data: User) => {
        setName(data)
    }

    const logout = () => {
        fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            credentials: "include"
        })
        setName(undefined)
    }

    const [categories, setCategories] = useState<GetListCategoryData>([])

    const refreshCategories = async () => {
        try {
            const response = await fetch("http://localhost:3000/category/all", {
                method: "GET",
                credentials: "include"
            })
            const data: GetListCategoryData = await response.json()
            if (response.ok) {
                setCategories(data)
            }
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error)
        }
    }

    useEffect(() => {
        fetch("http://localhost:3000/me", {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("Non connecté")
            })
            .then((json: User) => {
                setName(json)
                setLoading(false)
                refreshCategories()
            })
            .catch(() => {
                setName(undefined)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div>Chargement...</div>
    }

    return (
        <UserContext.Provider value={{ name, login, logout }}>
            <CategoryContext.Provider value={{ categories, refreshCategories }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/create" element={<ProtectedRoute><CreateDepense  /></ProtectedRoute>} />
                </Routes>
            </CategoryContext.Provider>
        </UserContext.Provider>
    )
}
export default Router