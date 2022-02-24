import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).access : null)
    
    let [loading, setLoading] = useState(true)

    let navigate = useNavigate()

    let loginUser = async(e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': e.target.email.value, 'password': e.target.password.value})
        })
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            // setUser(fetchUserInfo())
            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }


    let logoutUser = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    
    // let fetchUserInfo = async() => {
    //     let user_id = jwt_decode(localStorage.getItem('authTokens').access).user_id
    //     let response = await fetch(`http://127.0.0.1:8000/api/users/${user_id}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + String(authTokens.access)
    //         },
    //     })
    //     let data = await response.json()

    //     if (response.status === 200) {
    //         setUser(data)
    //     } else if (response.statusText === 'Unauthorized') {
    //         logoutUser()
    //     }
    // }


    let updateToken = async() => {
        let response = await fetch('http://127.0.0.1:8000/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            // setUser(fetchUserInfo())
        } else {
            setAuthTokens(null)
            setUser(null)
            localStorage.removeItem('authTokens')
        }

        if (loading) {
            setLoading(false)
        }
    }


    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }


    useEffect(() => {
        if (loading) {
            updateToken()
        }
        let fourMinutes = 1000 * 60 * 4

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [authTokens, loading])


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}