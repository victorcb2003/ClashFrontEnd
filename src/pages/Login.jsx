import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../services/authService"
import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"
import ModalLayout from "../components/ModalLayout"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    // Modal
    const [isOpen, setIsOpen] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await login({
                email: email,
                password: password,
            })
            
            navigate("/home")
        } catch (error) {
            setIsOpen(true)
            setErrorMessage("Erreur lors de la connexion.")
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
            console.error(error)
        }
    }

    const handleModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-75" />
                    </div>
                </div>

                <Sidebar />

                <div className="relative z-10 h-full flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="w-[360px] shadow-lg px-10 py-8 rounded-xl flex flex-col justify-center backdrop-blur-md text-green-50 gap-4" style={{ backgroundColor: "hsla(130, 10%, 15%, 0.45)" }} >
                        <p className="font-semibold text-xl mb-8 text-white">Connexion</p>

                        <div className="flex flex-col justify-center gap-2 w-full">
                            <label className="text-md font-medium">Email</label>
                            <input
                                type="email"
                                required
                                name="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700"
                                placeholder="Email..."
                            />
                        </div>

                        <div className="flex flex-col justify-center gap-2 w-full">
                            <label className="text-md font-medium">Mot de passe</label>
                            <input
                                type="password"
                                required
                                name="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700"
                                placeholder="Mot de passe..."
                            />
                        </div>
                        <div className="w-full flex justify-end">
                            <button type="submit" className="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition-all" >Se connecter</button>
                        </div>
                        <div className="w-full justify-center flex mt-4">
                            <Link to="/reset-password" className="absolute bottom-6 text-sm text-white/70 hover:text-white transition">Mot de passe oublié ?</Link>
                        </div>
                    </form>
                </div>
            </div>
            <ModalLayout handleModal={handleModal} isOpen={isOpen}>
                <div className="h-12 rounded-md backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 85%, 0.45)" }}>
                    <div className="bg-red-500 min-h-2 rounded-t-md" />
                    <p className="px-6 pt-2 pb-4 text-red-50">{errorMessage}</p>
                </div>
            </ModalLayout>
        </>
    )
}

export default Login
