import { useState } from "react";
import Header from "../components/Header"
import { login } from "../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {
            const response = await login({
                email: email,
                password: password,
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative h-[100vh] w-full bg-orange-50 overflow-y-hidden">
            <div className="absolute bottom-0 top-0 w-full z-0 pointer-events-none">
                <img src="/Clashofleague2.png" alt="" className="fixed w-full h-full object-cover blur-md opacity-50 z-0" />
            </div>
            <div className="z-10 opacity-100 relative h-full">
                <Header />
                <div className="h-full flex justify-center mt-36">
                    <form onSubmit={handleSubmit} className="h-[400px] w-[350px] rounded-2xl bg-orange-50 border-2 border-orange-300 p-8 flex flex-col gap-4 justify-center items-center">
                        <p className="text-2xl text-orange-600 font-bold underline">Connexion</p>
                        <div className="flex flex-col justify-center gap-2 mt-8">
                            <p className="text-lg">Email :</p>
                            <input type="email" required name="email" id="email" onChange={(e) => setEmail(e.target.value)} className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2" placeholder="Email..." />
                        </div>
                        <div className="flex flex-col justify-center gap-2 mb-4">
                            <p className="text-lg">Mot de passe :</p>
                            <input type="password" required name="password" id="password" onChange={(e) => setPassword(e.target.value)} className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2" placeholder="Mot de passe..." />
                        </div>
                        <button type="submit" className="rounded-md border-2 bg-orange-300 cursor-pointer transition-all hover:bg-orange-400 px-4 py-1 hover:text-white border-transparent hover:border-orange-600">Se connecter</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
