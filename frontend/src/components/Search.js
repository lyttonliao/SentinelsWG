import React, { useState } from 'react';


function Search() {
    const [ matches, setMatches ] = useState([])
    const [ errorMessage, setErrorMessage ] = useState('')
    const isModalOpen = localStorage.getItem('searchActive')

    let searchKeyword = async (e) => {
        e.preventDefault()
        let sym = e.target[0].value
        // let response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${sym}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_APIKEY}`, {
        let response = await fetch('searchsample.json', {
            method: "GET",
            headers: {
                'Content-Type': 'appliction/json',
                'Accept': 'application/json'
            }
        })

        let data = await response.json()

        if (response.status === 200) {
            setMatches(data.bestMatches)
            if (matches.length === 0) {
                setErrorMessage('Could not find any matches')
            }
        } else {
            setErrorMessage('Limit reached, please wait and try again')
        }
    }


    let listDivs = (result, i) => {
        const symbol = result["1. symbol"]
        return (
            <div
                key={i} 
                className="row trigger py-2 searchItem" 
                value={symbol}
                onClick={() => localStorage.setItem('activeStock', symbol)}
                data-toggle="modal" 
                data-target="#searchModal"
            >
                <div className="col-2">{symbol}</div>
                <div className="col-6">{result["2. name"]}</div>
                <div className="col-4">{result["3. type"]} - {result["4. region"]}</div>
            </div>
        )
    }


    if (!isModalOpen) {
        return 
    }
    return (
        <div className="modal fade" id="searchModal" tabIndex="-1" role="dialog" aria-labelledby="searchLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <form className="w-100" onSubmit={searchKeyword}>
                            <input 
                                className="searchInput"
                                type="text"
                                placeholder="Search Symbol..."
                            />
                        </form>
                    </div>
                    {matches.length > 0 &&
                        <div className="modal-body">
                            <div className="row mb-3">
                                <div className="col-2">Symbol</div>
                                <div className="col-6">Company / Name</div>
                                <div className="col-4">Type - Region</div>      
                            </div>
                            {matches.map((result, i) => {
                                return listDivs(result, i)
                            })}
                        </div>
                    }
                    {errorMessage &&
                        <div>
                            {errorMessage}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search
