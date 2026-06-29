import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchSummaryCard from "./MatchSummaryCard";
import { getModesPaiement, payerInscription } from "../services/paiementService";

function TournamentSummaryCard({ tournament, matches = [], type = "basic" }) {

   const navigate = useNavigate();

   const [isHover, setIsHover] = useState(false)

   // Ici je gère l'inscription et le paiement fictif (prix en dur, panneau déroulant, confirmation)
   const PRIX = 25
   const [open, setOpen] = useState(false)
   const [modes, setModes] = useState([])
   const [modeChoisi, setModeChoisi] = useState(null)
   const [enCours, setEnCours] = useState(false)
   const [accepte, setAccepte] = useState(false)

   useEffect(() => {
      if (open && modes.length === 0) {
         getModesPaiement().then(setModes).catch(console.error)
      }
   }, [open])

   const handleInscription = (e) => {
      e.stopPropagation()
      setOpen(prev => !prev)
   }

   const handlePayer = (e) => {
      e.stopPropagation()
      if (!modeChoisi) return
      setEnCours(true)
      payerInscription({ Tournois_id: tournament.id, ModePaiement_id: modeChoisi, montant: PRIX })
         .then(() => {
            setTimeout(() => {
               setEnCours(false)
               setAccepte(true)
            }, 2000)
         })
         .catch(() => setEnCours(false))
   }

   const { current, future, old } = useMemo(() => {
      return sortMatches(matches, type);
   }, [matches, type]);

   const currentMatch = current || {};
   const futurMatch = future || [];
   const finishedMatch = old || [];

   function sortMatches(matches, type = "basic") {
      const now = new Date()
      const MATCH_DURATION = 2 * 90 * 60 * 1000

      const parsed = matches.map(m => ({
         ...m,
         parsedDate: new Date(m.date_heure)
      }))

      if (type === "finished") {
         const sortedOld = parsed
            .sort((a, b) => b.parsedDate - a.parsedDate)

         return {
            current: sortedOld[0] || {},
            future: [],
            old: sortedOld.slice(0, 3)
         };
      }

      const current = parsed.find(m => {
         const start = m.parsedDate.getTime();
         const end = start + MATCH_DURATION;
         return now.getTime() >= start && now.getTime() <= end
      });

      const future = parsed
         .filter(m => m.parsedDate > now)
         .sort((a, b) => a.parsedDate - b.parsedDate)
         .slice(0, 3);

      const old = parsed
         .filter(m => m.parsedDate < now)
         .sort((a, b) => b.parsedDate - a.parsedDate)
         .slice(0, 3);

      return { current, future, old };
   };


   return (
      <div className="relative text-gray-200 rounded-t-2xl" onClick={() => navigate(`/tournois/${tournament.id}`)} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
         <div
            className={`absolute border-2 px-4 py-2 rounded-lg w-full min-w-[380px] xl:min-w-[650px] inset-0 -z-10 backdrop-blur-md transition-all`}
            style={{ backgroundColor: isHover ? `hsla(${(tournament.id * 32) % 255}, 15%, 20%, 0.65)` : `hsla(${(tournament.id * 32) % 255}, 15%, 15%, 0.65)`, borderColor: `hsl(${(tournament.id * 32) % 255}, 50%, 40%, 0.9)` }}
         />
         <div className={`px-4 py-2 z-10 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px] flex flex-col items-center cursor-pointer`}>
            <p className="font-semibold text-2xl" style={{ color: `hsl(${(tournament.id * 32) % 255}, 80%, 90%)` }} >{tournament.nom}</p>
            <p className="text-sm text-gray-300">Débute le: {new Date(tournament.date).toLocaleDateString('fr-FR')} au {tournament.lieu}</p>

            {/* Ici j'affiche le prix, le bouton s'inscrire et le panneau de paiement déroulant */}
            <div className="flex flex-col items-center gap-2 mt-3 w-full">
               <p className="text-green-100 font-semibold">Inscription : {PRIX} €</p>
               <button
                  onClick={handleInscription}
                  className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-700 bg-green-800 text-green-100 transition-all text-sm"
               >
                  S'inscrire
               </button>

               {open && (
                  <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md mt-2 rounded-xl border border-white/10 backdrop-blur-md bg-white/10 px-4 py-3 flex flex-col gap-3">
                     {accepte ? (
                        <p className="text-center text-green-300 font-semibold py-2">Paiement accepté ✓</p>
                     ) : (
                        <>
                           <p className="text-sm text-white/70">Choisissez votre moyen de paiement :</p>
                           <div className="flex gap-2 justify-center">
                              {modes.map(m => (
                                 <button
                                    key={m.id}
                                    onClick={() => setModeChoisi(m.id)}
                                    className={`px-3 py-1 rounded-md border text-sm transition-all ${modeChoisi === m.id ? "bg-green-600 border-green-400 text-white" : "border-green-700 bg-green-900 text-green-100 hover:bg-green-800"}`}
                                 >
                                    {m.libelle}
                                 </button>
                              ))}
                           </div>
                           <div className="flex justify-center">
                              <button
                                 onClick={handlePayer}
                                 disabled={!modeChoisi || enCours}
                                 className="px-3 py-1 rounded-md border border-green-600 hover:bg-green-500 bg-green-600 text-green-50 transition-all text-sm disabled:opacity-50"
                              >
                                 {enCours ? "Paiement en cours…" : "Payer"}
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               )}
            </div>

            {matches.length != 0 ?
               <div className="flex w-full mt-6 justify-center items-center gap-4 px-6">
                  <div className="flex flex-col gap-2 w-1/2">

                  </div>
               </div>
               :
               <div className="flex justify-center items-center h-16">
                  <p className="font-bold text-lg">Le tournois n'a pas encore commencé ou toutes les équipes ne sont pas encore inscrites.</p>
               </div>
            }
         </div>
      </div>
   )
}

export default TournamentSummaryCard