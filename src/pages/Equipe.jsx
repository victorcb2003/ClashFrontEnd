import { useEffect, useState } from "react"
import { findAllEquipe } from "../services/equipeService"
import { useNavigate } from "react-router-dom"

export default function Equipe() {
    const [equipes, setEquipes] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            setEquipes((await findAllEquipe()).equipes)
        })()
    }, [])
    
    return (
        <div>
            <h1>Equipe</h1>
            <div>
                {equipes != [] && (
                    <>
                        {equipes.map(equipe =>
                            <div key={equipe.id} onClick={()=>{navigate(`/equipe/${equipe.id}`)}}>
                                <p>
                                    {equipe.nom}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
