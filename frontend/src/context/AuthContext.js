import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).access : null)
    const [loading, setLoading] = useState(true)
    const [errorMessages, setErrorMessages] = useState({})

    let navigate = useNavigate()


    function postLoginActions(res_data) {
        setAuthTokens(res_data)
        setUser(jwt_decode(res_data.access))
        localStorage.setItem('authTokens', JSON.stringify(res_data))
    }

    function postLogoutActions() {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    function capitalizeName(name) {
        return name[0].toUpperCase() + name.slice(1).toLowerCase()
    }


    let loginUser = async(e) => {
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'email': e.target[0].value, 'password': e.target[1].value})
        })
        let data = await response.json()

        if (response.status === 200) {
            postLoginActions(data)
            navigate('/')
        } else {
            setErrorMessages(data)
        }
    }


    let registerUser = async(e) => {
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/dj-rest-auth/registration/', {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'email': e.target[0].value,
                'first_name': capitalizeName(e.target[1].value),
                'last_name': capitalizeName(e.target[2].value),
                'password1': e.target[3].value,
                'password2': e.target[4].value,
            })
        })
        let data = await response.json()

        if (!response.ok) {
            setErrorMessages(data)
        }
    }


    let logoutUser = (e) => {
        e.preventDefault()
        postLogoutActions()
        navigate('/')
    }


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
            postLoginActions(data)
        } else {
            postLogoutActions()
        }

        if (loading) {
            setLoading(false)
        }
    }


    let contextData = {
        user: user,
        authTokens: authTokens,
        errorMessages: errorMessages,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
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
        //eslint-disable-next-line
    }, [authTokens, loading])


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}