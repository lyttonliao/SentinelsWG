import React, { useState, useEffect, useContext, useRef } from "react"
import CandleStickChart from "./charts/CandleStick"
import RSI from "./charts/RSI"
import OnBalanceVolume from "./charts/OnBalanceVolume"
import { retrieveAPIData, retrieveTicker } from "./utils/utils"
import AppContext from "../context/AppContext"
import AuthContext from "../context/AuthContext"
import AccumulationDistribution from "./charts/AccumulationDistribution"
import MovingAverageConvDiv from "./charts/MovingAverageConvDiv"
import StochasticOscillator from "./charts/StochasticOscillator"


function Chart() {
    const [ display, setDisplay ] = useState('')
    const [ ticker, setTicker ] = useState({})
    const [ chartData, setChartData ] = useState([])
    const [ externalSelections, setExternalSelections ] = useState([])
    const [ internalSelections, setInternalSelections ] = useState([])
    const [ sync, setSync ] = useState(false)
    const { activeStock, activeCompany, watchlistitems, setWatchlistItems } = useContext(AppContext)
    const { user, authTokens } = useContext(AuthContext)

    const primaryRef = useRef()
    const rsiRef = useRef()
    const obvRef = useRef()
    const adRef = useRef()
    const macdRef = useRef()
    const soRef = useRef()
    const refs = {
        'CandleStickChart': primaryRef,
        'Relative Strength Index': rsiRef,
        'On-Balance Volume': obvRef,
        'Accumulation/Distribution': adRef,
        'Moving Average Convergence Divergence': macdRef,
        'Stochastic Oscillator': soRef
    }


    function addSelector(selections, selector) {
        const [setFunction, selectionState] = selections === 'externalSelections' ? [setExternalSelections, externalSelections] : [setInternalSelections, internalSelections]
        // if (selections === 'externalSelections' & externalSelections.length > 3) { return }
        if (selectionState.findIndex(x => x === selector) === -1) {
            setFunction([...selectionState, selector])
            setSync(true)
        }
    }


    function removeSelector(selections, selector) {
        const [setFunction, selectionState] = selections === 'externalSelections' ? [setExternalSelections, externalSelections] : [setInternalSelections, internalSelections]
        const idx = selectionState.findIndex(x => x === selector)
        if (-1 < idx) {
            setFunction([...selectionState.slice(0,idx), ...selectionState.slice(idx+1)])
        }
    }


    // Creating html elements for technical selectors' modal
    function indicatorsToList() {
        let internal = [
            'Simple Moving Average', 
            'Exponential Moving Average', 
            'Bollinger Bands'
        ]

        let external = [
            'On-Balance Volume', 
            'Accumulation/Distribution', 
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


    // Toggles following status on stock
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
                body: JSON.stringify({'user': user.user_id, 'ticker': ticker.id})
            })

            let data = await response.json()

            if (response.status === 201) {
                setWatchlistItems([...watchlistitems, data])
            } else {
                console.log(response.statusText)
            }
        }
    }


    // Fetches stock data from public API, retrieves the ticker info from DB
    useEffect(() => {
        if (chartData.length === 0 || activeStock !== display) {
            retrieveAPIData(activeStock).then(data => setChartData(data))
            retrieveTicker(activeStock, activeCompany).then(ticker => {
                setTicker(ticker[0])
            })
            setDisplay(activeStock)
        }

        return () => {
            setChartData([])
            setDisplay('')
        }

    }, [activeStock])


    // Handler to sync time range for multiple panes
    function myVisibleTimeRangeChangeHandler(newVisibleTimeRange) {
        if (newVisibleTimeRange === null) {
            return
        }

        const allSelections = ['CandleStickChart', ...externalSelections]
        let from
        let to
        if (sync) {
            const timeRange = primaryRef.current.timeScale().getVisibleRange()
            from = timeRange.from
            to = timeRange.to
        } else {
            from = newVisibleTimeRange.from
            to = newVisibleTimeRange.to
        }

        for (let selection of allSelections) {
            const chart = refs[selection]
            chart.current.timeScale().setVisibleRange({
                from: from,
                to: to
            })
        }
        setSync(false)
    }


    // Syncs time scale of all active charts
    useEffect(() => {
        if (primaryRef.current) {
            primaryRef.current.timeScale().subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler)

            externalSelections.forEach(selection => {
                refs[selection].current.timeScale().subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler)
            })
        }
    }, [sync])


    function auxiliaryCharts() {
        const len = externalSelections.length
        const result = externalSelections.map((selection, i) => {
            if (selection === 'Relative Strength Index') {
                return <RSI key={i} chart={rsiRef} data={chartData} removeSelector={removeSelector} last={i === externalSelections.length - 1} extLen={len} />
            }
            
            if (selection === 'On-Balance Volume') {
                return <OnBalanceVolume key={i} chart={obvRef} data={chartData} removeSelector={removeSelector} last={i === externalSelections.length - 1} extLen={len} />
            }

            if (selection === 'Accumulation/Distribution') {
                return <AccumulationDistribution key={i} chart={adRef} data={chartData} removeSelector={removeSelector} last={i === externalSelections.length - 1} extLen={len} />
            }

            if (selection === 'Moving Average Convergence Divergence') {
                return <MovingAverageConvDiv key={i} chart={macdRef} data={chartData} removeSelector={removeSelector} last={i === externalSelections.length - 1} extLen={len} />
            }

            if (selection === 'Stochastic Oscillator') {
                return <StochasticOscillator key={i} chart={soRef} data={chartData} removeSelector={removeSelector} last={i === externalSelections.length - 1} extLen={len} />
            }
        })
        return result
    }


    if (chartData.length === 0) {
        return (
            <div className="d-flex w-100 h-100 border border-light border-2"></div>
        )
    }
    return (
        <div className="w-100 border border-light border-2">
            <div className="widgets border-bottom border-light border-2">
                <div className="widgetItem" data-toggle="modal" data-target="#searchModal">
                    <span className="text-center">
                        Browse
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-circle-dotted ms-2" viewBox="0 0 16 16">
                            <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                        </svg>
                    </span>
                </div>
                <div className="widgetItem" onClick={() => toggleWatch()}>
                    {isDisplayWatched() ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill='yellow' className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                        </svg>
                    }
                </div>
                <div className="widgetItem" data-toggle="modal" data-target="#widgetModal">
                    <div data-toggle="tooltip" data-placement="left" title="Indicators, Oscillators, Strategies">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="chartContainer w-100">
                <CandleStickChart 
                    chart={primaryRef} 
                    symbol={display} 
                    data={chartData} 
                    techIndicators={internalSelections} 
                    removeSelector={removeSelector} 
                    last={externalSelections.length === 0} 
                    extLen={externalSelections.length} 
                />
                {auxiliaryCharts()}
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
