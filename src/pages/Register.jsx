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
        <div className="relative h-[100vh] w-full bg-orange-50 overflow-y-hidden">
            <div className="absolute bottom-0 top-0 w-full z-0 pointer-events-none">
                <img src="/Clashofleague2.png" alt="" className="fixed w-full h-full object-cover blur-md opacity-50 z-0" />
            </div>
            <div className="z-10 opacity-100 relative h-full">
                <Sidebar />
                <div className="h-full flex justify-center mt-16">
                    <div className="h-[550px] w-[350px] rounded-2xl bg-orange-50 border-2 border-orange-300 p-8 flex flex-col gap-8 justify-center items-center">
                        <p className="text-2xl text-orange-600 font-bold underline">Inscription</p>
                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 max-w-md">
                            <div>
                                <label htmlFor="prenom" className="block mb-2 text-lg">Prénom :</label>
                                <input placeholder="Prénom..." type="text" id="prenom" name="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2" />
                            </div>
                            <div>
                                <label htmlFor="nom" className="block mb-2 text-lg">Nom :</label>
                                <input placeholder="Nom..." type="text" id="nom" name="nom" value={nom} onChange={(e) => setNom(e.target.value)} required className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-lg">Email :</label>
                                <input placeholder="Email..." type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block mb-2 text-lg">Rôle  :</label>
                                <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} required className="rounded-md px-1.5 py-0.5 text-md border-orange-300 focus:border-orange-400 border-2 w-full bg-white mb-4" >
                                    <option value="" disabled>Sélectionner un rôle...</option>
                                    <option value="Joueurs">Joueurs</option>
                                    <option value="Selectionneurs">Sélectionneurs</option>
                                    <option value="Organisateurs">Organisateurs</option>
                                </select>
                            </div>
                            <div className="flex justify-center w-full">
                                <button type="submit" className="w-28 rounded-md border-2 bg-orange-300 cursor-pointer transition-all hover:bg-orange-400 px-4 py-1 hover:text-white border-transparent hover:border-orange-600"> S'inscrire </button>
                            </div>
                            {message && <p className={`mt-2 text-sm font-bold border-2 px-2 py-1 rounded-md transition-all ${messageVisible ? `${messageSuccess ? "text-green-800 bg-green-100 border-green-500" : "text-red-800 bg-red-950 border-red-500"}` : "text-transparent border-transparent"}`}>{message}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
