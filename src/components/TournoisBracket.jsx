import { useNavigate } from 'react-router-dom'
import { MdSportsSoccer } from 'react-icons/md'
import { FaArrowRight } from 'react-icons/fa'
import TeamAvatar from './TeamAvatar'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDateTime(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })
}

function getRoundLabel(tourNum, totalTours) {
    if (tourNum === totalTours) return 'Finale'
    if (tourNum === totalTours - 1) return 'Demi-finales'
    if (tourNum === totalTours - 2 && totalTours > 3) return 'Quarts de finale'
    return `Tour ${tourNum}`
}

// ─── Constantes layout ────────────────────────────────────────────────────────

const CARD_W = 176   // w-44
const CARD_H = 104   // hauteur réelle d'une MatchCard
const COL_GAP = 40   // espace horizontal entre colonnes (connecteur)
const LABEL_H = 28   // hauteur du label de round en haut

// ─── MatchCard ────────────────────────────────────────────────────────────────

function MatchCard({ match, equipes, onClick, isSelected }) {
    const navigate = useNavigate()
    const e1 = equipes.find(e => e.id === match.Equipe1_id)
    const e2 = equipes.find(e => e.id === match.Equipe2_id)
    const hasScore = match.score1 !== null && match.score1 !== undefined
        && match.score2 !== null && match.score2 !== undefined
    const w1 = hasScore && match.score1 > match.score2
    const w2 = hasScore && match.score2 > match.score1

    return (
        <div
            className={`
                backdrop-blur-md rounded-xl border overflow-hidden
                transition-all duration-200 group
                ${isSelected
                    ? 'border-green-400/60 shadow-lg shadow-green-500/20 bg-white/25'
                    : 'border-white/10 bg-white/15 hover:bg-white/20 hover:border-white/20'}
            `}
            style={{ width: CARD_W }}
        >
            {[
                { eq: e1, score: match.score1, winner: w1 },
                { eq: e2, score: match.score2, winner: w2 },
            ].map(({ eq, score, winner }, i) => (
                <div key={i}>
                    {i === 1 && <div className="border-t border-white/10 mx-3" />}
                    <div
                        onClick={() => onClick(match)}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${hasScore ? (winner ? 'bg-green-500/20' : 'opacity-50') : ''}`}
                    >
                        {eq
                            ? <TeamAvatar nom={eq.nom} />
                            : <div className="w-7 h-7 rounded-full border border-dashed border-white/30 flex-shrink-0" />
                        }
                        <span className={`flex-1 text-xs truncate ${winner ? 'text-green-300 font-medium' : 'text-white/80'}`}>
                            {eq ? eq.nom : <span className="text-white/30 italic">À déterminer</span>}
                        </span>
                        {hasScore && (
                            <span className={`text-sm font-semibold tabular-nums ${winner ? 'text-green-300' : 'text-white/50'}`}>
                                {score}
                            </span>
                        )}
                    </div>
                </div>
            ))}

            <div className="border-t border-white/10 px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-white/40">{fmtDateTime(match.date_heure)}</span>
                <div className="flex items-center gap-1.5">
                    {hasScore
                        ? <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full">Terminé</span>
                        : <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">À venir</span>
                    }
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/match/${match.id}`) }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                        title="Voir le match"
                    >
                        <FaArrowRight className="text-[9px]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── TournoisBracket ──────────────────────────────────────────────────────────

export default function TournoisBracket({ matchs, equipes, selectedMatch, onSelectMatch }) {
    if (!matchs.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-white/40 space-y-3">
                <MdSportsSoccer className="text-5xl opacity-30" />
                <p className="text-sm">Aucun match trouvé</p>
            </div>
        )
    }

    const tourNums = [...new Set(matchs.map(m => m.tour))].sort((a, b) => a - b)
    const totalTours = tourNums.length

    // Nombre de matchs au tour 1 = nombre max de matchs = 2^(totalTours-1)
    const nbMatchsR1 = Math.pow(2, totalTours - 1)

    // Hauteur totale de la zone de jeu (sans le label)
    // On distribue nbMatchsR1 cartes uniformément avec un gap entre elles
    const MIN_GAP = 16
    const slotH = CARD_H + MIN_GAP  // hauteur d'un slot au round 1
    const totalH = nbMatchsR1 * slotH - MIN_GAP  // hauteur totale

    // Pour chaque round, calculer les centres Y de chaque match
    // Round 1 : centres à slotH * i + CARD_H/2 pour i in [0, nbMatchsR1)
    // Round N : centres = moyenne des 2 enfants du round N-1
    const centersByRound = []
    for (let rIdx = 0; rIdx < totalTours; rIdx++) {
        if (rIdx === 0) {
            const nbMatchs = nbMatchsR1
            const centers = []
            for (let i = 0; i < nbMatchs; i++) {
                centers.push(i * slotH + CARD_H / 2)
            }
            centersByRound.push(centers)
        } else {
            const prev = centersByRound[rIdx - 1]
            const centers = []
            for (let i = 0; i < prev.length / 2; i++) {
                centers.push((prev[2 * i] + prev[2 * i + 1]) / 2)
            }
            centersByRound.push(centers)
        }
    }

    // Largeur totale du bracket
    const totalW = totalTours * CARD_W + (totalTours - 1) * COL_GAP

    return (
        <div className="overflow-x-auto pb-4">
            <div
                className="relative min-w-max"
                style={{ width: totalW, height: totalH + LABEL_H }}
            >
                {tourNums.map((tourNum, rIdx) => {
                    const roundMatchs = matchs.filter(m => m.tour === tourNum)
                    const centers = centersByRound[rIdx]
                    const colX = rIdx * (CARD_W + COL_GAP)

                    return (
                        <div key={tourNum}>
                            {/* Label du round */}
                            <div
                                className="absolute text-[11px] font-medium text-white/50 uppercase tracking-widest text-center"
                                style={{ left: colX, width: CARD_W, top: 0 }}
                            >
                                {getRoundLabel(tourNum, totalTours)}
                            </div>

                            {/* Cartes match */}
                            {roundMatchs.map((match, i) => {
                                const centerY = centers[i]
                                const top = LABEL_H + centerY - CARD_H / 2
                                return (
                                    <div
                                        key={match.id}
                                        className="absolute"
                                        style={{ left: colX, top, width: CARD_W }}
                                    >
                                        <MatchCard
                                            match={match}
                                            equipes={equipes}
                                            onClick={onSelectMatch}
                                            isSelected={selectedMatch?.id === match.id}
                                        />
                                    </div>
                                )
                            })}

                            {/* Connecteurs SVG vers le round suivant */}
                            {rIdx < totalTours - 1 && (() => {
                                const nextCenters = centersByRound[rIdx + 1]
                                const svgX = colX + CARD_W
                                const svgW = COL_GAP

                                return (
                                    <svg
                                        key={`connector-${rIdx}`}
                                        className="absolute"
                                        style={{
                                            left: svgX,
                                            top: LABEL_H,
                                            width: svgW,
                                            height: totalH,
                                            overflow: 'visible',
                                        }}
                                    >
                                        {centers.map((cy, i) => {
                                            // Chaque paire (2i, 2i+1) converge vers nextCenters[i]
                                            const parentIdx = Math.floor(i / 2)
                                            const parentCY = nextCenters[parentIdx]

                                            return (
                                                <g key={i}>
                                                    {/* Trait horizontal sortant de la carte */}
                                                    <line
                                                        x1={0} y1={cy}
                                                        x2={svgW / 2} y2={cy}
                                                        stroke="rgba(255,255,255,0.2)"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Trait vertical reliant les 2 enfants (tracé 1 seule fois pour le haut) */}
                                                    {i % 2 === 0 && (
                                                        <line
                                                            x1={svgW / 2} y1={cy}
                                                            x2={svgW / 2} y2={nextCenters[parentIdx]}
                                                            stroke="rgba(255,255,255,0.2)"
                                                            strokeWidth="1"
                                                        />
                                                    )}
                                                    {i % 2 === 1 && (
                                                        <line
                                                            x1={svgW / 2} y1={nextCenters[parentIdx]}
                                                            x2={svgW / 2} y2={cy}
                                                            stroke="rgba(255,255,255,0.2)"
                                                            strokeWidth="1"
                                                        />
                                                    )}
                                                    {/* Trait horizontal vers la carte suivante (tracé 1 seule fois par parent) */}
                                                    {i % 2 === 0 && (
                                                        <line
                                                            x1={svgW / 2} y1={parentCY}
                                                            x2={svgW} y2={parentCY}
                                                            stroke="rgba(255,255,255,0.2)"
                                                            strokeWidth="1"
                                                        />
                                                    )}
                                                </g>
                                            )
                                        })}
                                    </svg>
                                )
                            })()}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}