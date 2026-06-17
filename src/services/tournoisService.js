import axios from "axios";
axios.defaults.withCredentials = true;

const baseUrl = "https://clashofleagues.fr/api/tournois";

// GET /findAll
// Retourne : { Tournois: [{ id, nom, date, lieu, Organisateurs, date_fin }] }
export const getTournaments = async () => {
    try {
        const response = await axios.get(`${baseUrl}/findAll`);
        return response.data.Tournois;
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois :", error);
        throw error;
    }
};

// GET /:id
// Retourne : { Tournois, Equipes_Participantes, Matchs }
export const findTournoisById = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération du tournois :", error);
        throw error;
    }
};

// POST /create
// Body : { nom: string, date: "YYYY-MM-DD", lieu: string }
export const createTournois = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/create`, data);
        return response;
    } catch (error) {
        console.error("Erreur lors de la création du tournois :", error);
        throw error;
    }
};

// PUT /update
// Body : { Tournois_id: number, nom?: string, date?: "YYYY-MM-DD", lieu?: string }
// Au moins un des 3 champs optionnels est requis
export const updateTournois = async (data) => {
    try {
        const response = await axios.put(`${baseUrl}/update`, data);
        return response;
    } catch (error) {
        console.error("Erreur lors de la modification du tournois :", error);
        throw error;
    }
};

// DELETE /delete/:id
export const deleteTournois = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/delete/${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la suppression du tournois :", error);
        throw error;
    }
};

// POST /addEquipe
// Body : { Tournois_id: number, Equipe_id: number }
export const addEquipeToTournois = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/addEquipe`, data);
        return response;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'équipe au tournois :", error);
        throw error;
    }
};

// DELETE /removeEquipe
// Body : { Tournois_id: number, Equipe_id: number }
export const removeEquipeFromTournois = async (data) => {
    try {
        const response = await axios.delete(`${baseUrl}/removeEquipe`, { data });
        return response;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe du tournois :", error);
        throw error;
    }
};

// POST /start
// Body : { Tournois_id: number }
export const startTournois = async (Tournois_id) => {
    try {
        const response = await axios.post(`${baseUrl}/start`, { Tournois_id });
        return response;
    } catch (error) {
        console.error("Erreur lors du lancement du tournois :", error);
        throw error;
    }
};