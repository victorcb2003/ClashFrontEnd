import { useNavigate, useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import { resetPassword } from "../services/authService"
import ModalLayout from "../components/ModalLayout"

function ResetPassword() {

    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate()

    // Modal
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await resetPassword({ email: email })
            console.log(response)
            navigate("/login")
        } catch (err) {
            console.log(err)
            setIsOpen(true)
            setErrorMessage("Erreur lors de l'envoie, réessayez plus tard.")
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
            throw err
        }
    }

    const handleModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className="relative w-full min-h-screen">
                <Sidebar />
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-75" />
                </div>
                <div className="relative min-h-screen z-10 space-y-6 flex justify-center items-center">
                    <div className="w-[350px] min-w-[320px] shadow-lg px-10 py-8 rounded-xl flex flex-col justify-center backdrop-blur-md text-green-50" style={{ backgroundColor: "hsla(130, 10%, 15%, 0.45)" }} >
                        <p className="font-semibold text-xl mb-12 text-white">Saisissez votre email</p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Email</label>
                                <input type="email" required placeholder="Saisissez votre email ..." value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-sm outline outline-1 outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2 text-black placeholder-gray-600 bg-gray-100" />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button type="submit" className="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition-all">Confirmer</button>
                            </div>
                        </form>
                    </div>
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

export default ResetPassword