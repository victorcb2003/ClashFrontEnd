import { useEffect, useState } from "react"
import { findAllEquipe } from "../services/equipeService"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"
import { IoMdAdd } from 'react-icons/io'
import { createEquipe } from "../services/equipeService"
import ModalLayout from "../components/ModalLayout"
import { getUser } from "../services/authService"

export default function Equipe() {
    const [equipes, setEquipes] = useState([])
    const [nom, setNom] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const equipesData = await findAllEquipe()
            setEquipes(equipesData.equipes || [])
            const userData = await getUser()
            setUser(userData?.user?.[0])
        })()
    }, [refresh])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await createEquipe({
                nom : nom
            })

            console.log("Équipe créer:", response.data)
            setNom("")
            setIsOpen(false)
            setRefresh(!refresh)
        } catch (error) {
            console.error("Erreur lors de la création du match:", error)
        }
    }

    return (
        <div className="relative w-full min-h-screen">
            <Sidebar />

            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/Pelouse.png"
                    alt="background"
                    className="fixed w-full h-full object-cover brightness-70"
                />
            </div>

            <div className="relative z-10 ml-16 p-6 space-y-6">
                <div className="w-full max-w-6xl mx-auto space-y-6">
                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">Équipes</h1>

                        {["Admin","Selectionneurs"].includes(user?.type) && (
                            <button
                            className="flex items-center text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-white/10"
                            onClick={()=>setIsOpen(true)}
                        >
                            <IoMdAdd size={50} />
                        </button>
                        )}
                        
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
            <ModalLayout isOpen={isOpen} handleModal={() => setIsOpen(false)}>
                <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <p className="font-semibold text-xl mb-6 flex justify-center">Créer une Équipe</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Nom de l'équipe</label>
                            <input 
                                type="text" 
                                required 
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" 
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button type="button" onClick={()=> setIsOpen(false)} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">Annuler</button>
                            <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">Créer</button>
                        </div>
                    </form>
                </div>
            </ModalLayout>
        </div>
    )
}
