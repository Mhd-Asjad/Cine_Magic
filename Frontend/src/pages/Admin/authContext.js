import React , { useCallback , useEffect , useState } from "react";


const authContext = createContext(null);

export const AuthProvider = ({ children }) => {


    const [isAuthenticated , setIsAuthenticated ] = useState(false);
    const [ isloading , setLoading ] = useState(true);



    const validateAccessToken = useCallback(async () => {
        const access_token = localStorage.getItem('Token')
        

    })


}

