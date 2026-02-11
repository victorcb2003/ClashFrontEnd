import { useEffect, useState } from "react"
import { findAllMessage } from "../services/message"
import { getUser } from "../services/authService"

export default function Message({ displayMessageModal }) {
    const [messages, setMessage] = useState([])
    const [messageTrié, setMessageTrié] = useState([])
    const [user, setUser] = useState(null)

    // messageTrié : {userid : [{message,date,lu,type},{message,date,lu,type}],userid : [{message,date,lu,type},{message,date,lu,type}]}

    useEffect(() => {
        (async () => {
            setUser(await getUser())
            setMessage(await findAllMessage())
        })()
    }, [])

    useEffect(() => {
        if (user != null) {
            (async () => {
                const newMessageTrié = { ...messageTrié }
                const usersId = []


                messages.forEach(message => {
                    if (message.expediteur_id != user.user[0].id) {
                        console.log(user.user[0].id,message.expediteur_id,"recu")
                        const addMessage = {
                            message: message.message,
                            date: message.date_envoi,
                            lu: message.lu,
                            type: "reçu"
                        }
                        if (usersId.includes(message.expediteur_id)) {
                            newMessageTrié[message.expediteur_id].push(addMessage)
                        } else {
                            newMessageTrié[message.expediteur_id] = [addMessage]
                        }
                        usersId.push(message.expediteur_id)
                    } else {
                        console.log(user.user[0].id,message.expediteur_id,message.destinataire_id,"envoyé")
                        const addMessage = {
                            message: message.message,
                            date: message.date_envoi,
                            lu: message.lu,
                            type: "envoyé"
                        }
                        if (usersId.includes(message.destinataire_id)) {
                            newMessageTrié[message.destinataire_id].push(addMessage)
                        } else {
                            newMessageTrié[message.destinataire_id] = [addMessage]
                        }
                        usersId.push(message.destinataire_id)
                    }
                })
                setMessageTrié(newMessageTrié)
            })()
        }
    }, [messages])

    useEffect(()=>{
        console.log(messageTrié)
    },[messageTrié])

    return (
        <>
            {displayMessageModal && (
                <div>
                    <div>
                        {Object.entries(messageTrié).map((userId,message)=>
                            <div></div>
                        )}
                    </div>
                    <div>

                    </div>
                </div>
            )}
        </>
    )
}
