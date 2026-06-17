import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import TournamentSummaryCard from "../components/TournamentSummaryCard"
import { getTournaments, createTournois } from "../services/tournoisService"
import { findByTournoisId } from "../services/matchService"
import { getUser } from "../services/authService"
import { MdClose } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

export default function Tournois() {
    const navigate = useNavigate()

    const [currentUser, setCurrentUser] = useState(null)
    const [myTournaments, setMyTournaments] = useState([])
    const [currentTournaments, setCurrentTournaments] = useState([])
    const [futurTournaments, setFuturTournaments] = useState([])
    const [matches, setMatches] = useState({})

    const [visibleMy, setVisibleMy] = useState(3)
    const [visibleCurrent, setVisibleCurrent] = useState(3)
    const [visibleFuture, setVisibleFuture] = useState(3)

    const [loading, setLoading] = useState(true)

    // Modal création
    const [modalOpen, setModalOpen] = useState(false)
    const [modalNom, setModalNom] = useState("")
    const [modalDate, setModalDate] = useState("")
    const [modalLieu, setModalLieu] = useState("")
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [createError, setCreateError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    // ─── Fetch ────────────────────────────────────────────────────────────────

    const fetchData = async () => {
        setLoading(true)
        try {
            const [userRes, tournoiRes] = await Promise.all([
                getUser(),
                getTournaments(),
            ])
            const user = userRes.user[0]
            setCurrentUser(user)
            const { my, current, future } = filterTournaments(tournoiRes, user)
            // Charger les matchs des 5 premiers de chaque catégorie
            await fetchMatchesForTournaments([
                ...my.slice(0, 3),
                ...current.slice(0, 3),
                ...future.slice(0, 3),
            ])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchMatchesForTournaments = async (list) => {
        if (!list.length) return
        try {
            const results = await Promise.all(
                list.map(async (t) => {
                    const res = await findByTournoisId({ id: t.id })
                    return { id: t.id, matchs: res?.data?.matchs ?? [] }
                })
            )
            const map = {}
            results.forEach(({ id, matchs }) => { map[id] = matchs })
            setMatches(prev => ({ ...prev, ...map }))
        } catch (err) {
            console.error("Erreur lors du chargement des matchs", err)
        }
    }

    const filterTournaments = (list, user) => {
        const now = new Date()
        const my = [], current = [], future = []

        list.forEach(t => {
            if (t.Organisateurs?.id === user.id) {
                my.push(t)
                return
            }
            if (new Date(t.date) <= now) current.push(t)
            else future.push(t)
        })

        setMyTournaments(my)
        setCurrentTournaments(current)
        setFuturTournaments(future)
        return { my, current, future }
    }

    // ─── Voir plus ────────────────────────────────────────────────────────────

    const handleSeeMore = (type) => {
        if (type === "My") {
            const next = visibleMy + 3
            fetchMatchesForTournaments(myTournaments.slice(visibleMy, next))
            setVisibleMy(next)
        } else if (type === "Current") {
            const next = visibleCurrent + 3
            fetchMatchesForTournaments(currentTournaments.slice(visibleCurrent, next))
            setVisibleCurrent(next)
        } else if (type === "Future") {
            const next = visibleFuture + 3
            fetchMatchesForTournaments(futurTournaments.slice(visibleFuture, next))
            setVisibleFuture(next)
        }
    }

    // ─── Création ─────────────────────────────────────────────────────────────

    const openModal = () => {
        setModalNom("")
        setModalDate("")
        setModalLieu("")
        setCreateError(null)
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCreateError(null)
        setLoadingCreate(true)
        try {
            await createTournois({ nom: modalNom, date: modalDate, lieu: modalLieu })
            setModalOpen(false)
            await fetchData()
        } catch (err) {
            setCreateError(err?.response?.data?.error || "Erreur lors de la création")
        } finally {
            setLoadingCreate(false)
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    const Section = ({ title, list, visible, type }) => (
        <div className="flex flex-col gap-4 px-12 py-4">
            <p className="font-bold text-2xl text-green-100">{title}</p>
            {list.slice(0, visible).map(t => (
                <div
                    key={t.id}
                    onClick={() => navigate(`/tournois/${t.id}`)}
                    className="cursor-pointer"
                >
                    <TournamentSummaryCard tournament={t} matches={matches[t.id]} />
                </div>
            ))}
            {visible < list.length && (
                <div className="flex justify-center mt-2">
                    <button
                        onClick={() => handleSeeMore(type)}
                        className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 transition-all text-sm"
                    >
                        Voir plus
                    </button>
                </div>
            )}
        </div>
    )

    return (
        <>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-75" />
                </div>

                <Sidebar />

                <div className="relative z-10 min-h-screen w-full pl-16 py-6">

                    {loading ? (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/10 px-8 py-6 text-white/70 text-sm">
                                Chargement des tournois…
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ── MES TOURNOIS ── */}
                            {(myTournaments.length > 0 || currentUser?.type === "Organisateurs") && (
                                <>
                                    <Section
                                        title="Mes tournois"
                                        list={myTournaments}
                                        visible={visibleMy}
                                        type="My"
                                    />
                                    {currentUser?.type === "Organisateurs" && (
                                        <div className="flex justify-center px-12 mt-2 mb-4">
                                            <button
                                                onClick={openModal}
                                                className="flex items-center gap-2 px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 transition-all text-sm"
                                            >
                                                <IoMdAdd className="text-base" />
                                                Créer un tournois
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── SÉPARATEURS ── */}
                            {myTournaments.length > 0 && currentTournaments.length > 0 && (
                                <span className="block my-8 border-b border-green-500/40 w-4/5 mx-auto" />
                            )}

                            {/* ── EN COURS ── */}
                            {currentTournaments.length > 0 && (
                                <Section
                                    title="Tournois en cours"
                                    list={currentTournaments}
                                    visible={visibleCurrent}
                                    type="Current"
                                />
                            )}

                            {futurTournaments.length > 0 && currentTournaments.length > 0 && (
                                <span className="block my-8 border-b border-green-500/40 w-4/5 mx-auto" />
                            )}

                            {/* ── À VENIR ── */}
                            {futurTournaments.length > 0 && (
                                <Section
                                    title="Tournois à venir"
                                    list={futurTournaments}
                                    visible={visibleFuture}
                                    type="Future"
                                />
                            )}

                            {/* ── VIDE ── */}
                            {myTournaments.length === 0 && currentTournaments.length === 0 && futurTournaments.length === 0 && (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/40 space-y-3">
                                    <p className="text-lg">Aucun tournois disponible</p>
                                    {currentUser?.type === "Organisateurs" && (
                                        <button
                                            onClick={openModal}
                                            className="flex items-center gap-2 px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 transition-all text-sm"
                                        >
                                            <IoMdAdd />
                                            Créer le premier tournois
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── MODAL CRÉATION ── */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
                >
                    <div
                        className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                        style={{ backgroundColor: "hsla(130, 25%, 13%, 0.65)" }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <p className="font-semibold text-xl">Créer un tournois</p>
                            <button onClick={() => setModalOpen(false)} className="text-white/50 hover:text-white p-1">
                                <MdClose className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Nom du tournois</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nom du tournois..."
                                    value={modalNom}
                                    onChange={e => setModalNom(e.target.value)}
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: "hsl(130, 25%, 20%)" }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Date de début</label>
                                <input
                                    type="date"
                                    required
                                    value={modalDate}
                                    onChange={e => setModalDate(e.target.value)}
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: "hsl(130, 25%, 20%)" }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Lieu</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Lieu du tournois..."
                                    value={modalLieu}
                                    onChange={e => setModalLieu(e.target.value)}
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: "hsl(130, 25%, 20%)" }}
                                />
                            </div>

                            {createError && (
                                <p className="text-red-400 text-sm text-center">{createError}</p>
                            )}

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingCreate}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-500 bg-green-600 text-green-50 transition-all disabled:opacity-50"
                                >
                                    {loadingCreate ? "Création…" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}