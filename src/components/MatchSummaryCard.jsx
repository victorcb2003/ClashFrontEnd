import { useEffect, useState } from "react"

function MatchSummaryCard({ user, matches, size = "medium" }) {

    const [processedMatches, setProcessedMatches] = useState([])

    useEffect(() => {
        let finalMatches = []

        const scoredMatches = matches.map((match) => {
            const [score1, score2] = match.score.split("-").map(Number)
            return { ...match, score1, score2 }
        })

        if (!!user) {
            const statusedMatches = scoredMatches.map((match) => {
                return {
                    ...match,
                    status: getMatchStatus(match, user)
                }
            })
            finalMatches = [...statusedMatches].sort((a, b) => b.id - a.id)

        } else {
            finalMatches = [...scoredMatches].sort((a, b) => b.id - a.id)
        }

        setProcessedMatches(finalMatches)

    }, [user, matches])

    const getMatchStatus = (match, currentUser) => {
        let { score1, score2 } = match

        if (currentUser.equipe.name === match.equipe2.name) {
            [score1, score2] = [score2, score1]
        }

        if (score1 > score2) return "win"
        if (score1 === score2) return "tie"
        return "loose"
    }

    switch (size) {
        case "medium":
            return (
                processedMatches?.map((match) => (
                    <div className="relative" key={match.id}>
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
                        <div className={`px-4 py-2 z-10 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px] text-gray-50`}>
                            <p>Nom de tournoi</p>
                            <div className="flex mt-2 justify-center items-center">
                                <div className="relative">
                                    <div className="absolute right-0 bottom-0 -top-4">
                                        <div className="flex flex-col text-gray-300 text-sm mr-4 h-[40px] overflow-y-scroll px-1 text-right sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                            <p>Buteur 1 20:56</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <img src="/Clashofleague.png" alt="equipe1" className="w-12" />
                                        <p className="font-bold text-4xl">{match?.score1}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-4xl pb-4">-</p>
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <p className="font-bold text-4xl">{match?.score2}</p>
                                        <img src="/Clashofleague.png" alt="equipe2" className="w-12" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -top-4 bottom-0">
                                        <div className="flex flex-col text-gray-300 text-sm ml-4 h-[60px] overflow-y-scroll px-1 sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                            <p>Buteur 1 20:56</p>
                                            <p>Buteur 2 20:56</p>
                                            <p>Buteur 3 20:56</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-20 pb-4">
                                <p className="text-lg w-1/2 text-right">{match?.equipe1?.name}</p>
                                <p className="text-lg w-1/2">{match?.equipe2?.name}</p>
                            </div>
                        </div>
                    </div>
                ))
            )
        case "small":
            processedMatches?.map((match) => (
                <div className="relative" key={match.id} >

                </div>
            ))

        default:
            return null
    }
}

export default MatchSummaryCard