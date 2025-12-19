import { useNavigate } from "react-router-dom"

function Login() {

    const navigate = useNavigate()

    return (
        <>
            <p className='text-red-800 text-5xl'> Page de login !</p>
            <button onClick={() => navigate("/")}>incroyable</button>
        </>
    )
}

export default Login
