import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";


const Watchlist = () => {
    let [watchlistitems, setWatchlistItems] = useState([])
    let [currentTickerInfo, setCurrentTickerInfo] = useState([])
    let [loading, setLoading] = useState(true)
    let [activeStock, setActiveStock] = useState(() => localStorage.getItem('activeStock') ? localStorage.getItem('activeStock') : null)
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    let getWatchlist = async() => {
        if (!user) {
            setWatchlistItems([])
            return
        }

        let response = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`, {
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


    let toggleActive = (e) => {
        const target = e.currentTarget
        if (activeStock === target) return;

        let currStock = document.getElementById(activeStock)
        if (currStock) {
            currStock.classList.remove('active-stock')
        }
        target.classList.add('active-stock')
        localStorage.setItem('activeStock', target.id)
        setActiveStock(target.id)
    }


    useEffect(() => {
        getWatchlist()
        //eslint-disable-next-line
    }, [user, loading])


    useEffect(() => {
        let tickerList = watchlistitems.map(watchlistitem => watchlistitem.ticker)

        Promise.all(tickerList.map(async ticker => {
            return (
                fetch(`http://127.0.0.1:8000/api/tickerhistoricinfo/?ticker=${ticker}&latest=True/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    }
                })
            )
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText)
                }
                return res.json()
            })
            .then(data => {
                return data[0]
            })
        })).then(values => {
            setCurrentTickerInfo(values)
            if (loading) {
                setLoading(false)
            }
        }).catch((e) => {
            alert(e)
        })
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
        <div className="watchlist flex-shrink-0 h-50 border border-light border-3">
            <div className="d-flex border-bottom border-light border-2">
                <h5 className="py-2 mb-0 w-50 text-center border-light border-end border-2">Watchlist</h5>
                <span className="w-50 p-2 text-center trigger">
                    Browse
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-circle-dotted ms-2" viewBox="0 0 16 16">
                        <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </span>
            </div>
            {currentTickerInfo.length > 0 ? (
                <div className="container overflow-auto">
                    <div className="row py-2 border-bottom border-light">
                        <div className="col">Stock</div>
                        <div className="col">Close</div>
                        <div className="col">Open</div>
                    </div>
                    {currentTickerInfo.map((ticker, i) => (
                        <div 
                            key={i} 
                            onClick={toggleActive} 
                            className={`row trigger ${ticker.ticker === activeStock ? 'active-stock' : ''}`} 
                            id={ticker.ticker}
                        >
                            <div className="col">
                                {ticker.ticker}
                            </div>
                            <div className="col">
                                {ticker.close_price}
                            </div >
                            <div className="col">
                                {ticker.high_price}
                            </div>
                        </div>
                    ))}
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