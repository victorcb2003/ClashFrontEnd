import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ModalLayout from "../components/ModalLayout"
import { getUser } from "../services/authService"
import { createMatch } from "../services/matchService"
import { findAllEquipe } from "../services/equipeService"
import formaDate from "../utils/formaDate"
import { IoMdAdd } from 'react-icons/io'

export default function Match() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [equipes, setEquipes] = useState([])
    const [formData, setFormData] = useState({
        Equipe1_id: "",
        Equipe2_id: "",
        lieu: "",
        date_heure: ""
    })
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        ;(async () => {
            try {
                const userData = await getUser()
                setUser(userData?.user?.[0])
                setMatches(userData?.match)
                console.log(userData?.match)
            } catch (error) {
                console.error("Erreur lors du chargement des matchs:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [refresh])

    useEffect(() => {
        ;(async () => {
            try {
                const equipesData = await findAllEquipe()
                setEquipes(equipesData.equipes || [])
                console.log(equipesData.equipes)
            } catch (error) {
                console.error("Erreur lors du chargement des équipes:", error)
            }
        })()
    }, [])

    const handleModal = () => {
        setModalOpen(prev => !prev)
        if (!modalOpen) {
            setFormData({
                Equipe1_id: "",
                Equipe2_id: "",
                lieu: "",
                date_heure: ""
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const dateObj = new Date(formData.date_heure)
            const formattedDate = formaDate(dateObj)

            const response = await createMatch({
                Equipe1_id: formData.Equipe1_id,
                Equipe2_id: formData.Equipe2_id,
                lieu: formData.lieu,
                date_heure: formattedDate
            })

            console.log("Match créé:", response.data)
            handleModal()
            setRefresh(!refresh)
        } catch (error) {
            console.error("Erreur lors de la création du match:", error)
        }
    }

    if (loading) {
        return (
            <div className="relative w-full min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        )
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
                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Matchs</h1>
                        <p className="text-white/70">Vos derniers matchs et à venir</p>
                    </div>
                    <button
                        className="flex items-center text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-white/10"
                        onClick={handleModal}
                    >
                        <IoMdAdd size={50} />
                    </button>
                    </div>

                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                        <div className="space-y-3">
                            {matches.length === 0 && (
                                <div className="text-white/70">Aucun match à afficher.</div>
                            )}

                            {matches.map((m) => (
                                <div
                                    key={m.id}
                                    className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition cursor-pointer"
                                    onClick={() => navigate(`/match/${m.id}`)}
                                >
                                    <div>
                                        <div className="text-white font-semibold">
                                            {equipes?.filter((e)=>e.id == m?.Equipe1_id)[0]?.nom} VS {equipes.filter((e)=> e.id == m?.Equipe2_id)[0]?.nom}
                                        </div>
                                        <div className="text-white/60 text-sm">
                                            {m?.lieu || "Lieu à définir"} • {m?.date_heure ? new Date(m.date_heure).toLocaleString() : "Date à définir"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ModalLayout isOpen={modalOpen} handleModal={handleModal}>
                <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <p className="font-semibold text-xl mb-6 flex justify-center">Créer un match</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Équipe 1</label>
                            <select 
                                required 
                                value={formData.Equipe1_id}
                                onChange={(e) => setFormData({ ...formData, Equipe1_id: e.target.value })}
                                className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                            >
                                <option value="" disabled>Sélectionner une équipe</option>
                                {equipes.filter(e => e.id !== formData.Equipe2_id).map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Équipe 2</label>
                            <select 
                                required 
                                value={formData.Equipe2_id}
                                onChange={(e) => setFormData({ ...formData, Equipe2_id: e.target.value })}
                                className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                            >
                                <option value="" disabled>Sélectionner une équipe</option>
                                {equipes.filter(e => e.id !== formData.Equipe1_id).map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Lieu du match</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Lieu du match..." 
                                value={formData.lieu}
                                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                                className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Date et heure</label>
                            <input 
                                type="datetime-local" 
                                required 
                                value={formData.date_heure}
                                onChange={(e) => setFormData({ ...formData, date_heure: e.target.value })}
                                className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" 
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button type="button" onClick={handleModal} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">Annuler</button>
                            <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">Créer</button>
                        </div>
                    </form>
                </div>
            </ModalLayout>
        </div>
    )
}
