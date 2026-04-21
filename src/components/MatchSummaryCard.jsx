import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUser } from "../services/authService"
import { getButByMatch } from "../services/butService"
import { getEquipeById } from "../services/equipeService"

function MatchSummaryCard() {
    const navigate = useNavigate()
    const [matches, setMatches] = useState([])
    const [teamById, setTeamById] = useState({})
    const [goalsByMatchId, setGoalsByMatchId] = useState({})
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        ;(async () => {
            try {
                const userData = await getUser()
                const fetchedMatches = userData?.match || []
                setCurrentUser(userData?.user?.[0] || null)
                setMatches(fetchedMatches)

                const uniqueTeamIds = Array.from(
                    new Set(
                        fetchedMatches
                            .flatMap((m) => [m.Equipe1_id, m.Equipe2_id])
                            .filter(Boolean),
                    ),
                )

                const teams = await Promise.all(uniqueTeamIds.map((id) => getEquipeById(id)))
                const teamMap = {}
                teams.forEach((team, idx) => {
                    const normalizedTeam = team?.equipe || team?.Equipe || team
                    teamMap[uniqueTeamIds[idx]] = normalizedTeam
                })
                setTeamById(teamMap)

                const goalsResults = await Promise.all(
                    fetchedMatches.map(async (m) => {
                        const res = await getButByMatch(m.id)
                        return [m.id, res?.buts || []]
                    }),
                )

                const goalsMap = {}
                goalsResults.forEach(([matchId, goals]) => {
                    goalsMap[matchId] = goals
                })
                setGoalsByMatchId(goalsMap)
            } catch (error) {
                console.error("Erreur lors du chargement des résumés de matchs:", error)
            }
        })()
    }, [])

    const playerNameById = useMemo(() => {
        const map = {}
        Object.values(teamById).forEach((team) => {
            ;(team?.Joueurs || []).forEach((p) => {
                map[p.id] = `${p.prenom || ""} ${p.nom || ""}`.trim()
            })
        })
        return map
    }, [teamById])

    const computeSummary = (match) => {
        const team1 = match?.Equipe1 || teamById[match?.Equipe1_id]
        const team2 = match?.Equipe2 || teamById[match?.Equipe2_id]

        const team1Ids = new Set((team1?.Joueurs || []).map((j) => j.id))
        const goals = goalsByMatchId[match.id] || []

        let score1 = 0
        let score2 = 0
        const leftScorers = []
        const rightScorers = []

        goals.forEach((g) => {
            const minute = Math.max(
                0,
                Math.round((new Date(g.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000),
            )
            const scorer = playerNameById[g.User_id] || "Joueur"
            const line = `${scorer} ${minute}'`

            if (team1Ids.has(g.User_id)) {
                score1 += 1
                leftScorers.push(line)
            } else {
                score2 += 1
                rightScorers.push(line)
            }
        })

        const currentTeamId = currentUser?.Equipe_id
        let status = "tie"
        if (currentTeamId === match?.Equipe1_id) {
            status = score1 > score2 ? "win" : score1 < score2 ? "lose" : "tie"
        } else if (currentTeamId === match?.Equipe2_id) {
            status = score2 > score1 ? "win" : score2 < score1 ? "lose" : "tie"
        }

        return {
            team1Name: team1?.nom || "Équipe 1",
            team2Name: team2?.nom || "Équipe 2",
            tournoiName: match?.Tournois?.nom || match?.tournoi_nom || "Match amical",
            score1,
            score2,
            leftScorers,
            rightScorers,
            status,
        }
    }

    if (!matches?.length) {
        return (
            <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                <p className="text-white/80">Aucun match à afficher.</p>
            </div>
        )
    }

    return (
        <>
            {matches.map((match) => {
                const summary = computeSummary(match)
                return (
                    <div className="relative cursor-pointer" key={match.id} onClick={() => navigate(`/match/${match.id}`)}>
                        <div className={`absolute border-l-4 border-t-4 border-r-4 px-4 py-2 border border-b-0 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px] inset-0 opacity-85 -z-10 backdrop-blur-lg`}
                            style={{
                                backgroundColor: `
                                    ${match.status == "win" ? "hsla(130, 45%, 15%, 0.75)" : ""}
                                    ${match.status == "loose" ? "hsla(10, 55%, 15%, 0.75)" : ""}
                                    ${match.status == "tie" ? "hsla(0, 0%, 15%, 0.75)" : ""}
                                `,
                                borderColor: `
                                    ${match.status == "win" ? "hsl(130, 45%, 75%)" : ""}
                                    ${match.status == "loose" ? "hsl(10, 55%, 75%)" : ""}
                                    ${match.status == "tie" ? "hsl(0, 0%, 65%)" : ""}
                                `
                            }}
                        />

                        <div className="px-4 py-2 z-10 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px]">
                            <p>{summary.tournoiName}</p>

                            <div className="flex mt-2 justify-center items-center">
                                <div className="relative">
                                    <div className="absolute right-0 bottom-0 -top-4">
                                        <div className="flex flex-col text-gray-700 text-sm mr-4 h-[60px] overflow-y-scroll px-1 text-right sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                            {summary.leftScorers.length ? summary.leftScorers.map((s, i) => <p key={i}>{s}</p>) : <p>—</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <img src="/Clashofleague.png" alt="equipe1" className="w-12" />
                                        <p className="font-bold text-4xl">{summary.score1}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-4xl pb-4">-</p>
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <p className="font-bold text-4xl">{summary.score2}</p>
                                        <img src="/Clashofleague.png" alt="equipe2" className="w-12" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -top-4 bottom-0">
                                        <div className="flex flex-col text-gray-700 text-sm ml-4 h-[60px] overflow-y-scroll px-1 sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                            {summary.rightScorers.length ? summary.rightScorers.map((s, i) => <p key={i}>{s}</p>) : <p>—</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-20 pb-4">
                                <p className="text-lg w-1/2 text-right">{summary.team1Name}</p>
                                <p className="text-lg w-1/2">{summary.team2Name}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default MatchSummaryCard