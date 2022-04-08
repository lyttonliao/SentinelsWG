import { useContext, createContext, useState, useEffect, useRef } from 'react';
import AuthContext from './AuthContext';

const AppContext = createContext()

export default AppContext


export const AppContextProvider = ({children}) => {

    const [ activeStock, setActiveStock ] = useState(localStorage.getItem('activeStock') ?? '')
    const [ activeCompany, setActiveCompany ] = useState(localStorage.getItem('activeCompany') ?? '')
    const [ watchlistitems, setWatchlistItems ] = useState([])
    const { user, authTokens, logoutUser } = useContext(AuthContext)
    const prevWatchlistitemsRef = useRef()

    function setStorageSymbol(symbol, company) {
        localStorage.setItem('activeStock', symbol)
        localStorage.setItem('activeCompany', company)
        setActiveStock(symbol)
        setActiveCompany(company)
    }


    async function getWatchlist() {
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
            setStorageSymbol('IBM', 'International Business Machines Corp')
        }
    }, [activeStock])

    
    useEffect(() => {
        if (watchlistitems.length === 0 || prevWatchlistitemsRef.current !== watchlistitems.length) {
            getWatchlist()
            prevWatchlistitemsRef.current = watchlistitems.length
        }

        if (!user) {setWatchlistItems([])}
        //eslint-disable-next-line
    }, [user])


    let contextData = {
        activeStock: activeStock,
        activeCompany: activeCompany,
        setStorageSymbol: setStorageSymbol,
        watchlistitems: watchlistitems,
        setWatchlistItems: setWatchlistItems
    }

    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    )
}
