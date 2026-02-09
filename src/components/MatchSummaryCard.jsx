import { useEffect, useState } from "react"

function MatchSummaryCard() {

    const [matches, setMatches] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // const userResponse = await getUser()
            // setUser(userResponse.data)

            const userResponse = { data: { equipe: { name: "Loïck" } } }

            // const matchesResponse = await getMatchesSummary({id: userResponse.data.id})

            const matchesResponse = {
                data: [
                    { id: 0, score: "3-1", equipe1: { id: "0", name: "William" }, equipe2: { id: "0", name: "Loïck" } },
                    { id: 1, score: "0-2", equipe1: { id: "0", name: "Lebeuzz" }, equipe2: { id: "0", name: "Loïck" } },
                    { id: 2, score: "1-1", equipe1: { id: "0", name: "Maxime" }, equipe2: { id: "0", name: "Loïck" } },
                    { id: 3, score: "4-1", equipe1: { id: "0", name: "Loïck" }, equipe2: { id: "0", name: "Cemon" } },
                    { id: 4, score: "2-3", equipe1: { id: "0", name: "Loïck" }, equipe2: { id: "0", name: "Victor" } }
                ]
            }
            const scoredMatches = matchesResponse.data.map((matche) => {
                const [score1, score2] = matche.score.split("-").map(Number);
                return { ...matche, score1: score1, score2: score2 }
            })
            const statusedMatches = scoredMatches.map((matche) => {
                return { ...matche, status: getMatchStatus(matche, userResponse.data) }
            })
            setMatches(statusedMatches)

        } catch (err) {
            console.error("Erreur lors de la récupération des informations", err)
        }
    }

    const getMatchStatus = (matche, currentUser) => {
        let [score1, score2] = matche.score.split("-").map(Number);

        if (currentUser.equipe.name == matche.equipe2.name) {
            const temp = score1;
            score1 = score2;
            score2 = temp;
        }

        matche = { ...matche, score1: score1, score2: score2 }

        if (score1 > score2) {
            return "win"
        } else if (score1 == score2) {
            return "tie"
        } else {
            return "loose"
        }
    }

    return (
        <>
            {matches?.map((matche) => (
                <div className="relative" key={matche.id}>
                    <div className={`absolute border-l-4 border-t-4 border-r-4 px-4 py-2 border border-b-0 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px] inset-0 opacity-65 -z-10
                        ${matche?.status == "win" ? "bg-green-50" : ""}
                        ${matche?.status == "loose" ? "bg-red-50" : ""}
                        ${matche?.status == "tie" ? "bg-gray-50" : ""}
                        ${matche?.status == "win" ? "border-green-800" : ""}
                        ${matche?.status == "loose" ? "border-red-800" : ""}
                        ${matche?.status == "tie" ? "border-gray-800" : ""}`}
                    />
                    <div className={`px-4 py-2 z-10 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px]`}>
                        <p>Nom de tournoi</p>
                        <div className="flex mt-2 justify-center items-center">
                            <div className="relative">
                                <div className="absolute right-0 bottom-0 -top-4">
                                    <div className="flex flex-col text-gray-700 text-sm mr-4 h-[40px] overflow-y-scroll px-1 text-right sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                        <p>Buteur 1 20:56</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-2">
                                    <img src="/Clashofleague.png" alt="equipe1" className="w-12" />
                                    <p className="font-bold text-4xl">{matche?.score1}</p>
                                </div>
                            </div>
                            <p className="font-bold text-4xl pb-4">-</p>
                            <div className="flex flex-col">
                                <div className="flex gap-2">
                                    <p className="font-bold text-4xl">{matche?.score2}</p>
                                    <img src="/Clashofleague.png" alt="equipe2" className="w-12" />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -top-4 bottom-0">
                                    <div className="flex flex-col text-gray-700 text-sm ml-4 h-[60px] overflow-y-scroll px-1 sm:w-[80px] xl:w-[20vw] md:w-[100px] lg:w-[15vw]">
                                        <p>Buteur 1 20:56</p>
                                        <p>Buteur 2 20:56</p>
                                        <p>Buteur 3 20:56</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-20 pb-4">
                            <p className="text-lg w-1/2 text-right">{matche?.equipe1?.name}</p>
                            <p className="text-lg w-1/2">{matche?.equipe2?.name}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default MatchSummaryCard