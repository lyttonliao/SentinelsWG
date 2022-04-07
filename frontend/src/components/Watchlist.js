import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import AppContext from "../context/AppContext";


function Watchlist() {
    const [ currentTickerInfo, setCurrentTickerInfo ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const { user } = useContext(AuthContext)
    const { activeStock, setStorageSymbol, watchlistitems } = useContext(AppContext)


    function toggleActive(e) {
        const target = e.currentTarget
        if (activeStock === target.id) return;

        let currStock = document.getElementById(activeStock)
        if (currStock) {
            currStock.classList.remove('activeStock')
        }

        target.classList.add('activeStock')
        setStorageSymbol(target.id)
    }


    useEffect(() => {
        let tickerList = watchlistitems.map(watchlistitem => {
            return (watchlistitem.symbol)
        })

        setCurrentTickerInfo(tickerList)
        setLoading(false)
    
        //eslint-disable-next-line
    }, [watchlistitems])


    if (loading) {
        return (
            <div>
                Please wait a moment!
            </div>
        )
    }
    return (
        <div className="watchlistContainer h-50 border border-light border-2">
            <div className="d-flex border-bottom border-light border-2">
                <h5 className="py-2 mb-0 w-100 text-center">Watchlist</h5>
            </div>
            {currentTickerInfo.length > 0 ? (
                <div className="container overflow-auto">
                    <div className="row py-2 border-bottom border-light">
                        <div className="col">Stock</div>
                        <div className="col">Close</div>
                        <div className="col">Open</div>
                    </div>
                    <div className="mt-2">
                        {currentTickerInfo.map((ticker, i) => (
                            <div 
                                key={i} 
                                onClick={toggleActive} 
                                className={`row trigger ${ticker === activeStock ? 'activeStock' : ''}`} 
                                id={ticker}
                            >
                                <div className="col">
                                    {ticker}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {!user && <h3 className="px-4 mt-5 lh-base text-center">Sign in or Sign up <br></br> to get started!</h3>}
                </div>
            )}
        </div>
    )
}

export default Watchlist
