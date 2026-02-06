import Header from '../components/Header'
import matchService from '../services/matchService'
import equipeService from '../services/equipeService'
import tournoisService from '../services/tournoisService'
import butService from '../services/butService'
import formaDate from '../utils/formaDate'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io'
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function Match() {

    const [buts1, setButs1] = useState([])
    const [buts2, setButs2] = useState([])
    const [match, setMatch] = useState(null)
    const [equipe1, setEquipe1] = useState(null)
    const [equipe2, setEquipe2] = useState(null)
    const [tournois, setTournois] = useState(null)
    const [showAddBut, setShowAddBut] = useState(0)
    const [deleteButId, setDeleteButId] = useState(null)
    const [editBut, setEditBut] = useState(null)
    const [form, setForm] = useState({})
    const [editLieu,setEditLieu] = useState(null)
    const [editDate, setEditDate] = useState(null)

    const [refresh, setRefresh] = useState(false)
    const { id: matchId } = useParams()

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [timer, setTimer] = useState(null)

    async function handleEditLieu(){
        const response = await matchService.updateMatch({lieu : editLieu, Match_id : matchId})

        setEditLieu(null)
        setRefresh(!refresh)
    }

    async function handleEditDate(){
        const date = new Date(editDate)
        const response = await matchService.updateMatch({date_heure : formaDate(date),Match_id : matchId})

        setEditDate(null)
        setRefresh(!refresh)
    }

    function addBut(id, n) {
        setShowAddBut(n)
        setForm({ Equipe_id: id, User_id : 0, Type_but : 0, date_heure : "" })
    }

    async function handleDeleteBut() {
        const reponse = await butService.delete(deleteButId)

        setDeleteButId(null)
        setRefresh(!refresh)
    }

    async function handleEditBut() {

        const errors = []
        if (!editBut.User_id) {
            errors.push("Veuillez selectionner un joueur")
        }
        if (![0, 1].includes(editBut.Type_but)) {
            errors.push("Veuillez selectionner un type de but")
        }
        if (!editBut.date_heure) {
            errors.push("Veillez renseigner la minute du but")
        }
        if (!/^(?:0|[1-9]\d?|1\d\d|200)$/.test(editBut.date_heure)) {
            errors.push("La date doit être un nombre entre 0 et 200")
        }
        if (errors.length != 0) return showError(errors)

        const date = new Date(new Date(match.date_heure).getTime() + editBut.date_heure * 60000) // Une minute en milliseconde

        const date_heure = formaDate(date)

        const response = await butService.update({ But_id: editBut.But_id, date_heure: date_heure, User_id: editBut.User_id, Type_But: editBut.Type_But, Match_id: matchId })

        setEditBut(null)

        if (response.error) showError([response.error.message])

        setRefresh(!refresh)
        showSuccess(response.data.message)


    }

    function getUserById(id) {
        const joueur = [...equipe1.Joueurs, ...equipe2.Joueurs]
        const joueurr = joueur.filter(j => j.id == id)[0]
        if (joueurr) return `${joueurr.prenom} ${joueurr.nom}`
    }

    async function handleSubmitBut(e) {
        e.preventDefault();

        const errors = []
        if (!form.User_id) {
            errors.push("Veuillez selectionner un joueur")
        }
        if (!form.Type_But) {
            errors.push("Veuillez selectionner un type de but")
        }
        if (!form.date_heure) {
            errors.push("Veillez renseigner la minute du but")
        }
        if (!/^(?:0|[1-9]\d?|1\d\d|200)$/.test(form.date_heure)) {
            errors.push("La date doit être un nombre entre 0 et 200")
        }
        if (errors.length != 0) return showError(errors)

        const date = new Date(new Date(match.date_heure).getTime() + form.date_heure * 60000) // Une minute en milliseconde

        const date_heure = formaDate(date)

        const response = await butService.create({ date_heure: date_heure, User_id: form.User_id, Type_But: form.Type_But, Match_id: matchId })

        setShowAddBut(false)

        if (response.error) showError([response.error.message])

        setRefresh(!refresh)
        showSuccess(response.data.message)
    }

    // Match
    useEffect(() => {
        (async () => {

            try {
                const reponse = await matchService.getMatchById(matchId);
                setMatch(reponse.data.match);
            } catch (err) {
                console.log(err)
            }
        })()
    }, [refresh])


    // Buts
    useEffect(() => {
        (async () => {
            try {
                if (equipe2 && equipe1 && equipe1.length != 0 && equipe2.length != 0) {

                    const buts = (await butService.getButByMatch(matchId)).buts
                    setButs1([])
                    setButs2([])

                    const equipe1Id = []

                    equipe1.Joueurs.forEach(j => {
                        equipe1Id.push(j.id)
                    })

                    const but1 = []
                    const but2 = []
                    buts.forEach(but => {
                        if (equipe1Id.includes(but.User_id)) {
                            but1.push(but)
                        } else if (true) {
                            but2.push(but)
                        }
                    });
                    setButs1(but1)
                    setButs2(but2)
                }
            } catch (err) {
                console.log(err)
            }
        })();

    }, [equipe1, equipe2, refresh])

    // Equipe et tournois si il y en a un
    useEffect(() => {
        (async () => {
            try {
                if (match != null) {
                    if (match && match.Equipe1_id) {
                        setEquipe1(await equipeService.getEquipeByID(match.Equipe1_id))
                        setEquipe2(await equipeService.getEquipeByID(match.Equipe2_id))
                    }
                }
                if (match && match.Tournois_id) {
                    try {
                        setTournois(await tournoisService.findTournoisById(match.Tournois_id))
                    } catch (err) {
                        console.log(err)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })();
    }, [match])

    return (
        <>
            {/* <Header /> */}
            <div className='container mx-auto mt-10'>
                <h1 className='text-center'>Match</h1>
                {match ? (
                    <div>

                        {equipe1 && equipe2 && (
                            <div>
                                <h2>{equipe1.nom} - {equipe2.nom}</h2>
                            </div>
                        )}
                        <p>
                            <strong>Lieu:</strong>
                        {editLieu != null ? (
                            <> 
                            <input type="text" value={editLieu} onChange={(e)=>{setEditLieu(e.target.value)}} />
                            <button onClick={()=>{handleEditLieu()}}>
                                Confirmer
                            </button>
                            <button onClick={()=>{setEditLieu(null)}} >
                                Annuler
                            </button>
                            </>
                        ) : (
                            <>
                            {match.lieu}
                            <button onClick={()=>{setEditLieu(match.lieu)}}>
                                <FaEdit/>
                            </button>
                            </>
                            
                        )}
                        </p>
                        <p><strong>Date et Heure:</strong>
                        {editDate != null ? (
                            <>
                            <input type="datetime-local" value={editDate} onChange={(e)=>{setEditDate(e.target.value)}} />

                            <button onClick={()=>{handleEditDate()}}>
                                Confirmer
                            </button>
                            <button onClick={()=>{setEditDate(null)}} >
                                Annuler
                            </button>
                            </>
                        ):(
                            <>
                            {new Date(match.date_heure).toLocaleString()}
                            <button onClick={()=>{setEditDate("")}}>
                                <FaEdit/>
                            </button>
                            </>                        
                        )}
                        </p>
                        
                        


                        {tournois != null && (
                            <p><strong>Tournois:</strong> {tournois.nom}</p>
                        )}
                        {equipe1 && equipe2 && (
                            <div>
                                <h3>Buts</h3>
                                <div className='conteiner-table'>
                                    <table className='table-but'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    But de {equipe1.nom}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {buts1.map(but =>
                                                    <td key={but.id}>
                                                        <p>
                                                            {getUserById(but.User_id)}
                                                        </p>
                                                        <p>
                                                            {(new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000}° minute
                                                        </p>
                                                        <p>
                                                            {but.Type_but ? "Penalty" : "Normal"}
                                                        </p>

                                                        <div>
                                                            <button onClick={() => {
                                                                setEditBut({
                                                                    User_id: but.User_id,
                                                                    date_heure: (new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000,
                                                                    Type_but: but.Type_but
                                                                })
                                                            }}>
                                                                <FaEdit />
                                                            </button>
                                                            <button onClick={() => { setDeleteButId(but.id) }}>
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                                {showAddBut == 1 ? (
                                                    <td>
                                                        <form onSubmit={(e) => handleSubmitBut(e)}>
                                                            <select
                                                                defaultValue={"Selectionner un Joueur"}
                                                                name="butteur"
                                                                onChange={e => { setForm({ ...form, User_id: e.target.value }) }}
                                                            >
                                                                <option value="Selectionner un Joueur" disabled>
                                                                    Selectionner un Joueur
                                                                </option>
                                                                {equipe1.Joueurs.map(joueur =>
                                                                    <option value={joueur.id} key={joueur.id}>
                                                                        {joueur.prenom} - {joueur.nom}
                                                                    </option>
                                                                )}
                                                            </select>
                                                            <select
                                                                name="type"
                                                                value={form.Type_But}
                                                                onChange={e => setForm({ ...form, Type_But: e.target.value })}
                                                                defaultValue={"Type de but"}
                                                            >
                                                                <option value="Type de but" disabled>
                                                                    Type de but
                                                                </option>
                                                                <option value="0">Normal</option>
                                                                <option value="1">Penalty</option>
                                                            </select>
                                                            <input
                                                                type="number"
                                                                placeholder='Minute du but ?'
                                                                value={form.date_heure}
                                                                onChange={e => setForm({ ...form, date_heure: e.target.value })}
                                                            />
                                                            <input type="submit" />
                                                        </form>
                                                    </td>
                                                ) : (
                                                    <td>
                                                        <button onClick={() => { addBut(equipe2.id, 1) }}>
                                                            <IoMdAdd />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className='table-but'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    But de {equipe2.nom}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {buts2.map(but =>
                                                    <td key={but.id}>
                                                        <p>
                                                            {getUserById(but.User_id)}
                                                        </p>
                                                        <p>
                                                            {(new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000}° minute
                                                        </p>
                                                        <p>
                                                            {but.Type_But ? "Penalty" : "Normal"}
                                                        </p>
                                                        <div>
                                                            <button onClick={() => {
                                                                setEditBut({
                                                                    User_id: but.User_id,
                                                                    date_heure: (new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000,
                                                                    Type_but: but.Type_but
                                                                })
                                                            }}>
                                                                <FaEdit />
                                                            </button>
                                                            <button onClick={() => { setDeleteButId(but.id) }}><FaTrashAlt /></button>
                                                        </div>
                                                    </td>
                                                )}
                                                {showAddBut == 2 ? (
                                                    <td>
                                                        <form onSubmit={(e) => handleSubmitBut(e)}>
                                                            <select
                                                                value={form.User_id}
                                                                defaultValue={"Selectionner un Joueur"}
                                                                name="butteur"
                                                                onChange={e => { setForm({ ...form, User_id: e.target.value }) }}
                                                            >
                                                                <option value="Selectionner un Joueur" disabled>
                                                                    Selectionner un Joueur
                                                                </option>
                                                                {equipe2.Joueurs.map((joueur, key) =>
                                                                    <option value={joueur.id} key={key}>
                                                                        {joueur.nom} - {joueur.prenom}
                                                                    </option>
                                                                )}
                                                            </select>
                                                            <select
                                                                name="type"
                                                                value={form.Type_But}
                                                                onChange={e => setForm({ ...form, Type_But: e.target.value })}
                                                                defaultValue={"Type de but"}
                                                            >
                                                                <option value="Type de but" disabled>
                                                                    Type de but
                                                                </option>
                                                                <option value="0">Normal</option>
                                                                <option value="1">Penalty</option>
                                                            </select>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={0}
                                                                placeholder='Minute du but ?'
                                                                value={form.date_heure}
                                                                onChange={(e) => {setForm({ ...form, date_heure: e.target.value })}}
                                                            />
                                                            <input type="submit" />
                                                        </form>
                                                    </td>
                                                ) : (
                                                    <td>
                                                        <button onClick={() => { addBut(equipe2.id, 2) }}>
                                                            <IoMdAdd />
                                                        </button>
                                                    </td>
                                                )}

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <h2>aucun match avec cette id</h2>
                )}
            </div>
            {error && (
                <div>
                    <div>
                        <h3>
                            Érreur
                        </h3>
                        <button onClick={() => { setTimer(null) }}>
                            <MdClose />
                        </button>
                    </div>
                    <ul>
                        {error.map((e, index) =>
                            <li key={index}>
                                {e}
                            </li>
                        )}
                    </ul>
                </div>
            )}
            {deleteButId != null && (
                <div>
                    <div>
                        <h3>
                            Supprimer le but
                        </h3>
                        <button onClick={() => { setDeleteButId(null) }}>
                            <MdClose />
                        </button>
                    </div>
                    <div>
                        <button onClick={() => { setDeleteButId(null) }}>
                            Annuler
                        </button>
                        <button onClick={() => { handleDeleteBut() }}>
                            Supprimer
                        </button>
                    </div>
                </div>
            )}
            {editBut != null && (
                <div>
                    <div>
                        <h3>
                            Modification du but
                        </h3>
                        <button onClick={() => { setEditBut(null) }}>
                            <MdClose />
                        </button>
                    </div>
                    <div>
                        <form action="">
                            <select
                                name="User_id" id=""
                                value={editBut.User_id}
                                defaultValue={editBut.User_id}
                                onChange={(e) => { setEditBut({ ...editBut, User_id: e.target.value }) }}
                            >
                                {equipe1.Joueurs.filter(j => j.id == editBut.User_id).length != 0 ? (
                                    <>
                                        {equipe1.Joueurs.map((joueur, key) =>
                                            <option value={joueur.id} key={key}>
                                                {joueur.prenom} - {joueur.nom}
                                            </option>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {equipe2.Joueurs.map((joueur, key) =>
                                            <option value={joueur.id} key={key}>
                                                {joueur.prenom} - {joueur.nom}
                                            </option>
                                        )}
                                    </>
                                )}
                            </select>
                            <select
                                name="Type_but"
                                defaultValue={editBut.Type_but}
                                value={editBut.Type_but}
                                onChange={(e) => { setEditBut({ ...editBut, Type_but: e.target.value }) }}
                            >
                                <option value="0">Normal</option>
                                <option value="1">Penalty</option>
                            </select>
                            <input
                                type="number"
                                min={0}
                                max={0}
                                defaultValue={editBut.date_heure}
                                value={editBut.date_heure}
                                onChange={(e) => { setEditBut({ ...editBut, date_heure: e.target.value }) }}
                            />
                        </form>
                    </div>
                    <div>
                        <button onClick={() => { setEditBut(null) }}>
                            Annuler
                        </button>
                        <button onClick={() => { handleEditBut() }}>
                            Confirmer
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
