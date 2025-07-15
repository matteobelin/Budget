import { createContext } from "react"
import type DepenseContextType from "@/interface/DepenseContextType"

const DepenseContext = createContext<DepenseContextType>({
    depenses:[],
    refreshDepenses: async () => {}
})

export default DepenseContext