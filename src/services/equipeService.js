import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "https://clashofleagues.fr/api/equipe"

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
            `${baseUrl}/${data.Equipe_id}`
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

export const findAllJoueur = async (data) =>{
    
    try{
        const response = await axios.get(
            `http://localhost:8080/api/joueur/findAll`
        )

        return response.data;
    }
    catch(err){
        console.error(err.error)
    }
}

export const removejoueurEquipe = async (data) => {
    //data {Equipe_id : Equipe_id, Joueur_id : "Joueur_id" }
    try {
        const response = await axios.delete(
            `${baseUrl}/removeJoueur`, 
            {data}
        );

        // const response = await axios.delete(
        //     `${baseUrl}/removeJoueur/?Equipe_id=${data.Equipe_id}&Joueur_id=${data.Joueur_id}`, 
        // );

        return response.data;
    } catch (error) {
        console.error(
            "Erreur lors du changement du nom de l'equipe :",
            error.message,
        );
        throw error;
    }
};

