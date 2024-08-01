import { createContext, useState } from "react";
import axios from "axios";


export const AuthContext = createContext();


export function AuthContextProvider({children}) {
    const [userInfo, setUserInfo] = useState({})
    const [apiKey, setApiKey] = useState('AIzaSyCigdYCP8mCDufP2lOoUc7CPz_7ZO8nFgE')
    const [token, setToken] = useState('')
    const [localId, setLocalId] = useState('')

    const signUp = async (userInfo) => {
        await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
            email : userInfo.email,
            password : userInfo.password,
            returnSecureToken : true
        }).then(response=>{
            const userId = response.data.localId
            console.log(userId)
            console.log('kayıt başarılı')
            axios.post(`https://solutions-78eb9-default-rtdb.firebaseio.com/users/${userId}.json/`, {...userInfo, statistics : {
                solution : 0,
                correct : 0,
                wrong : 0
            },discussions : {}})
        })
        
    }

    const value = {
        signUp,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}