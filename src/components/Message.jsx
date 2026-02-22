import { useEffect, useState } from "react"
import { findAllMessage, sendMessage, deleteMessage } from "../services/message"
import { getUser, infoUser, searchUser } from "../services/authService"
import formaDate from "../utils/formaDate"
import { FaTrashAlt  } from "react-icons/fa"

export default function Message({ displayMessage, isOpen }) {
    const [messages, setMessage] = useState([])
    const [messageTrié, setMessageTrié] = useState(null)
    const [user, setUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isLeftHovered, setIsLeftHovered] = useState(false)

    // messageTrié : {userid : [{message,date,lu,type},{message,date,lu,type}],userid : [{message,date,lu,type},{message,date,lu,type}]}

    useEffect(() => {
        (async () => {
            setUser(await getUser())
        })()
    }, [])

    useEffect(() => {
        if (!isSending){
            (async () => {
            setMessage(await findAllMessage())
        })()
        }
    }, [isSending])

    useEffect(() => {
        console.log(messages)
        if (user != null) {
            (async () => {
                const newMessageTrié = { ...(messageTrié ?? {}) }
                const usersId = []


                for (const message of messages) {
                    if (message.expediteur_id != user.user[0].id) {
                        const addMessage = {
                            id: message.id,
                            message: message.message,
                            date: message.date_envoi,
                            lu: message.lu,
                            type: "reçu"
                        }
                        if (usersId.includes(message.expediteur_id)) {
                            newMessageTrié[message.expediteur_id].message.push(addMessage)
                        } else {
                            const u = await infoUser(message.expediteur_id)
                            newMessageTrié[message.expediteur_id] = { user: u, message: [addMessage] }
                        }
                        usersId.push(message.expediteur_id)
                    } else {
                        const addMessage = {
                            id: message.id,
                            message: message.message,
                            date: message.date_envoi,
                            lu: message.lu,
                            type: "envoyé"
                        }
                        if (usersId.includes(message.destinataire_id)) {
                            newMessageTrié[message.destinataire_id].message.push(addMessage)
                        } else {
                            const u = await infoUser(message.destinataire_id)
                            newMessageTrié[message.destinataire_id] = { user: u, message: [addMessage] }
                        }
                        usersId.push(message.destinataire_id)
                    }
                }
                setMessageTrié(newMessageTrié)
            })()
        }
    }, [messages])

    useEffect(() => {
        if (messageTrié!= null && messageTrié.length!=0) {
            console.log(messageTrié)
        }
    }, [messageTrié])

    useEffect(() => {
        let isActive = true

        const runSearch = async () => {
            const term = searchTerm.trim()
            if (term.length == 0) {
                if (isActive) setSearchResults([])
                return
            }

            setIsSearching(true)
            const data = await searchUser(term)
            if (!isActive) return

            const results = data?.users ?? data?.user ?? data?.results ?? data ?? []
            setSearchResults(Array.isArray(results) ? results : [])
            setIsSearching(false)
        }

        runSearch()

        return () => {
            isActive = false
        }
    }, [searchTerm])

    const handleSelectUser = (userId, userData) => {
        setSelectedUserId(userId)
        setSelectedUser(userData)
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!selectedUserId || newMessage.trim().length === 0 || isSending) return

        setIsSending(true)

        await sendMessage({destinataire_id: selectedUserId,message: newMessage})

        setNewMessage("")
        setIsSending(false)
    }

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return
        
        try {
            console.log(messageId)
            await deleteMessage(messageId)
            setIsSending(true)
            setTimeout(() => setIsSending(false), 100)
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
        }
    }

    return (
        <>
            {displayMessage && (
                <div className={`w-full h-full ${isOpen ? "opacity-100" : "opacity-0"}`}>
                    <div className=" w-full h-full min-h-[70vh] overflow-hidden backdrop-blur-md bg-white/20 border border-white/10 p-4 shadow-lg">
                        <div className="flex h-full flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
                                    placeholder="Rechercher un utilisateur..."
                                    className="w-max rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                                {isSearchOpen && (
                                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {isSearching && (
                                            <div className="px-4 py-2 text-xs text-slate-500">Recherche en cours...</div>
                                        )}
                                        {!isSearching && searchResults.length === 0 && searchTerm.trim().length >= 2 && (
                                            <div className="px-4 py-2 text-xs text-slate-500">Aucun résultat</div>
                                        )}
                                        {!isSearching && searchResults.length > 0 && (
                                            <ul className="max-h-56 overflow-y-auto">
                                                {searchResults.map((result) => (
                                                    <li key={result.id ?? `${result.prenom}-${result.nom}`}>
                                                        <button
                                                            type="button"
                                                            onMouseDown={() => handleSelectUser(result.id, result)}
                                                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                                                {result.prenom?.[0]}{result.nom?.[0]}
                                                            </span>
                                                            <span className="font-medium">
                                                                {result.prenom} {result.nom}
                                                            </span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`grid h-full gap-4 transition-all duration-300 ${isLeftHovered ? "lg:grid-cols-[280px_minmax(0,1fr)]" : "lg:grid-cols-[80px_minmax(0,1fr)]"}`}>
                                <div className="flex h-full flex-col" onClick={() => setIsLeftHovered(true)} onMouseLeave={() => setIsLeftHovered(false)}>

                                {messageTrié != null && messageTrié.length != 0 && (
                                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                        {
                                            Object.entries(messageTrié).map(([userId, message]) => (
                                                <button
                                                    key={userId}
                                                    type="button"
                                                    onClick={() => handleSelectUser(userId, message.user)}
                                                    className={`group w-full transition-all duration-300`}
                                                >
                                                    <div className={`flex items-center gap-2 overflow-hidden rounded-xl border px-2 py-1 shadow-sm transition-all duration-300 ${selectedUserId == userId ? "border-indigo-200 bg-indigo-50" : "border-slate-100 bg-slate-50"}`}>
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                                            {message.user.prenom?.[0]}{message.user.nom?.[0]}
                                                        </div>
                                                        <div className="min-w-0 overflow-hidden transition-all duration-300">
                                                            <p className={`truncate text-sm font-semibold text-slate-800 transition-opacity duration-300 ${isLeftHovered ? "opacity-100" : "opacity-0"}`}>
                                                                {message.user.prenom} - {message.user.nom}
                                                            </p>
                                                        </div>
                                                        {message.message.filter(m => m.lu == 0 && m.type == "reçu").length != 0 && (
                                                            <span className={`inline-flex ml-auto flex-shrink-0 h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white shadow transition-opacity duration-300 ${isLeftHovered ? "opacity-100" : "opacity-0"}`}>
                                                                {message.message.filter(m => m.lu == 0 && m.type == "reçu").length}
                                                                {console.log(message)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        }
                                    </div>

                                    )}
                                </div>

                                <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    {selectedUserId ? (
                                        <div className="flex h-full flex-col">
                                        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                                {selectedUser?.prenom?.[0]}{selectedUser?.nom?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedUser?.prenom} {selectedUser?.nom}
                                                </p>
                                                <p className="text-xs text-slate-500">Conversation</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                            {messageTrié?.[selectedUserId]?.message?.length ? (
                                                messageTrié[selectedUserId].message.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        className={`group flex ${msg.type === "envoyé" ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div
                                                            className={`max-w-[75%] rounded-md px-2 py-1 text-sm shadow ${msg.type === "envoyé" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
                                                        >
                                                            <p>{msg.message}</p>
                                                            <div className={`mt-1 text-[10px] flex items-center gap-1 justify-between ${msg.type === "envoyé" ? "text-indigo-100" : "text-slate-400"}`}>
                                                                {msg.type === "envoyé" && (
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                                        className=" hover:text-red-400"
                                                                        title="Supprimer"
                                                                    >
                                                                        <FaTrashAlt/> 
                                                                    </button>
                                                                )}
                                                                <span>{formaDate(new Date(msg.date))}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-slate-500">Aucun message pour le moment.</div>
                                            )}
                                        </div>

                                        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Écrire un message..."
                                                className="w-[60%] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSending || newMessage.trim().length === 0}
                                                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Envoyer
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        Sélectionne un utilisateur pour voir la conversation.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
