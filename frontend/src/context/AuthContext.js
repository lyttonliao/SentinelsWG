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


    let loginUser = async(e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'email': e.target.email.value, 'password': e.target.password.value})
        })
        let data = await response.json()

        if (response.status === 200) {
            postLoginActions(data)
            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }

    let registerUser = async(e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/dj-rest-auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': e.target.email.value,
                'password1': e.target.password1.value,
                'password2': e.target.password2.value,
                'first_name': e.target.first_name.value,
                'last_name': e.target.last_name.value
            })
        })

        let data = await response.json()

        if (response.status === 200) {
            postLoginActions(data)
            navigate('/')
        } else {
            alert('Registration incomplete')
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