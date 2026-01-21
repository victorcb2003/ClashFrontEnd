import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar.jsx"

function Home() {
    const navigate = useNavigate()

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 items-center justify-center flex flex-col h-screen">
                <span className="background" />
                <p className='text-red-800'>Cieleuhhhhhhhhh</p>
                <button onClick={() => navigate("/login")}>Magicienneuhhhhhhhhhhh</button>
                <br />
                <button onClick={() => navigate("/register")}>Parisienneuhhhhhhhhhh</button>
            </div>
        </div>
    )
}

export default Home