import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import { createTournois, getTournaments } from "../services/tournoisService"
import { getUser } from "../services/authService"
import { findByTournoisId } from "../services/matchService"
import TournamentSummaryCard from "../components/TournamentSummaryCard"
import ModalLayout from "../components/ModalLayout"

function Tournois() {
    const [currentTournaments, setCurrentTournaments] = useState([])
    const [futurTournaments, setFuturTournaments] = useState([])
    const [myTournaments, setMyTournaments] = useState([])

    const [visibleMy, setVisibleMy] = useState(5)
    const [visibleCurrent, setVisibleCurrent] = useState(5)
    const [visibleFuture, setVisibleFuture] = useState(5)

    const [currentUser, setCurrentUser] = useState(null)
    const [matches, setMatches] = useState({})

    // State de la modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalNom, setModalNom] = useState("")
    const [modalDate, setModalDate] = useState("")
    const [modalLieu, setModalLieu] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const user = await getUser()
            setCurrentUser(user.user[0])
            const response = await getTournaments()
            filterTournaments(response, user.user[0])
            await fetchMatchesForTournaments(response.slice(0, 5))
        } catch (err) {
            console.log(err)
        }
    }

    const fetchMatchesForTournaments = async (tournamentsList) => {
        try {
            const matchesByTournament = {}

            await Promise.all(
                tournamentsList.map(async (t) => {
                    const res = await findByTournoisId({ id: t.id })
                    matchesByTournament[t.id] = res
                })
            )

            setMatches(prev => ({
                ...prev,
                ...matchesByTournament
            }))
        } catch (err) {
            console.error("Erreur lors du chargement des matchs", err)
        }
    }

    const filterTournaments = (tournamentsList, user) => {
        const now = new Date()

        const my = []
        const current = []
        const future = []

        tournamentsList.forEach(t => {
            const isMine = t.Organisateurs[0].id === user.id
            const startDate = new Date(t.date_debut)

            if (isMine) {
                my.push(t)
                return
            }

            if (startDate <= now) {
                current.push(t)
            } else {
                future.push(t)
            }
        })

        setMyTournaments(my)
        setCurrentTournaments(current)
        setFuturTournaments(future)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await createTournois({ nom: modalNom, date: modalDate, lieu: modalLieu })
            console.log(response.data)
        } catch (err) {
            console.error("Erreur lors de la création de tournois: ", err)
        }
    }

    const handleSeeMore = (type) => {
        switch (type) {
            case "My":
                const nextVisibleMy = visibleMy + 5

                const myTournamentsToFetch = myTournaments.slice(
                    visibleMy,
                    nextVisibleMy
                )
                setVisibleMy(nextVisibleMy)
                fetchMatchesForTournaments(myTournamentsToFetch)
                break
            case "Current":
                const nextVisibleCurrent = visibleCurrent + 5

                const currentTournamentsToFetch = currentTournaments.slice(
                    visibleCurrent,
                    nextVisibleCurrent
                )
                setVisibleCurrent(nextVisibleCurrent)
                fetchMatchesForTournaments(currentTournamentsToFetch)
                break
            case "Future":
                const nextVisibleFuture = visibleCurrent + 5

                const futureTournamentsToFetch = futurTournaments.slice(
                    visibleFuture,
                    nextVisibleFuture
                )
                setVisibleFuture(nextVisibleFuture)
                fetchMatchesForTournaments(futureTournamentsToFetch)
                break
            default:
                console.log("Wrong type")
        }
    }

    const handleModal = () => {
        setModalOpen(prev => !prev)
    }

    return (
        <>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-50" />
                </div>
                <Sidebar />

                <div className="relative z-10 min-h-screen w-full pl-16 py-6">
                    {myTournaments.length > 0 && (
                        <div className="flex flex-col gap-4 px-12 py-4">
                            <p className="font-bold text-2xl text-green-400">Mes tournois</p>
                            {myTournaments.slice(0, visibleMy).map((tournament) => (
                                <TournamentSummaryCard key={tournament.id} tournament={tournament} />
                            ))}
                            {visibleMy < myTournaments.length && (
                                <div className="flex justify-center mt-4">
                                    <button onClick={() => handleSeeMore("My")} className="px-4 py-2 rounded-md border border-green-500 text-green-500 hover:bg-green-100" >Voir plus</button>
                                </div>
                            )}
                        </div>

                    )}
                    <div className="flex justify-center items-center">
                        <button onClick={() => handleModal()} className="px-3 py-1 rounded-md border-2 border-green-600 bg-green-100 text-green-800 font-semibold">Créer un évenement</button>
                    </div>

                    {myTournaments.length > 0 && currentTournaments.length > 0 && (
                        <span className="block my-10 border-b border-green-500/40 w-4/5 mx-auto" />
                    )}
                    {currentTournaments.length > 0 && (
                        <div className="flex flex-col gap-4 px-12 py-4">
                            <p className="font-bold text-2xl text-green-400">Tournois en cours</p>
                            {currentTournaments.slice(0, visibleCurrent).map((tournament) => (
                                <TournamentSummaryCard key={tournament.id} tournament={tournament} />
                            ))}
                            {visibleCurrent < currentTournaments.length && (
                                <div className="flex justify-center mt-4">
                                    <button onClick={() => handleSeeMore("Current")} className="px-4 py-2 rounded-md border border-green-500 text-green-500 hover:bg-green-100" >Voir plus</button>
                                </div>
                            )}
                        </div>
                    )}

                    {futurTournaments.length > 0 && currentTournaments.length > 0 && (
                        <span className="block my-10 border-b border-green-500/40 w-4/5 mx-auto" />
                    )}
                    {futurTournaments.length > 0 && (
                        <div className="flex flex-col gap-4 px-12 py-4">
                            <p className="font-bold text-2xl text-green-400">Tournois à venir</p>
                            {futurTournaments.slice(0, visibleCurrent).map((tournament) => (
                                <TournamentSummaryCard key={tournament.id} tournament={tournament} />
                            ))}
                            {visibleFuture < futurTournaments.length && (
                                <div className="flex justify-center mt-4">
                                    <button onClick={() => handleSeeMore("Future")} className="px-4 py-2 rounded-md border border-green-500 text-green-500 hover:bg-green-100" >Voir plus</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <ModalLayout isOpen={modalOpen} handleModal={handleModal}>
                <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <p className="font-semibold text-xl mb-12 flex justify-center">Créer un tournoi</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Nom du tournoi</label>
                            <input type="text" required placeholder="Nom du tournoi..." value={modalNom} onChange={(e) => setModalNom(e.target.value)} className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Date de début</label>
                            <input type="date" required value={modalDate} onChange={(e) => setModalDate(e.target.value)} className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-medium">Lieu</label>
                            <input type="text" required placeholder="Lieu du tournoi..." value={modalLieu} onChange={(e) => setModalLieu(e.target.value)} className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" />
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={handleModal} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                            <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Créer</button>
                        </div>
                    </form>
                </div>

            </ModalLayout >
        </>
    )
}


export default Tournois
