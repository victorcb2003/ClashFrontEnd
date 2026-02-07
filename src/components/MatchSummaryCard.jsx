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
    <div className="space-y-4">
      {matches.map((m) => (
        <div
          key={m.id}
          className={`backdrop-blur-md rounded-xl border p-4 shadow-lg text-white ${statusStyle(m.status)}`}
        >
          <p className="text-sm text-white/70 mb-2">Nom du tournoi</p>

          <div className="flex justify-center items-center gap-6">
            <div className="text-right w-1/3">{m.equipe1.name}</div>

            <div className="flex items-center gap-3">
              <img src="/Clashofleague.png" className="w-10" />
              <span className="text-4xl font-bold">{m.score1}</span>
              <span className="text-2xl">-</span>
              <span className="text-4xl font-bold">{m.score2}</span>
              <img src="/Clashofleague.png" className="w-10" />
            </div>

            <div className="text-left w-1/3">{m.equipe2.name}</div>
          </div>

          <div className="mt-2 text-center text-sm text-white/70">
            {m.status === "win" && "Victoire"}
            {m.status === "loose" && "Défaite"}
            {m.status === "tie" && "Match nul"}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MatchSummaryCard
