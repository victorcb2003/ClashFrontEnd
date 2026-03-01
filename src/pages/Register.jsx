import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { formSignUp } from "../services/authService";
import Sidebar from "../components/Sidebar";
import ModalLayout from "../components/ModalLayout";

function Register() {

    const navigate = useNavigate()

    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)

    // Modal
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {
            const response = await formSignUp({
                prenom: prenom,
                nom: nom,
                email: email,
                type: type
            })
            setSuccess(true)
            setIsOpen(true)
            setErrorMessage("Inscription réussite.")
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
        } catch (error) {
            setSuccess(false)
            setIsOpen(true)
            setErrorMessage("Erreur lors de l'inscription.")
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
            console.error(error)
        }
    };

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
                    <div className="w-[360px] shadow-lg px-10 py-8 rounded-xl flex flex-col justify-center backdrop-blur-md text-green-50 gap-4" style={{ backgroundColor: "hsla(130, 10%, 15%, 0.45)" }}>
                        <p className="font-semibold text-xl mb-8 text-white">Inscription</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col justify-center gap-2 w-full">
                                <label className="text-md font-medium">Prénom</label>
                                <input
                                    placeholder="Prénom..."
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)}
                                    required
                                    className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700"
                                />
                            </div>

                            <div className="flex flex-col justify-center gap-2 w-full">
                                <label className="text-md font-medium">Nom</label>
                                <input
                                    placeholder="Nom..."
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    required
                                    className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700"
                                />
                            </div>

                            <div className="flex flex-col justify-center gap-2 w-full">
                                <label className="text-md font-medium">Email</label>
                                <input
                                    placeholder="Email..."
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700"
                                />
                            </div>

                            <div className="flex flex-col justify-center gap-2 w-full mb-2">
                                <label className="text-md font-medium">Rôle</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} required className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700 bg-white">
                                    <option value="" disabled>Sélectionner un rôle...</option>
                                    <option value="Joueurs">Joueurs</option>
                                    <option value="Selectionneurs">Sélectionneurs</option>
                                    <option value="Organisateurs">Organisateurs</option>
                                </select>
                            </div>

                            <div className="flex w-full justify-end">
                                <button type="submit" className="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition-all" >S'inscrire</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ModalLayout handleModal={handleModal} isOpen={isOpen}>
                <div className="h-12 rounded-md backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 85%, 0.45)" }}>
                    <div className={`min-h-2 rounded-t-md ${success ? "bg-green-500" : "bg-red-500"}`} />
                    <p className="px-6 pt-2 pb-4 text-red-50">{errorMessage}</p>
                </div>
            </ModalLayout>
        </>
    )
}

export default Register
