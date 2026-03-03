import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ModalLayout from "../components/ModalLayout"
import Avatar from "../components/Avatar"
import { getUser, updateUser, changePassword, setImageProfil, deleteImageProfil } from "../services/authService"
import { equipeMe } from "../services/equipeService"
import { FcStatistics } from "react-icons/fc";
import { GiSoccerBall } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

function Profil() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [equipe, setEquipe] = useState(null)
  const [match,setMatch] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({ type: null, isOpen: false })
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const fileInputRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUser()
        console.log("Données utilisateur récupérées:", userData)
        setUser(userData?.user?.[0])
        setMatch(userData?.match)

        const equipeData = await equipeMe()
        console.log("Données d'équipe récupérées:", equipeData)
        setEquipe(equipeData?.equipe)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const openModal = (type, initialData = {}) => {
    setFormData(initialData)
    setModalState({ type, isOpen: true })
  }

  const closeModal = () => {
    setModalState({ type: null, isOpen: false })
    setFormData({})
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleUpdateUser = async () => {
    try {
      await updateUser({ id: user.id, ...formData })
      const userData = await getUser()
      setUser(userData?.user?.[0])
      closeModal()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    try {
      await changePassword({
        id: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      closeModal()
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
        console.log("Fichier sélectionné:", file)
      const formDataImage = new FormData()
      formDataImage.append("image", file)
      await setImageProfil({ id: user.id, imageFile: formDataImage })
      const userData = await getUser()
      setUser(userData?.user?.[0])
      setImageFile(null)
      fileInputRef.current.value = null
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
    }
  }

  if (loading) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen">
      <Sidebar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/Pelouse.png"
          alt="background"
          className="fixed w-full h-full object-cover brightness-70"
        />
      </div>
      
      <div className="relative z-10 ml-16 p-6 space-y-6">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Header avec avatar et nom */}
          <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => openModal("manageImage")}>
                <Avatar user={user} size="lg" className="shadow-xl" />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-lg">📷</span>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user?.prenom} {user?.nom}
                </h1>
                <p className="text-white/70 text-lg">{user?.email}</p>
              </div>
              <button
                onClick={() => openModal("edit", { prenom: user?.prenom, nom: user?.nom, email: user?.email })}
                className="rounded- px-6 py-2 text-sm font-semibold bg-green-700 text-white hover:bg-green-600 shadow-sm rounded-md transition"
              >
                Modifier
              </button>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaUser/> Informations personnelles
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-sm">Prénom</label>
                  <p className="text-white font-medium">{user?.prenom || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Nom</label>
                  <p className="text-white font-medium">{user?.nom || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Email</label>
                  <p className="text-white font-medium">{user?.email || "Non renseigné"}</p>
                </div>
              </div>
              <button onClick={() => openModal("password")} className="mt-4 w-full px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600 shadow-sm transition" > Changer le mot de passe </button>
            </div>

            <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FcStatistics /> Statistiques
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-white">{match?.length}</div>
                  <div className="text-white/60 text-sm mt-1">Matchs joués</div>
                </div>
              </div>
            </div>
          </div>

          {/* Équipes */}
          {equipe && (
            <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GiSoccerBall /> Équipe
            </h2>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition cursor-pointer" onClick={() => navigate("/equipe/" + equipe?.id)}>
                <div className="flex items-center gap-3">
                    <Avatar equipe={equipe} size="sm" className="shadow-xl"/>
                  <div>
                    <p className="text-white font-semibold">{equipe?.nom}</p>
                  </div>
                </div>
                <button className="text-white/60 hover:text-white transition">→</button>
              </div>
            </div>
          </div>
          )}
          
        </div>
      </div>

      {/* Modal Modification profil */}
      <ModalLayout isOpen={modalState.isOpen && modalState.type === "edit"} handleModal={closeModal}>
        <div className="w-[450px] min-w-[380px] text-white shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 35%, 0.45)" }}>
          <p className="font-semibold text-xl mb-6 flex justify-center">Modifier les informations</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium">Prénom</label>
              <input
                type="text"
                required
                value={formData.prenom || ""}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Nouveau prénom..."
                className="px-3 py-2 rounded-sm outline outline-1 outline-green-800 hover:outline-2 placeholder-gray-700 text-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium">Nom</label>
              <input
                type="text"
                required
                value={formData.nom || ""}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Nouveau nom..."
                className="px-3 py-2 rounded-sm outline outline-1 outline-green-800 hover:outline-2 placeholder-gray-700 text-black"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-green-300 hover:bg-green-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </ModalLayout>

      {/* Modal Changement mot de passe */}
      <ModalLayout isOpen={modalState.isOpen && modalState.type === "password"} handleModal={closeModal}>
        <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center text-white backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 35%, 0.45)" }}>
          <p className="font-semibold text-xl mb-6 flex justify-center">Changer le mot de passe</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium">Mot de passe actuel</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                placeholder="Mot de passe actuel..."
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="px-3 py-2 rounded-sm outline outline-1 outline-green-800 hover:outline-2 text-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                placeholder="Nouveau mot de passe..."
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="px-3 py-2 rounded-sm outline outline-1 outline-green-800 hover:outline-2 text-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                placeholder="Confirmer le nouveau mot de passe..."
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="px-3 py-2 rounded-sm outline outline-1 outline-green-800 hover:outline-2 text-black"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-green-300 hover:bg-green-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </ModalLayout>

      {/* Modal Gestion Image */}
      <ModalLayout isOpen={modalState.isOpen && modalState.type === "manageImage"} handleModal={closeModal}>
        <div className="w-[450px] min-w-[380px] shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center text-white backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 25%, 0.65)" }}  >
          <p className="font-semibold text-xl mb-6 flex justify-center">Photo de profil</p>
          
          <div className="flex justify-center mb-6">
            <Avatar user={user} size="xl" className="shadow-xl" />
          </div>

          <div className="flex flex-col gap-3">
            <label className="w-full cursor-pointer">
              <div className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600 text-center font-medium">
                {user?.image ? "Remplacer la photo" : "Ajouter une photo"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  await handleImageChange(e)
                  closeModal()
                }}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            {user?.img_url && (
              <button
                onClick={async () => {
                  try {
                    await deleteImageProfil({ id: user.id })
                    const userData = await getUser()
                    setUser(userData?.user?.[0])
                    closeModal()
                  } catch (error) {
                    console.error("Erreur lors de la suppression:", error)
                  }
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-medium"
              >Supprimer la photo</button>
            )}

            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-md border border-green-300 hover:bg-green-900 font-medium"
            >Fermer</button>
          </div>
        </div>
      </ModalLayout>


    </div>
  )
}

export default Profil