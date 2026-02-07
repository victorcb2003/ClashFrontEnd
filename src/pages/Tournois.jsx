import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import { getTournaments } from "../services/tournoisService"
import { getUser } from "../services/authService"
import { findByTournoisId } from "../services/matchService"
import TournamentSummaryCard from "../components/TournamentSummaryCard"

function Tournois() {
    const [currentTournaments, setCurrentTournaments] = useState([])
    const [futurTournaments, setFuturTournaments] = useState([])
    const [myTournaments, setMyTournaments] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [matches, setMatches] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const user = await getUser()
            setCurrentUser(user)
            const response = await getTournaments()
            filterTournaments(response, user)
            await fetchMatchesForTournaments(response)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchMatchesForTournaments = async (tournamentsList) => {
        try {
            const matchesByTournament = {}
            console.log(tournamentsList)

            await Promise.all(
                tournamentsList.map(async (t) => {
                    const res = await findByTournoisId({ id: t.id })
                    matchesByTournament[t.id] = res
                })
            )

            setMatches(matchesByTournament)
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
            const isMine = t.Organisateurs[0].id === user?.id
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

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="/Pelouse.png"
                        alt="background"
                        className="fixed w-full h-full object-cover brightness-70"
                    />
                </div>
                <div className="absolute inset-0 bg-black/60" />

            <Sidebar />

            <div className="relative z-10 min-h-screen w-full pl-16 py-6">
                {myTournaments.length > 0 && (
                    <div className="flex flex-col gap-4 px-12 py-4">
                        <p className="font-bold text-2xl text-green-400">
                            Mes tournois
                        </p>
                        {myTournaments.map((tournament) => (
                            <TournamentSummaryCard
                                key={tournament.id}
                                tournament={tournament}
                            />
                        ))}
                    </div>
                )}

                {myTournaments.length > 0 && currentTournaments.length > 0 && (
                    <span className="block my-10 border-b border-green-500/40 w-4/5 mx-auto" />
                )}
                {currentTournaments.length > 0 && (
                    <div className="flex flex-col gap-4 px-12 py-4">
                        <p className="font-bold text-2xl text-green-400">
                            Tournois en cours
                        </p>
                        {currentTournaments.map((tournament) => (
                            <TournamentSummaryCard
                                key={tournament.id}
                                tournament={tournament}
                            />
                        ))}
                    </div>
                )}

                {futurTournaments.length > 0 && currentTournaments.length > 0 && (
                    <span className="block my-10 border-b border-green-500/40 w-4/5 mx-auto" />
                )}
                {futurTournaments.length > 0 && (
                    <div className="flex flex-col gap-4 px-12 py-4">
                        <p className="font-bold text-2xl text-green-400">
                            Tournois à venir
                        </p>
                        {futurTournaments.map((tournament) => (
                            <TournamentSummaryCard
                                key={tournament.id}
                                tournament={tournament}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}


export default Tournois
