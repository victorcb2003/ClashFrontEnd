import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "http://localhost:8080/api/tournois";

const tournoisService = {

    findTournoisById: async (id) => {

        try {
            const response = await axios.get(
                `${baseUrl}/${id}`
            );

            return response;
        } catch (error) {
            console.error("Erreur lors de la creation de l'equipe :", error);
            throw error;
        }
    },
    createTournois: async (data) => {
        // data = {nom : "nom", date : "YYYY-MM-DD", lieu : "lieu" }

        try {
            const response = await axios.post(
                `${baseUrl}/create`,
                data,
            );

            return response;
        } catch (error) {
            console.error("Erreur lors de la creation de l'equipe :", error);
            throw error;
        }
    }
};

export default tournoisService;