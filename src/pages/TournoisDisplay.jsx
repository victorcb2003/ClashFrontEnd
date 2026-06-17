import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaEdit, FaTrophy } from 'react-icons/fa'
import { IoMdPeople } from 'react-icons/io'
import { MdSportsSoccer, MdClose } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import Sidebar from '../components/Sidebar'
import TournoisBracket from '../components/TournoisBracket'
import TournoisEquipes from '../components/TournoisEquipes'
import MatchDetailModal from '../components/MatchDetailModal'

import { findTournoisById, startTournois, updateTournois, deleteTournois } from '../services/tournoisService'
import { findByTournoisId } from '../services/matchService'
import { getUser } from '../services/authService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TournoisDisplay() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [tournois, setTournois] = useState(null)
    const [equipes, setEquipes] = useState([])
    const [matchs, setMatchs] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [tab, setTab] = useState('bracket')
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Actions
    const [starting, setStarting] = useState(false)

    // Modal edit
    const [showEditModal, setShowEditModal] = useState(false)
    const [editNom, setEditNom] = useState('')
    const [editDate, setEditDate] = useState('')
    const [editLieu, setEditLieu] = useState('')
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [editError, setEditError] = useState(null)

    // Modal delete
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [deleteError, setDeleteError] = useState(null)

    useEffect(() => {
        fetchAll()
    }, [id])

    const fetchAll = async () => {
        setLoading(true)
        setError(null)
        try {
            const [userRes, tournoisRes] = await Promise.all([
                getUser(),
                findTournoisById(id),
                findByTournoisId({ id }),
            ])

            setCurrentUser(userRes.user[0])

            const data = tournoisRes.data
            setTournois(data.Tournois[0])
            setEquipes(data.Equipes_Participantes)
            setMatchs(data.Matchs)
        } catch (err) {
            console.error(err)
            setError('Impossible de charger le tournois.')
        } finally {
            setLoading(false)
        }
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleStart = async () => {
        setStarting(true)
        try {
            await startTournois(id)
            await fetchAll()
        } catch (err) {
            console.error(err)
            alert(err?.response?.data?.error || 'Erreur lors du lancement')
        } finally {
            setStarting(false)
        }
    }

    const openEditModal = () => {
        setEditNom(tournois.nom)
        setEditDate(tournois.date_debut ? tournois.date_debut.split('T')[0] : '')
        setEditLieu(tournois.lieu)
        setEditError(null)
        setShowEditModal(true)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setEditError(null)

        // Au moins un champ modifié
        const body = { Tournois_id: Number(id) }
        if (editNom !== tournois.nom) body.nom = editNom
        if (editDate !== tournois.date_debut?.split('T')[0]) body.date = editDate
        if (editLieu !== tournois.lieu) body.lieu = editLieu

        if (Object.keys(body).length === 1) {
            setShowEditModal(false)
            return
        }

        setLoadingEdit(true)
        try {
            await updateTournois(body)
            setShowEditModal(false)
            await fetchAll()
        } catch (err) {
            setEditError(err?.response?.data?.error || 'Erreur lors de la modification')
        } finally {
            setLoadingEdit(false)
        }
    }

    const handleDelete = async () => {
        setDeleteError(null)
        setLoadingDelete(true)
        try {
            await deleteTournois(id)
            navigate('/tournois')
        } catch (err) {
            setDeleteError(err?.response?.data?.error || 'Erreur lors de la suppression')
            setLoadingDelete(false)
        }
    }

    const handleSelectMatch = (match) => {
        setSelectedMatch(prev => prev?.id === match.id ? null : match)
    }

    // ── Computed ──────────────────────────────────────────────────────────────

    const isOrganisateur = currentUser && tournois &&
        (currentUser.id === tournois.Organisateurs_id || currentUser.type === 'Admin')

    const tourNums = [...new Set(matchs.map(m => m.tour))].sort((a, b) => a - b)
    const totalTours = tourNums.length
    const finalMatch = matchs.find(m => m.tour === totalTours)
    let vainqueur = null
    if (finalMatch && finalMatch.score1 !== null && finalMatch.score2 !== null) {
        const winnerId = finalMatch.score1 == finalMatch.score2 ? null : finalMatch.score1 > finalMatch.score2 ? finalMatch.Equipe1_id : finalMatch.Equipe2_id
        vainqueur = equipes.find(e => e.id === winnerId)
    }

    const TABS = [
        { id: 'bracket', label: 'Bracket', icon: <FaTrophy className="text-xs" /> },
        { id: 'equipes', label: `Équipes (${equipes.length})`, icon: <IoMdPeople /> },
    ]

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-70" />
            </div>

            <Sidebar />

            <div className="relative z-10 min-h-screen w-full pl-16">

                {/* ── LOADING ── */}
                {loading && (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/10 px-8 py-6 text-white/70 text-sm">
                            Chargement du tournois…
                        </div>
                    </div>
                )}

                {/* ── ERREUR ── */}
                {!loading && error && (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="backdrop-blur-md bg-red-500/10 rounded-xl border border-red-500/20 px-8 py-6 text-white text-sm text-center">
                            <p className="font-medium text-red-300 mb-2">Erreur</p>
                            <p className="text-white/60">{error}</p>
                        </div>
                    </div>
                )}

                {/* ── CONTENU ── */}
                {!loading && !error && tournois && (
                    <div className="p-6 space-y-6 max-w-full">

                        {/* ── HEADER ── */}
                        <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">Tournois</span>
                                        {tournois.lancer
                                            ? <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/20 px-2 py-0.5 rounded-full">En cours</span>
                                            : <span className="text-[10px] bg-white/10 text-white/60 border border-white/10 px-2 py-0.5 rounded-full">En préparation</span>
                                        }
                                    </div>

                                    <h1 className="text-3xl font-bold text-white">{tournois.nom}</h1>

                                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-white/60 text-sm">
                                        <div className="flex items-center gap-2 mt-2">
                                            <span>{tournois.lieu || 'Lieu non défini'}</span>
                                            {isOrganisateur && (
                                                <button
                                                    onClick={openEditModal}
                                                    className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20"
                                                >
                                                    <FaEdit className="text-xs" />
                                                </button>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {fmtDate(tournois.date_debut)} → {fmtDate(tournois.date_fin)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <IoMdPeople className="w-4 h-4" />
                                            {equipes.length} équipe{equipes.length > 1 ? 's' : ''}
                                        </span>
                                        {totalTours > 0 && (
                                            <span className="flex items-center gap-1.5">
                                                <FaTrophy className="w-3 h-3" />
                                                {totalTours} tour{totalTours > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions organisateur */}
                                {isOrganisateur && (
                                    <div className="flex gap-2 flex-shrink-0 items-start">
                                        {!tournois.lancer && (
                                            <button
                                                onClick={handleStart}
                                                disabled={starting}
                                                className="flex items-center gap-2 px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 text-sm transition-all disabled:opacity-50"
                                            >
                                                <MdSportsSoccer />
                                                {starting ? 'Lancement…' : 'Lancer'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setDeleteError(null); setShowDeleteModal(true) }}
                                            className="flex items-center gap-2 px-3 py-1 rounded-md border border-red-500/60 hover:bg-red-600/40 bg-red-700/20 text-red-300 text-sm transition-all"
                                        >
                                            <FaTrashAlt className="text-xs" />
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Vainqueur */}
                            {vainqueur && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                                    <FaTrophy className="text-yellow-400 text-lg" />
                                    <div>
                                        <p className="text-white/50 text-xs">Vainqueur du tournois</p>
                                        <p className="text-white font-semibold">{vainqueur.nom}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── TABS ── */}
                        <div className="flex gap-1 backdrop-blur-md bg-white/10 rounded-xl border border-white/10 p-1 w-fit">
                            {TABS.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                                        ${tab === t.id ? 'bg-white/20 text-white font-medium' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* ── BRACKET ── */}
                        {tab === 'bracket' && (
                            <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/10 p-6 shadow-lg">
                                {!tournois.lancer ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-white/40 space-y-3">
                                        <MdSportsSoccer className="text-5xl opacity-30" />
                                        <p className="text-sm">Le tournois n'a pas encore été lancé</p>
                                        {isOrganisateur && (
                                            <button
                                                onClick={handleStart}
                                                disabled={starting}
                                                className="mt-2 px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 text-sm transition-all disabled:opacity-50"
                                            >
                                                {starting ? 'Lancement…' : 'Lancer le tournois'}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <TournoisBracket
                                        matchs={matchs}
                                        equipes={equipes}
                                        selectedMatch={selectedMatch}
                                        onSelectMatch={handleSelectMatch}
                                    />
                                )}
                            </div>
                        )}

                        {/* ── ÉQUIPES ── */}
                        {tab === 'equipes' && (
                            <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/10 p-6 shadow-lg">
                                <TournoisEquipes
                                    equipes={equipes}
                                    matchs={matchs}
                                    tournoisId={Number(id)}
                                    isOrganisateur={isOrganisateur}
                                    tournoisLance={!!tournois.lancer}
                                    onRefresh={fetchAll}
                                />
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* ── MODAL MATCH ── */}
            {selectedMatch && (
                <MatchDetailModal
                    match={selectedMatch}
                    equipes={equipes}
                    onClose={() => setSelectedMatch(null)}
                />
            )}

            {/* ── MODAL EDIT ── */}
            {showEditModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}
                >
                    <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                        style={{ backgroundColor: 'hsla(130, 25%, 13%, 0.65)' }}>

                        <p className="font-semibold text-xl mb-8 flex justify-center">Modifier le tournois</p>

                        <form onSubmit={handleEdit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Nom du tournois</label>
                                <input
                                    type="text"
                                    value={editNom}
                                    onChange={e => setEditNom(e.target.value)}
                                    placeholder="Nom du tournois..."
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: 'hsl(130, 25%, 20%)' }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Date de début</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={e => setEditDate(e.target.value)}
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: 'hsl(130, 25%, 20%)' }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Lieu</label>
                                <input
                                    type="text"
                                    value={editLieu}
                                    onChange={e => setEditLieu(e.target.value)}
                                    placeholder="Lieu du tournois..."
                                    className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 hover:outline-2"
                                    style={{ backgroundColor: 'hsl(130, 25%, 20%)' }}
                                />
                            </div>

                            {editError && (
                                <p className="text-red-400 text-sm text-center">{editError}</p>
                            )}

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingEdit}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-500 bg-green-600 text-green-50 transition-all disabled:opacity-50"
                                >
                                    {loadingEdit ? 'Modification…' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL DELETE ── */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
                >
                    <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                        style={{ backgroundColor: 'hsla(130, 10%, 35%, 0.45)' }}>

                        <p className="font-semibold text-xl mb-6 flex justify-center">Supprimer le tournois</p>
                        <p className="text-center mb-6 text-white/60">
                            Êtes-vous sûr de vouloir supprimer <span className="text-white font-medium">{tournois?.nom}</span> ? Cette action est irréversible.
                        </p>

                        {deleteError && (
                            <p className="text-red-400 text-sm text-center mb-4">{deleteError}</p>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loadingDelete}
                                className="px-3 py-1 rounded-md border border-red-500/60 hover:bg-red-600 bg-red-700/60 text-red-100 transition-all disabled:opacity-50"
                            >
                                {loadingDelete ? 'Suppression…' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}