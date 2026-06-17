import axios from "axios"
import { useNavigate } from "react-router-dom"

let navigate = null

const excludedPaths = ['/login', '/register', '/']

export const setInterceptorNavigate = (navigateFn) => {
    navigate = navigateFn
}

export const setupInterceptors = () => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log("Interceptor triggered", {
                status: error.response?.status,
                url: error.config?.url,
                navigate: !!navigate,
                currentPath: window.location.pathname,
                isExcluded: excludedPaths.includes(window.location.pathname)
            })
            if (error.response?.status === 401) {
                const currentPath = window.location.pathname
                const isExcluded = excludedPaths.includes(currentPath)
                
                console.log(isExcluded)

                if (navigate && !isExcluded) {
                    console.log("Calling navigate('/login')")
                    navigate('/login')
                }
            }

            if (error.response?.status === 403) {
                console.error("Accès interdit")
            }

            if (error.response?.status === 500) {
                console.error("Erreur serveur")
            }

            return Promise.reject(error)
        }
    )
}
