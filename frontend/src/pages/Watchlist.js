import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";


const Watchlist = () => {
    let [watchlist, setWatchlist] = useState({'user': '', 'watchlistitems': []})
    let { user, authTokens, logoutUser } = useContext(AuthContext)


    useEffect(() => {
        getWatchlist()
    })


    let getWatchlist = async() => {
        let response = await fetch(`http://127.0.0.1:8000/api/watchlists/${user.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setWatchlist(data)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    return (
        <div>
            <h2>May the Sentinels watch over you</h2>
            <ul>
                {watchlist.watchlistitems.map((watchlistitem, i) => (
                    <li key={i}>{watchlistitem}</li>
                ))}
            </ul>
        </div>
    )
}

export default Watchlist
