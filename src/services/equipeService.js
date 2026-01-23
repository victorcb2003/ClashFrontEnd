import axios from "axios";
axios.defaults.withCredentials = true;
export const baseUrl = "https://clashofleagues.fr/api/equipe";

export const createEquipe = async (data) => {
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
};

export const renameEquipe = async (data) => {
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
};

export const deleteEquipe = async (data) => {
    // data = {Equipe_id : "Equipe_id"}
    try {
        const response = await axios.delete(
            `${baseUrl}/delete`,
            {data
            }
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const findAllEquipe = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}/findAll`
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const infoEquipe = async (data) => {
    //data {Equipe_id : Equipe_id }
    try {
        const response = await axios.get(
            `${baseUrl}/info/${data.Equipes_id}`
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const addjoueurEquipe = async (data) => {
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
};

export const removejoueurEquipe = async (data) => {
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
};

