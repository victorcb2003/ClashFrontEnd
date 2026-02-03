import { useNavigate } from "react-router-dom"
import Calendar from "../components/Calendar"
import MatchSummaryCard from "../components/MatchSummaryCard"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"

function Home() {

    const navigate = useNavigate()

    return (
        <>
            <div className="relative w-full bg-orange-50 min-h-[100vh]">
                <div className="absolute bottom-0 top-0 w-full z-0 pointer-events-none">
                    <img src="/Clashofleague2.png" alt="" className="fixed w-full h-full object-cover blur-md opacity-50 z-0" />
                </div>
                <Sidebar />
                <div className="z-10 opacity-100 relative h-full w-full pl-16">
                    <div className="flex flex-col p-4 w-full">
                        <Calendar className="p-2" />
                        <div className="flex justify-center opacity-25">
                            <span className="my-4 border-2 rounded-full border-orange-700 w-4/5" />
                        </div>
                        <div className="p-2 flex w-full gap-4">
                            <div className="flex flex-col gap-2 w-2/3">
                                <MatchSummaryCard />
                            </div>
                            <div className="flex flex-col w-1/3">
                                <NewsCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
