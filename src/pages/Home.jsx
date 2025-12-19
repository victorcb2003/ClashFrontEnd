import { useNavigate } from "react-router-dom"

function Home() {

    const navigate = useNavigate()

    return (
        <>
            <p className='text-red-800'> Salut !</p>
            <button onClick={() => navigate("/login")}>incroyable</button>
        </>
    )
}

export default Home
