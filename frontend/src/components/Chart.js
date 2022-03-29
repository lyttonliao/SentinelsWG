import React, { useState, useEffect, useContext } from "react"
import CandleStickChart from "./charts/CandleStick"
import { retrieveAPIData, retrieveTicker } from "./utils/utils"
import AppContext from "../context/AppContext"
import AuthContext from "../context/AuthContext"


function Chart() {
    const [ display, setDisplay ] = useState('')
    const [ ticker, setTicker ] = useState({})
    const [ chartData, setChartData ] = useState([])
    const [ externalSelections, setExternalSelections ] = useState([])
    const [ internalSelections, setInternalSelections ] = useState([])
    const { activeStock, watchlistitems, setWatchlistItems } = useContext(AppContext)
    const { user, authTokens } = useContext(AuthContext)


    function addSelector(selections, selector) {
        const [setFunction, selectionState] = selections === 'externalSelections' ? [setExternalSelections, externalSelections] : [setInternalSelections, internalSelections]
        if (selectionState.findIndex(x => x === selector) === -1) {
            setFunction([...selectionState, selector])
        }
    }


    function removeSelector(selections, selector) {
        const [setFunction, selectionState] = selections === 'externalSelections' ? [setExternalSelections, externalSelections] : [setInternalSelections, internalSelections]
        const idx = selectionState.findIndex(x => x === selector)
        if (-1 < idx) {
            setFunction([...selectionState.slice(0,idx), ...selectionState.slice(idx+1)])
        }
    }


    function indicatorsToList() {
        let internal = [
            'Simple Moving Average', 
            'Exponential Moving Average', 
            'Bollinger Bands'
        ]

        let external = [
            'On-Balance Volume', 
            'Accumulation/Distribution Indicator', 
            'Relative Strength Index', 
            'Moving Average Convergence Divergence', 
            'Stochastic Oscillator'
        ]

        let allIndicators = [internal, external]
        for (let i = 0; i < allIndicators.length; i++) {
            let selections = (i === 0) ? 'internalSelections' : 'externalSelections'
            allIndicators[i] = allIndicators[i].map((indicator, k) => {
                return (
                    <div
                        key={i === 0 ? k : k + allIndicators[i-1].length}
                        className="trigger technicalSelection" 
                        onClick={() => addSelector(selections, indicator)}
                        data-toggle="modal"
                        data-target="#widgetModal"
                    >
                        {indicator}
                    </div>
                )
            })
        }

        return allIndicators.reduce((a, b) => a.concat(b))
    }


    function isDisplayWatched() {
        return watchlistitems.filter(watchlistitem => watchlistitem.symbol === display).length > 0
    }


    async function toggleWatch() {
        if (isDisplayWatched()) {
            const idx = watchlistitems.findIndex(watchlistitem => watchlistitem.symbol === display)
            const id = watchlistitems[idx].id
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
        } else {
            let response = await fetch('http://127.0.0.1:8000/api/watchlistitems/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({'user': user.id, 'ticker': ticker.id})
            })

            let data = await response.json()

            if (response.status === 201) {
                setWatchlistItems([...watchlistitems, data])
            } else {
                console.log(response.statusText)
            }
        }
    }


    useEffect(() => {
        if (chartData.length === 0 || activeStock !== display) {
            retrieveAPIData(activeStock).then(data => setChartData(data))
            retrieveTicker(activeStock).then(ticker => setTicker(ticker[0]))
            setDisplay(activeStock)
        }

        return () => {
            setChartData([])
            setDisplay('')
        }

    }, [activeStock])


    if (chartData.length === 0) {
        return (
            <div className="d-flex h-50 flex-grow-1 border border-light"></div>
        )
    }
    return (
        <div className="d-flex h-50 flex-grow-1 border border-light">
            <CandleStickChart symbol={display} data={chartData} techIndicators={internalSelections} removeSelector={removeSelector}/>
            <div className="widgets">
                <div className="widgetItem" onClick={() => toggleWatch()}>
                    {isDisplayWatched() ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill='yellow' className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                        </svg>
                    }
                </div>
                <div data-toggle="tooltip" data-placement="left" title="Indicators, Oscillators, Strategies">
                    <div className="widgetItem" data-toggle="modal" data-target="#widgetModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="widgetModal" tabIndex="-1" role="dialog" aria-labelledby="widgetLabel" aria-hidden="true">
                <div className="modal-dialog position-absolute top-50 start-50 translate-middle">
                    <div className="modal-content">
                        <h5 className="modal-header text-dark">
                            Technical Analysis Selection
                        </h5>
                        <div className="modal-body technical-modal-body">
                            <h6 className="px-3 pb-2">Indicators &amp; Oscillators</h6>
                            {indicatorsToList()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chart
