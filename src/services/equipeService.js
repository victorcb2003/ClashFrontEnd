import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "http://localhost:8080/api/equipe";

const equipeService = {

    createEquipe: async (data) => {
        // data = {nom : "nom"}
        try {
            const response = await axios.post(
                `${baseUrl}/create`,
                data
            );

            return response;
        } catch (error) {
            console.error("Erreur lors de la creation de l'equipe :", error);
            throw error;
        }
    },

    renameEquipe: async (data) => {
        // data = {Equipe_id : "Equipe_id",nom : "nom"}
        try {
            const response = await axios.put(
                `${baseUrl}/rename`,
                data
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors du changement du nom de l'equipe :", error);
            throw error;
        }
    },

    deleteEquipe: async (id) => {
        try {
            const response = await axios.delete(
                `${baseUrl}/delete`,
                {
                    id
                }
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors du changement du nom de l'equipe :", error);
            throw error;
        }
    },

    findAllEquipe: async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/findAll`
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors du changement du nom de l'equipe :", error);
            throw error;
        }
    },

    getEquipeByID: async (id) => {
        try {
            const response = await axios.get(
                `${baseUrl}/${id}`
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors du changement du nom de l'equipe :", error);
            throw error;
        }
    },

    addjoueurEquipe: async (data) => {
        //data {Equipe_id : Equipe_id, Joueur_id : "Joueur_id" }
        try {
            const response = await axios.post(
                `${baseUrl}/addJoueur`,
                data
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors du changement du nom de l'equipe :", error);
            throw error;
        }
    },

    removejoueurEquipe: async (data) => {
        //data {Equipe_id : Equipe_id, Joueur_id : "Joueur_id" }
        try {
            const response = await axios.post(
                `${baseUrl}/removeJoueur`,
                data
            );

            return response.data;
        } catch (error) {
            console.error(
                "Erreur lors du changement du nom de l'equipe :",
                error.message,
            );
            throw error;
        }
    }
};

export default equipeService;

