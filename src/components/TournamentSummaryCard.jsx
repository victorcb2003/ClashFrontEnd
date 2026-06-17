import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchSummaryCard from "./MatchSummaryCard";

function TournamentSummaryCard({ tournament, matches = [], type = "basic" }) {

   const navigate = useNavigate();

   const [isHover, setIsHover] = useState(false)
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