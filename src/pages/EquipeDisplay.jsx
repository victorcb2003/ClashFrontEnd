import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { addjoueurEquipe, findAllJoueur, infoEquipe, removejoueurEquipe, renameEquipe } from "../services/equipeService"
import { getUser } from "../services/authService"
import { FaEdit } from "react-icons/fa"
import { MdClose } from "react-icons/md";
import ModalLayout from "../components/ModalLayout";

export default function EquipeDisplay() {

  const [equipe, setEquipe] = useState(null)
  const [user, setUser] = useState(null)
  const [joueurs, setJoueurs] = useState([])
  const [openModalRemove, setOpenModalRemove] = useState(false)
  const [removeJoueur, setRemoveJoueur] = useState(null)
  const [addJoueurId, setAddJoueurId] = useState(null)
  const [openModalAdd, setOpenModalAdd] = useState(null)
  const [openModalRename,setOpenModalRename] = useState(false)
  const [nouveauNom,setNouveauNom] = useState("")
  const [refresh, setRefresh] = useState(false)

  const { id: equipe_id } = useParams()
  const navigate = useNavigate()

  async function handleRemoveJoueur() {
    await removejoueurEquipe({ Equipe_id: equipe_id, Joueur_id: removeJoueur.id })

    setRemoveJoueur(null)
    setOpenModalRemove(false)
    setRefresh(!refresh)
  }

  async function handleAddJoueur() {
    await addjoueurEquipe({ Equipe_id: equipe_id, Joueur_id: addJoueurId })

    setAddJoueurId(null)
    setOpenModalAdd(false)
    setRefresh(!refresh)
  }

  async function handleRename() {
    await renameEquipe({Equipe_id : equipe_id , nom:nouveauNom})

    setNouveauNom("")
    setOpenModalRename(false)
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      setUser(await getUser())
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const joueurNonTrié = (await findAllJoueur()).Joueurs
      setJoueurs(joueurNonTrié.filter(j => j.Equipe_id == null))
    })()
  }, [refresh])

  useEffect(() => {
    (async () => {
      setEquipe(await infoEquipe({ Equipe_id: equipe_id }))
    })()
  }, [refresh])


  return (
    <div>
      {equipe != null ? (
        <>
        <div>
          <p onClick={()=>{navigate("/equipe")}}>Retour sur la page Equipe</p>
        </div>
          <div className="flex ">
            <h1>{equipe.nom}</h1>
            {user.user[0].type == "Selectionneurs" && equipe.Sellectionneurs_id == user.id || user.user[0].type == "Admin" && (
              <>
                <button onClick={()=>{setOpenModalRename(true)}}><FaEdit /></button>
              </>
            )}
          </div>
          <div>
            {equipe != null && (
              <p>Selectionneur : {equipe.Selectionneur.prenom} - {equipe.Selectionneur.nom}</p>
            )}
          </div>

          <table>
            <thead><tr>
              <th>
                prenom
              </th>
              <th>
                nom
              </th>
              <th>

              </th></tr>
            </thead>
            <tbody>
              {equipe != null && (

                <>
                  {equipe.Joueurs.map((joueur, index) =>
                    <tr key={joueur.id}>
                      <td >{joueur.prenom}</td>
                      <td >{joueur.nom}</td>
                      {user.user[0].type == "Selectionneurs" || user.user[0].type == "Admin" && (
                        <td > <button onClick={() => { setRemoveJoueur(joueur); setOpenModalRemove(true) }}><MdClose /></button> </td>
                      )}
                    </tr>
                  )}
                </>

              )}
            </tbody>
          </table>
          {user.user[0].type == "Selectionneurs" && equipe.Sellectionneurs_id == user.id || user.user[0].type == "Admin" && (
            <>
              <button onClick={() => { setOpenModalAdd(true) }}>Ajouter un joueur</button>
              {removeJoueur != null &&
                <ModalLayout isOpen={openModalRemove} handleModal={() => setOpenModalRemove(!openModalRemove)}>
                  <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <div>
                      <p className="font-semibold text-xl mb-12 flex justify-center">Supprimer {removeJoueur.prenom} {removeJoueur.nom} de l'équipe {equipe.nom}</p>
                    </div>
                    <div>
                      <div className="flex justify-end gap-4 mt-8">
                        <button onClick={() => { setOpenModalRemove(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                        <button onClick={() => handleRemoveJoueur()} className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Supprimer</button>
                      </div>
                    </div>
                  </div>
                </ModalLayout>
              }
              {joueurs != [] && (
                <ModalLayout isOpen={openModalAdd} handleModal={() => setOpenModalAdd(!openModalAdd)}>
                  <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <div>
                      <p className="font-semibold text-xl mb-12 flex justify-center">Ajouter un joueur a l'équipe {equipe.nom}</p>
                      <select name="addJoueur" defaultValue={"default"} onChange={(e) => setAddJoueurId(e.target.value)}>
                        <option value="default" disabled>Selectionner un joueur</option>
                        {joueurs.map(j =>
                          <option value={j.id} key={j.id}>
                            {j.prenom} - {j.nom}
                          </option>
                        )}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-end gap-4 mt-8">
                        <button onClick={() => { setOpenModalAdd(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                        <button onClick={() => handleAddJoueur()} className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Ajouter</button>
                      </div>
                    </div>
                  </div>
                </ModalLayout>
              )}
              <ModalLayout isOpen={openModalRename} handleModal={() => setOpenModalRename(!openModalRename)}>
                  <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <div>
                      <p className="font-semibold text-xl mb-12 flex justify-center">Renommere l'équipe {equipe.nom}</p>
                      <input type="text" defaultValue={equipe.nom} onChange={(e)=>{setNouveauNom(e.target.value)}}/>
                    </div>
                    <div>
                      <div className="flex justify-end gap-4 mt-8">
                        <button onClick={() => { setOpenModalRename(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                        <button onClick={() => handleRename()} className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Confirmer</button>
                      </div>
                    </div>
                  </div>
                </ModalLayout>

            </>

          )}

        </>
      ) : (
        <p>Il y a aucune équipe avec cette identifiant</p>
      )}

    </div>
  )
}
