import { useNavigate } from "react-router-dom";

function TournamentSummaryCard({ tournament }) {

   const navigate = useNavigate();

   return (
      <div className="relative rounded-t-2xl" onClick={() => navigate(`/tournois/${tournament.id}`)}>
         <div 
            className={`absolute border-4 px-4 py-2 rounded-2xl w-full min-w-[380px] xl:min-w-[650px] inset-0 opacity-65 -z-10`}
            style={{ backgroundColor: `hsla(${(tournament.id * 32) % 255}, 20%, 90%, 0.75)`, borderColor: `hsl(${(tournament.id * 32) % 255}, 50%, 40%, 0.9)` }}
         />
         <div className={`px-4 py-2 z-10 rounded-t-2xl w-full min-w-[380px] xl:min-w-[650px] flex flex-col items-center`}>
            <p className="font-semibold text-xl" style={{ color: `hsl(${(tournament.id * 32) % 255}, 80%, 18%)` }} >{tournament.nom}</p>
            <p className="text-sm text-gray-600">Débute le: {new Date(tournament.date).toLocaleDateString('fr-FR')} au {tournament.lieu}</p>
            <div className="flex mt-2 justify-center items-center">
               
            </div>
         </div>
      </div>
   )
}

export default TournamentSummaryCard