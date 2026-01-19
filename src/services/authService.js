export const baseUrl = "https://clashofleagues.fr/api"
import axios from "axios";

export const getUser = async (userId) => {
    try {
        const response = await axios.get(`${baseUrl}/user/${userId}`)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération du user :", error)
        throw error
    }
}

export const formSignUp = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/form`, data)

        return response.data
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire user :", error)
        throw error
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/user/login`, data)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la connexion :", error)
        throw error
    }
}
