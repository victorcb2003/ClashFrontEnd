import { MdClose } from 'react-icons/md'
import { FaArrowRight, FaTrophy } from 'react-icons/fa'
import TeamAvatar from './TeamAvatar'
import { useNavigate } from 'react-router-dom'

function fmtDateTime(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })
}

export default function MatchDetailModal({ match, equipes, onClose }) {
    const navigate = useNavigate()
    if (!match) return null

    const e1 = equipes.find(e => e.id === match.Equipe1_id)
    const e2 = equipes.find(e => e.id === match.Equipe2_id)
    const hasScore = match.score1 !== null && match.score1 !== undefined
        && match.score2 !== null && match.score2 !== undefined
    const w1 = hasScore && match.score1 > match.score2
    const w2 = hasScore && match.score2 > match.score1

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm text-white"
                style={{ backgroundColor: 'hsla(130, 10%, 35%, 0.45)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-semibold text-xl">Détails du match</p>
                        <p className="text-white/50 text-xs mt-0.5">Tour {match.tour} · Match #{match.id}</p>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* Équipes / Score */}
                <div className="flex flex-col gap-3 mb-6">
                    {[
                        { eq: e1, score: match.score1, winner: w1 },
                        { eq: e2, score: match.score2, winner: w2 },
                    ].map(({ eq, score, winner }, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 rounded-md p-3 border
                                ${winner
                                    ? 'bg-green-500/20 border-green-500/30'
                                    : 'bg-white/10 border-white/10'}
                            `}
                        >
                            <TeamAvatar nom={eq?.nom} size="lg" />
                            <span className={`flex-1 text-sm font-medium ${winner ? 'text-green-300' : 'text-white/80'}`}>
                                {eq ? eq.nom : <span className="text-white/30 italic">À déterminer</span>}
                            </span>
                            {hasScore
                                ? <span className={`text-2xl font-semibold tabular-nums ${winner ? 'text-green-300' : 'text-white/50'}`}>{score}</span>
                                : <span className="text-white/30 text-lg">—</span>
                            }
                            {winner && <FaTrophy className="text-yellow-400/70 text-sm flex-shrink-0" />}
                        </div>
                    ))}
                </div>

                {/* Infos */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-white/10 rounded-md p-3">
                        <p className="text-white/50 text-xs mb-1">Lieu</p>
                        <p className="text-white text-sm">{match.lieu || 'Non défini'}</p>
                    </div>
                    <div className="bg-white/10 rounded-md p-3">
                        <p className="text-white/50 text-xs mb-1">Date</p>
                        <p className="text-white text-sm">{fmtDateTime(match.date_heure)}</p>
                    </div>
                    <div className="bg-white/10 rounded-md p-3 col-span-2 flex items-center justify-between">
                        <span className="text-white/50 text-xs">Statut</span>
                        {hasScore
                            ? <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/20">Match terminé</span>
                            : <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full border border-white/10">À venir</span>
                        }
                    </div>
                </div>

                <div className="flex justify-end">
                     <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/match/${match.id}`) }}
                                            className=""
                                            title="Voir le match"
                                        >
                                            <FaArrowRight className="text-[9px]" /> Mettre a jour le match
                                        </button>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-800 bg-green-900 text-green-100 transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}