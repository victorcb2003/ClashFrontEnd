import axios from "axios";
axios.defaults.withCredentials = true;
export const baseUrl = "https://clashofleagues.fr/api/tournois";

export const getTournaments = async () => {
    try {
        const response = await axios.get(`${baseUrl}/findAll`);

        return response.data.Tournois;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

