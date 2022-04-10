import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AppContext from "../context/AppContext";


function Watchlist() {
    const { user, authTokens } = useContext(AuthContext)
    const { activeStock, setStorageSymbol, watchlistitems, setWatchlistItems } = useContext(AppContext)


    // Sets CSS className for the active stock and sets local state and local Storage
    function toggleActive(e, symbol, company) {
        e.stopPropagation()
        if (activeStock === symbol) return;

        let currStock = document.getElementById(activeStock)
        currStock.classList.remove('activeStock')

        e.currentTarget.classList.add('activeStock')
        setStorageSymbol(symbol, company)
    }


    const companyName = (name) => {
        if (name.length > 20) {
            return name.slice(0, 20) + '...' 
        }
        return name
    }


    // Remove individual watchlist items from user's list
    async function removeWatchlistItem(e, idx, id) {
        e.stopPropagation()
        let response = await fetch(`http://127.0.0.1:8000/api/watchlistitems/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })

        if (response.status === 204) {
            setWatchlistItems([...watchlistitems.slice(0,idx), ...watchlistitems.slice(idx+1)])
        } else {
            console.log(response.statusText)
        }
    }


    return (
        <div className="watchlistContainer h-50 border border-light border-2">
            <div className="d-flex border-bottom border-light border-2">
                <h5 className="py-2 mb-0 w-100 text-center">Watchlist</h5>
            </div>
                <div className="container overflow-auto">
                    <div className="row py-2 border-bottom border-light">
                        <div className="col-3">Stock</div>
                        <div className="col-7">Company / Name</div>
                    </div>
                    {watchlistitems.length > 0 ? (
                        <div className="mt-2">
                            {watchlistitems.map((item, i) => (
                                <div 
                                    key={i} 
                                    onClick={(e) => toggleActive(e, item.symbol, item.company)} 
                                    className={`watchlistItem row trigger ${item.symbol === activeStock ? 'activeStock' : ''}`} 
                                    id={item.symbol}
                                >
                                    <div className="col-3">{item.symbol}</div>
                                    <div className="col-7">{companyName(item.company)}</div>
                                    <div className="col-2 remove-wl-button" onClick={(e) => removeWatchlistItem(e, i, item.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {!user && <h3 className="px-3 mt-4 lh-base text-center">Sign in or Sign up <br></br> to get started!</h3>}
                        </div>
                    )}
                </div>
        </div>
    )
}

export default Watchlist
