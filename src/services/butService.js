export const baseUrl = "http://localhost:8080/api/but"
import axios from "axios";
import { data } from "react-router-dom";

const butService = {
    create: async (data) => {
        try {
            return ( await axios.post(`${baseUrl}/create/`,
                data
            )).data
        } catch (err) {
            return err
        }
    },
    getButById: async (id) => {
        try {
            return (await axios.get(`${baseUrl}/${id}`)).data
        } catch (err) {
            console.log(err)
        }

    },
    delete: async (id) => {
        try {
            return (await axios.delete(`${baseUrl}/delete/${id}`)).data
        } catch (err) {
            console.log(err)
        }

    },
    update: async (data) => {
        try {
            return (await axios.put(`${baseUrl}/update`,
                data
            )).data 
        } catch (err) {
            console.log(err)
        }

    },
    getButByMatch: async (id) => {
        try {
            return (await axios.get(`${baseUrl}/findAllByMatch/${id}`)).data
        } catch (err) {
            console.log(err)
        }
    }

}

export default butService;
