import Calendar from "../components/Calendar"
import MatchSummaryCard from "../components/MatchSummaryCard"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import { getUser } from "../services/authService"
import { getEquipeById } from "../services/equipeService"

function Home() {
  const [matches, setMatches] = useState([]) 
  const [user, setUser] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userResponse = await getUser()
      setUser(userResponse.data)
      
      const matchesResponse = await getMatchesSummary({id: userResponse.data.id})
      setMatches(matchesResponse.data)

    } catch (err) {
      console.error("Erreur lors de la récupération des informations", err)
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
        <div className="w-full">
          <Calendar compact />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <MatchSummaryCard matches={matches} user={user} />
          </div>
          <div>
            <NewsCard />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Home
