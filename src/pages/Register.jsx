import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { formSignUp } from "../services/authService";
import Sidebar from "../components/Sidebar";

function Register() {

    const navigate = useNavigate()

    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [messageSuccess, setMessageSuccess] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {
            const response = await formSignUp({
                prenom: prenom,
                nom: nom,
                email: email,
                type: type
            })

            console.log(response);

            showMessage("Demande d'inscription réussite", true)
        } catch (error) {
            console.error(error)
            showMessage("Erreur lors de l'inscription ", false)
        }
    };

    const showMessage = (msg, success) => {
        setMessage(msg)
        setMessageVisible(true)
        setMessageSuccess(success)
        setTimeout(() => {
            setMessageVisible(false)
        }, 3000);
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
                <div className="h-[560px] w-[380px] rounded-2xl bg-white/90 backdrop-blur border border-green-500/30 p-8 flex flex-col gap-6 shadow-xl">
                    <p className="text-2xl text-green-600 font-bold text-center">
                        Inscription
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-1 text-sm text-neutral-700">
                                Prénom
                            </label>
                            <input
                                placeholder="Prénom..."
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                                className="w-full rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm text-neutral-700">
                                Nom
                            </label>
                            <input
                                placeholder="Nom..."
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                className="w-full rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm text-neutral-700">
                                Email
                            </label>
                            <input
                                placeholder="Email..."
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm text-neutral-700">
                                Rôle
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="w-full rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none bg-white"
                            >
                                <option value="" disabled>
                                    Sélectionner un rôle...
                                </option>
                                <option value="Joueurs">Joueurs</option>
                                <option value="Selectionneurs">Sélectionneurs</option>
                                <option value="Organisateurs">Organisateurs</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 w-full rounded-md bg-green-600 text-white font-semibold py-2 hover:bg-green-700 transition"
                        >
                            S'inscrire
                        </button>

                        {message && (
                            <p
                                className={`mt-2 text-sm font-bold px-3 py-2 rounded-md transition-all
                ${messageVisible
                                        ? messageSuccess
                                            ? "text-green-800 bg-green-100 border border-green-500"
                                            : "text-red-800 bg-red-100 border border-red-500"
                                        : "opacity-0"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
