import axios from "axios";
axios.defaults.withCredentials = true;

const baseUrl = "https://clashofleagues.fr/api/paiement";

// Récupère les modes de paiement disponibles
export const getModesPaiement = async () => {
    const response = await axios.get(`${baseUrl}/modes`);
    return response.data.modes;
};

// Crée le paiement fictif en base
export const payerInscription = async (data) => {
    const response = await axios.post(`${baseUrl}/create`, data);
    return response.data;
};