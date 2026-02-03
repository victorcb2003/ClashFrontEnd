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
        <>
            <div className="relative w-full bg-orange-50 min-h-[100vh]">
                <div className="absolute bottom-0 top-0 w-full z-0 pointer-events-none">
                    <img src="/Clashofleague2.png" alt="" className="fixed w-full h-full object-cover blur-md opacity-50 z-0" />
                </div>
                <Sidebar />
                <div className="z-10 opacity-100 relative h-full w-full pl-16">
                    {myTournaments.length > 0 &&
                        <div className="flex flex-col gap-4 px-12 py-2">
                            <p className="font-bold text-xl text-orange-700">Mes tournois :</p>
                            {myTournaments.map((tournament) => (
                                <TournamentSummaryCard key={tournament.id} tournament={tournament} />
                            ))}
                        </div>
                    }
                    {myTournaments.length > 0 && currentTournaments.length > 0 && <span className="pt-6 mb-6 border-b-2 border-r-0 border-l-0 border-t-0 border-orange-500 w-4/5 flex justify-center mx-auto" />}
                    {currentTournaments.length > 0 &&
                        <div className="flex flex-col gap-4 px-12 py-2">
                            <p className="font-bold text-xl text-orange-700">Tournois actuelle :</p>
                            {currentTournaments.map((tournament) => (
                                <TournamentSummaryCard tournament={tournament} />
                            ))}
                        </div>
                    }
                    {futurTournaments.length > 0 && currentTournaments.length > 0 && <span className="pt-6 mb-6 border-b-2 border-r-0 border-l-0 border-t-0 border-orange-500 w-4/5 flex justify-center mx-auto" />}
                    {futurTournaments.length > 0 &&
                        <div className="flex flex-col gap-4 px-12 py-2">
                            <p className="font-bold text-xl text-orange-700">Tournois à venir :</p>
                            {futurTournaments.map((tournament) => (
                                <TournamentSummaryCard tournament={tournament} />
                            ))}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Tournois
