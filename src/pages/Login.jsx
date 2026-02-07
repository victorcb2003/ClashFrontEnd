import { useState } from "react"
import { login } from "../services/authService"
import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await login({
                email: email,
                password: password,
            })
            console.log(response)
            navigate("/home")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="/Pelouse.png"
                        alt="background"
                        className="fixed w-full h-full object-cover brightness-70"
                    />
                </div>
            </div>

            <Sidebar />

            <div className="relative z-10 h-full flex justify-center items-center">
                <form
                    onSubmit={handleSubmit}
                    className="h-[420px] w-[360px] rounded-2xl bg-white/90 backdrop-blur border border-green-500/30 p-8 flex flex-col gap-4 justify-center items-center shadow-xl"
                >
                    <p className="text-2xl text-green-600 font-bold mb-4">
                        Connexion
                    </p>

                    <div className="flex flex-col justify-center gap-2 w-full">
                        <label className="text-sm text-neutral-700">Email</label>
                        <input
                            type="email"
                            required
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none"
                            placeholder="Email..."
                        />
                    </div>

                    <div className="flex flex-col justify-center gap-2 w-full">
                        <label className="text-sm text-neutral-700">Mot de passe</label>
                        <input
                            type="password"
                            required
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none"
                            placeholder="Mot de passe..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-green-600 text-white font-semibold py-2 hover:bg-green-700 transition"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
