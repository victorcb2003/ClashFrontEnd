import { useEffect, useState } from "react"
import { getUser } from "../services/authService"
import Conteiner from "../components/Conteiner"


export default function Match() {
    const [user,setUser] = useState(null)

    useEffect(()=>{
        (async()=>{
            setUser(await getUser())
        })()
    },[])

    useEffect(()=>{
        console.log(user)
    },[user])
  return (
    <div>
        <Conteiner>
            <div className="flex flex-col gap-4 px-12 py-4">
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 min-h-screen w-full pl-16 py-6">
                    <h1 className="font-bold text-2xl text-green-400">Matchs</h1>
                </div>
            </div>
            
        </Conteiner>
    </div>
  )
}
