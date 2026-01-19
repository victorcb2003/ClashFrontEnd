import { useLocation, useNavigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";
import { getUser } from "../services/authService";

function Header() {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!["/login", "/register"].includes(location.pathname)) {
            fetchData()
        }
    }, [])

    const fetchData = async () => {
        try {
            const currentUser = await getUser();
            setUser(currentUser)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="h-16 bg-orange-100 border-b border-orange-300 flex justify-between items-center px-8 w-full z-10">
            <div> {/* Left */}
                { !["/login", "/register"].includes(location.pathname) &&
                    <RxHamburgerMenu className="text-orange-600 p-1.5 rounded-full bg-orange-50 border-orange-400 w-[36px] h-[36px] border-2 cursor-pointer transition-all hover:text-orange-100 hover:bg-orange-300 hover:border-orange-500 hover:rotate-90" />
                }
            </div>
            <div className="flex justify-center gap-4 items-center"> {/* Right */}
                <p onClick={() => navigate("/register")} className="cursor-pointer text-lg transition-all hover:text-orange-700 hover:underline px-3 py-1 rounded-lg hover:bg-orange-50">S'inscrire</p>
                <p className="text-xl text-orange-400">|</p>
                <p onClick={() => navigate("/login")} className="cursor-pointer text-lg transition-all hover:text-orange-700 hover:underline px-3 py-1 rounded-lg hover:bg-orange-50">Connexion</p>
                {user &&
                    <img src="/Clashofleague.png" alt="ciel" className="rounded-full border-orange-300 w-10 h-10 border-2 cursor-pointer transition-all hover:border-orange-500 bg-white" />
                }
            </div>
        </div>
    )
}

export default Header
