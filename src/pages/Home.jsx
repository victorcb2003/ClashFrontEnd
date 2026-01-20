import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

function Home() {

    const navigate = useNavigate()

    return (
        <>
            <span className="background" />
            <Header />
            <p className='text-red-800'> Salut !</p>
            <button onClick={() => navigate("/login")}>incroyable</button>
            <button onClick={() => navigate("/register")}>incroyable2</button>
        </>
    )
}

export default Home
