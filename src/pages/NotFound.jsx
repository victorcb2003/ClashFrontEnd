import { useNavigate } from "react-router-dom"

function Login() {

    const navigate = useNavigate()

    return (
        <>
            <div className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-50" />
                    </div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                    <p className="text-9xl font-bold text-white">404</p>
                    <p className="text-gray-100">Vous avez trouvé une page qui n'existe pas!</p>
                    <p className="text-gray-100">Veuillez retourner sur la page précédente</p>
                </div>
            </div>
        </>
    )
}

export default Login
