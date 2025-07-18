import { Route, Routes } from "react-router"
import Login from "./login/Login"
import SignUp from "./signup/SignUp"
import ProtectedRoute from "./ProtectedRoute"
import { useEffect, useState } from "react"
import UserContext from "../context/UserContex"
import CategoryContext from "../context/CategoryContext"
import DepenseContext from "@/context/DepenseContext"
import type User from "../interface/UserInterface"
import Home from "./home/Home"
import CategorieList from "./categorie/List/ListAllCategories"
import Layout from "./Sidebar/layout"
import { Toaster } from "sonner";

import type { GetListCategoryData } from "@/interface/CategoryInterface"
import type { GetListDepenseData } from "@/interface/DepenseInterface"
import DepenseList from "./depense/List/ListeAllDepenses"
import ChatDemo from "./chat/chat"

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

    const [depenses,setDepenses] = useState<GetListDepenseData>([])

    const refreshDepenses = async () => {
        try {
            const response = await fetch("http://localhost:3000/depense/all", {
                method: "GET",
                credentials: "include"
            })
            const data: GetListDepenseData = await response.json()
            if (response.ok) {
                setDepenses(data)
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
                refreshDepenses()
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
                <DepenseContext.Provider value={{depenses,refreshDepenses}}>
                    <>
                    <Toaster richColors /> {}

                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route 
                            path="/" 
                            element={
                            <ProtectedRoute>
                                <Layout>
                                    <Home />
                                </Layout>
                            </ProtectedRoute>}
                        />
                        <Route
                            path="/depenseList"
                            element={
                            <ProtectedRoute>
                                <Layout>
                                    <DepenseList />
                                </Layout>
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/categoryList"
                            element={
                            <ProtectedRoute>
                                <Layout>
                                <CategorieList />
                                </Layout>
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                            <ProtectedRoute>
                                <Layout>
                                <ChatDemo />
                                </Layout>
                            </ProtectedRoute>
                            }
                        />
                    </Routes>
                    </>
                </DepenseContext.Provider>
            </CategoryContext.Provider>
        </UserContext.Provider>
    )
}
export default Router