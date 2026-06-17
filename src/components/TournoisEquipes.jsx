import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdPeople } from 'react-icons/io'
import { FaTrophy, FaArrowRight } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import TeamAvatar from './TeamAvatar'
import { addEquipeToTournois, removeEquipeFromTournois } from '../services/tournoisService'
import { findAllEquipe } from '../services/equipeService'

export default function TournoisEquipes({ equipes = [], matchs = [], tournoisId, isOrganisateur, tournoisLance, onRefresh }) {
    const navigate = useNavigate()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showRemoveModal, setShowRemoveModal] = useState(null) // équipe à retirer
    const [allEquipes, setAllEquipes] = useState([])
    const [selectedEquipeId, setSelectedEquipeId] = useState('')
    const [loadingEquipes, setLoadingEquipes] = useState(false)
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [loadingRemove, setLoadingRemove] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    function showMsg(type, msg) {
        if (type === 'error') { setError(msg); setSuccess(null) }
        else { setSuccess(msg); setError(null) }
        setTimeout(() => { setError(null); setSuccess(null) }, 4000)
    }

    async function openAddModal() {
        setShowAddModal(true)
        setSelectedEquipeId('')
        setLoadingEquipes(true)
        try {
            const data = await findAllEquipe()
            // findAllEquipe retourne { equipes: [...] }
            const liste = data?.equipes ?? []
            // Exclure celles déjà inscrites
            const inscritesIds = equipes.map(e => e.id)
            setAllEquipes(liste.filter(e => !inscritesIds.includes(e.id)))
        } catch (err) {
            showMsg('error', 'Impossible de charger les équipes')
        } finally {
            setLoadingEquipes(false)
        }
    }

    async function handleAdd(e) {
        e.preventDefault()
        if (!selectedEquipeId) return
        setLoadingAdd(true)
        try {
            await addEquipeToTournois({ Tournois_id: tournoisId, Equipe_id: Number(selectedEquipeId) })
            showMsg('success', "L'équipe a bien été ajoutée au tournois")
            setShowAddModal(false)
            onRefresh()
        } catch (err) {
            showMsg('error', err?.response?.data?.error || "Erreur lors de l'ajout")
        } finally {
            setLoadingAdd(false)
        }
    }

    async function handleRemove() {
        if (!showRemoveModal) return
        setLoadingRemove(true)
        try {
            await removeEquipeFromTournois({ Tournois_id: tournoisId, Equipe_id: showRemoveModal.id })
            showMsg('success', "L'équipe a bien été retirée du tournois")
            setShowRemoveModal(null)
            onRefresh()
        } catch (err) {
            showMsg('error', err?.response?.data?.error || 'Erreur lors de la suppression')
        } finally {
            setLoadingRemove(false)
        }
    }

    return (
        <div className="space-y-4">

            {/* Feedback */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-300 text-sm flex items-center justify-between">
                    {error}
                    <button onClick={() => setError(null)}><MdClose /></button>
                </div>
            )}
            {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-300 text-sm flex items-center justify-between">
                    {success}
                    <button onClick={() => setSuccess(null)}><MdClose /></button>
                </div>
            )}

            {/* Bouton ajouter */}
            {isOrganisateur && !tournoisLance && (
                <div className="flex justify-end">
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 transition-all text-sm"
                    >
                        <IoMdAdd className="text-base" />
                        Ajouter une équipe
                    </button>
                </div>
            )}

            {/* Liste équipes */}
            {equipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/40 space-y-3">
                    <IoMdPeople className="text-5xl opacity-30" />
                    <p className="text-sm">Aucune équipe inscrite</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {equipes.map(equipe => {
                        const wins = matchs.filter(m =>
                            m.score1 !== null && m.score2 !== null && (
                                (m.Equipe1_id === equipe.id && m.score1 > m.score2) ||
                                (m.Equipe2_id === equipe.id && m.score2 > m.score1)
                            )
                        ).length
                        const losses = matchs.filter(m =>
                            m.score1 !== null && m.score2 !== null && (
                                (m.Equipe1_id === equipe.id && m.score1 < m.score2) ||
                                (m.Equipe2_id === equipe.id && m.score2 < m.score1)
                            )
                        ).length
                        const played = wins + losses
                        const matchsEquipe = matchs.filter(m => m.Equipe1_id === equipe.id || m.Equipe2_id === equipe.id)
                        const tourMax = matchsEquipe.length > 0 ? Math.max(...matchsEquipe.map(m => m.tour)) : 0

                        return (
                            <div
                                key={equipe.id}
                                className="backdrop-blur-md bg-white/10 rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:bg-white/15 transition-all group"
                            >
                                <TeamAvatar nom={equipe.nom} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{equipe.nom}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {played > 0 && (
                                            <>
                                                <span className="text-[11px] text-green-300">{wins}V</span>
                                                <span className="text-white/30 text-[10px]">·</span>
                                                <span className="text-[11px] text-red-300/80">{losses}D</span>
                                                <span className="text-white/30 text-[10px]">·</span>
                                            </>
                                        )}
                                        <span className="text-[11px] text-white/40">
                                            {tourMax > 0 ? `Tour ${tourMax}` : 'Inscrite'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {wins > 0 && losses === 0 && (
                                        <FaTrophy className="text-yellow-400/70 text-sm" />
                                    )}
                                    <button
                                        onClick={() => navigate(`/equipe/${equipe.id}`)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-xs"
                                        title="Voir l'équipe"
                                    >
                                        <FaArrowRight />
                                    </button>
                                    {isOrganisateur && !tournoisLance && (
                                        <button
                                            onClick={() => setShowRemoveModal(equipe)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs"
                                            title="Retirer du tournois"
                                        >
                                            <MdClose />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── MODAL AJOUTER ── */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
                >
                    <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                        style={{ backgroundColor: 'hsla(130, 25%, 13%, 0.65)' }}>

                        <p className="font-semibold text-xl mb-8 flex justify-center">Ajouter une équipe</p>

                        <form onSubmit={handleAdd} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Équipe</label>
                                {loadingEquipes ? (
                                    <p className="text-white/40 text-sm py-2">Chargement des équipes…</p>
                                ) : allEquipes.length === 0 ? (
                                    <p className="text-white/40 text-sm py-2">Aucune équipe disponible</p>
                                ) : (
                                    <select
                                        required
                                        value={selectedEquipeId}
                                        onChange={e => setSelectedEquipeId(e.target.value)}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-green-700 hover:outline-green-600 focus:outline-green-500 focus:outline-2 text-sm"
                                        style={{ backgroundColor: 'hsl(130, 25%, 20%)' }}
                                    >
                                        <option value="" disabled>Sélectionner une équipe...</option>
                                        {allEquipes.map(e => (
                                            <option key={e.id} value={e.id}>{e.nom}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingAdd || !selectedEquipeId}
                                    className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-500 bg-green-600 text-green-50 transition-all disabled:opacity-50"
                                >
                                    {loadingAdd ? 'Ajout…' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL CONFIRMER RETRAIT ── */}
            {showRemoveModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={(e) => e.target === e.currentTarget && setShowRemoveModal(null)}
                >
                    <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                        style={{ backgroundColor: 'hsla(130, 10%, 35%, 0.45)' }}>

                        <p className="font-semibold text-xl mb-6 flex justify-center">Retirer l'équipe</p>
                        <p className="text-center mb-6 text-white/60">
                            Êtes-vous sûr de vouloir retirer <span className="text-white font-medium">{showRemoveModal.nom}</span> du tournois ?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowRemoveModal(null)}
                                className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleRemove}
                                disabled={loadingRemove}
                                className="px-3 py-1 rounded-md border border-red-500/60 hover:bg-red-600 bg-red-700/60 text-red-100 transition-all disabled:opacity-50"
                            >
                                {loadingRemove ? 'Retrait…' : 'Retirer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}