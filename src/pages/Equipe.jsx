import { useEffect, useState } from "react"
import { findAllEquipe } from "../services/equipeService"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"

export default function Equipe() {
    const [equipes, setEquipes] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const equipesData = await findAllEquipe()
            console.log(equipesData)
            setEquipes(equipesData.equipes || [])
        })()
    }, [])
    
    return (
        <div className="relative w-full min-h-screen">
            <Sidebar/>
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/Pelouse.png"
                    alt="background"
                    className="fixed w-full h-full object-cover brightness-70"
                />
            </div>

            <div className="relative z-10 ml-16 p-6 space-y-6">
                <div className="w-full max-w-6xl mx-auto space-y-6">
                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                        <h1 className="text-3xl font-bold text-white">Équipes</h1>
                    </div>

                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                        <div>
                            {equipes && equipes.length > 0 ? (
                                equipes.map(equipe =>
                                    <div 
                                        key={equipe.id} 
                                        onClick={() => navigate(`/equipe/${equipe.id}`)}
                                        className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition cursor-pointer border border-white/10 group mb-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar equipe={equipe} size="sm" className="shadow-xl" />
                                            <div className="flex-1">
                                                <p className="text-white font-semibold group-hover:text-orange-300 transition">
                                                    {equipe.nom}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    {equipe.nb_joueurs || 0} joueur{equipe.Joueurs?.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="col-span-full text-center text-white/70 py-8">
                                    Aucune équipe à afficher.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
