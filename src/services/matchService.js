import axios from "axios";
axios.defaults.withCredentials = true;
export const baseUrl = "https://clashofleagues.fr/api/match";

export const findByTournoisId = async (data) => {
    // data = {id : id}
    try {
        const response = await axios.get(
            `${baseUrl}/findByTournoisId/${data.id}`
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
};

export const update = async (data) => {
    // data = {Equipe1_id : Equipe1_id, Equipe2_id : Equipe2_id, score : "score", lieu : "lieu", date_heure : date_heure}
    // au moins 1 élément dans data pas obliger de tout mettre
    // date_heure :"YYYY-MM-DD HH:mm:SS"
    try {
        const response = await axios.put(
            `${baseUrl}/update/`,
            data
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
};

export const create = async (data) => {
    // data = {Equipe1_id : Equipe1_id, Equipe2_id : Equipe2_id, lieu : "lieu", date_heure : date_heure}
    // au moins 1 élément dans data pas obliger de tout mettre
    // date_heure :"YYYY-MM-DD HH:mm:SS"
    try {
        const response = await axios.post(
            `${baseUrl}/create`,
            data
        );

        console.log(response.data)

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
};

export const getById = async (data) => {
    // data = {Match_id : id}
    try {
        const response = await axios.post(
            `${baseUrl}/${data.id}`
        );

        console.log(response.data)

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
};