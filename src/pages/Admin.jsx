import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"
import { getUser, getVerif, putVerif } from "../services/authService"

export default function Admin() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState(null)
	const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const userData = await getUser()
				const currentUser = userData?.user?.[0]
				setUser(currentUser)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		})()
	}, [])

    useEffect(() => {
        (async()=>{
            try {
                const verifData = (await getVerif()).results
				console.log(verifData)
                setUsers(verifData)
            } catch (err) {
                setError("Impossible de charger la liste des utilisateurs")
                console.error(err)
            }
            })()
    },[refresh])

	useEffect(() => {
		if (!loading && !user.type == "Admin") {
			navigate("/home")
		}
		if (!loading && user.type == "Admin") {
			setRefresh(!refresh)
		}
	}, [loading , navigate])

	const handleToggleVerif = async (targetUser) => {
		const currentValue = Boolean(targetUser?.verif || targetUser?.isVerified || targetUser?.verified)
		try {
			await putVerif({ id: targetUser.id, value: !currentValue })
			setRefresh(!refresh)
		} catch (err) {
			console.error(err)
			setError("Impossible de mettre à jour la vérification")
		}
	}

	if (loading) {
		return (
			<div className="relative w-full min-h-screen flex items-center justify-center">
				<div className="text-white text-xl">Chargement...</div>
			</div>
		)
	}

	if (!user?.type == "Admin") {
		return null
	}

	return (
		<div className="relative w-full min-h-screen">
			<Sidebar />

			<div className="absolute inset-0 z-0 pointer-events-none">
				<img
					src="/Pelouse.png"
					alt="background"
					className="fixed w-full h-full object-cover brightness-70"
				/>
			</div>

			<div className="relative z-10 ml-16 p-6 space-y-6">
				<div className="w-full max-w-6xl mx-auto space-y-6">
					<div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
						<h1 className="text-3xl font-bold text-white">Administration</h1>
						<p className="text-white/70">Vérifications des utilisateurs</p>
					</div>

					<div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-white">Utilisateurs</h2>
						</div>

						{error && (
							<div className="mb-4 rounded-md bg-red-500/20 px-4 py-2 text-red-100">
								{error}
							</div>
						)}

						<div className="space-y-3">
							{users.length === 0 && (
								<div className="text-white/70">Aucun utilisateur à afficher.
                                    {console.log(users)}
                                </div>
							)}

							{users.map((u) => {
								const isVerified = Boolean(u?.verif || u?.isVerified || u?.verified)
								return (
									<div
										key={u.id}
										className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition"
									>
										<div className="flex items-center gap-4">
											<Avatar user={u} size="sm" className="shadow" />
											<div>
												<div className="text-white font-semibold">
													{u?.prenom} {u?.nom}
												</div>
												<div className="text-white/60 text-sm">{u?.email}</div>
												<div className="text-white/60 text-xs">{u?.Utype}</div>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<span
												className={`text-xs font-semibold px-3 py-1 rounded-full ${
													isVerified ? "bg-green-500/20 text-green-100" : "bg-yellow-500/20 text-yellow-100"
												}`}
											>
												{isVerified ? "Vérifié" : "Non vérifié"}
											</span>
											<button
												onClick={() => handleToggleVerif(u)}
												className={`px-4 py-2 rounded-md text-white bg-lime-950 opacity-70`}
											>
												Vérifier
											</button>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
