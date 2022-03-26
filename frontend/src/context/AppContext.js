import { useContext, createContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AppContext = createContext()

export default AppContext


export const AppContextProvider = ({children}) => {

    const [ activeStock, setActiveStock ] = useState(localStorage.getItem('activeStock') ?? '')
    const [ watchlistitems, setWatchlistItems ] = useState([])
    const { user, authTokens, logoutUser } = useContext(AuthContext)


    function setStorageSymbol (symbol) {
        localStorage.setItem('activeStock', symbol)
        setActiveStock(symbol)
    }


    async function getWatchlist() {
        if (!user) {
            setWatchlistItems([])
            return
        }

        const response = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })

        let data = await response.json()

        if (response.status === 200) {
            setWatchlistItems(data.watchlistitems)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }


    useEffect(() => {
        if (!activeStock) {
            setStorageSymbol('IBM')
        }
    }, [activeStock])

    
    useEffect(() => {
        if (watchlistitems.length === 0) {
            getWatchlist()
        }

        return () => setWatchlistItems([])
        //eslint-disable-next-line
    }, [user])


    let contextData = {
        activeStock: activeStock,
        setStorageSymbol: setStorageSymbol,
        watchlistitems: watchlistitems,
        getWatchlist: getWatchlist
    }

    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    )
}