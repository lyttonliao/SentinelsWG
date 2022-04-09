import React, { useState, useContext } from 'react';
import AppContext from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove } from '@fortawesome/free-solid-svg-icons'


function Search() {
    const [ matches, setMatches ] = useState([])
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ keywords, changeKeywords ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const { setStorageSymbol } = useContext(AppContext)


    // Sends a 'GET' request to stock API to retrieve list of matches to the keyword
    async function searchKeyword(e) {
        e.preventDefault()
        setLoading(true)
        let sym = e.target[0].value
        debugger
        let response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${sym}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_APIKEY}`, {
            method: "GET",
            headers: {
                'Content-Type': 'appliction/json',
                'Accept': 'application/json'
            }
        })
        let data = await response.json()
        debugger
        setLoading(false)

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
        const company = result["2. name"]
        return (
            <div
                key={i} 
                className="row trigger py-1 searchItem" 
                value={symbol}
                onClick={() => setStorageSymbol(symbol, company)}
                data-toggle="modal" 
                data-target="#searchModal"
            >
                <div className="col-3">{symbol}</div>
                <div className="col-9">{company}</div>
            </div>
        )
    }


    return (
        <div className="modal fade" id="searchModal" tabIndex="-1" role="dialog" aria-labelledby="searchLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <form className="w-100" onSubmit={(e) => searchKeyword(e)}>
                            <input 
                                className="searchInput"
                                type="text"
                                placeholder="Search Symbol..."
                                onChange={(e) => changeKeywords(e.target.value)}
                                value={keywords}
                            />
                        </form>
                    </div>
                    {loading &&
                        <div className="modal-body search-modal-body">
                            <h3 className="text-center font-weight-bold">
                                A messenger will soon arrive with the requested information.
                            </h3>
                            <div className="d-flex justify-content-center align-items-center">
                                <FontAwesomeIcon icon={faDove} size="3x" />
                            </div>
                        </div>
                    }
                    {matches.length > 0 &&
                        <div className="modal-body search-modal-body">
                            <div className="row mb-3 px-3">
                                <div className="col-3 fw-bold">Symbol</div>
                                <div className="col-9 fw-bold">Company / Name</div>    
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
