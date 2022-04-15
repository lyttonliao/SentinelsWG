import React, { useState, useRef, useEffect } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';


const StochasticOscillator = ({ chart, data, removeSelector, last, extLen }) => {
    const chartContainerRef = useRef()
    const resizeObserver = useRef()
    const [ legend, setLegend ] = useState({})
    const months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec"}


    function calcSMA(dataSet, n=3) {
        let rollingSum = dataSet.slice(0, n-1).reduce((a, b) => a + b.value, 0)
        const SMAData = dataSet.slice(n-1).map((d, i) => {
            rollingSum = (i === 0) ? rollingSum + d.value : rollingSum + d.value - dataSet[i-1].value
            return({
                "time": d.time,
                "value": rollingSum / n,
            })
        })

        return SMAData
    }
    
    // Binary search returns the index of the data point to delete
    function removeBS(arr, val) {
        let left = 0
        let right = arr.length

        while (left <= right) {
            let mid = Math.floor((left + right) / 2)

            if (arr[mid] === val) {
                return mid
            } else if (arr[mid] < val) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }

    // Binary search returns index to insert the value, which should be the max value that is 
    // less than or equal to the target
    function addBS(arr, val) {
        let left = 0
        let right = arr.length - 1

        while (left <= right) {
            let mid = Math.floor((left + right) / 2)

            if (arr[mid] <= val) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        return left
    }


    function calcSO(n=14) {
        const initial = data.slice(0,n)
        let recentHighVals = initial.map(d => d.high).sort()
        let recentLowVals = initial.map(d => d.low).sort()

        let stochData = []
        for (let i = n - 1; i < data.length; i++) {
            if (i !== n - 1) {
                const dataToRemove = data[i-n]
                const dataToAdd = data[i]

                const dataHighIdx = removeBS(recentHighVals, dataToRemove.high)
                const dataLowIdx = removeBS(recentLowVals, dataToRemove.low)
                recentHighVals = [...recentHighVals.slice(0,dataHighIdx), ...recentHighVals.slice(dataHighIdx+1)]
                recentLowVals = [...recentLowVals.slice(0,dataLowIdx), ...recentLowVals.slice(dataLowIdx+1)]

                const highIdx = addBS(recentHighVals, dataToAdd.high)
                const lowIdx = addBS(recentLowVals, dataToAdd.low)
                recentHighVals = [...recentHighVals.slice(0, highIdx), dataToAdd.high, ...recentHighVals.slice(highIdx)]
                recentLowVals = [...recentLowVals.slice(0, lowIdx), dataToAdd.low, ...recentLowVals.slice(lowIdx)]
            }

            const high = recentHighVals[n-1]
            const low = recentLowVals[0]
            const kVal = ((data[i].close - low) / (high - low)) * 100

            stochData.push({
                "time": data[i].date,
                "value": kVal
            })
        }

        return stochData
    }


    useEffect(() => {
        chart.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,

            layout: {
                backgroundColor: '#253248',
                textColor: 'rgba(255, 255, 255, 0.9)',
            },
            grid: {
                vertLines: {
                color: '#334158',
                },
                horzLines: {
                color: '#334158',
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            priceScale: {
                borderColor: '#485c7b',
            },
            timeScale: {
                borderColor: '#485c7b',
            },
        })

        const stochData = calcSO()
        const SMAData = calcSMA(stochData)

        const stochSeries = chart.current.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
        })
        stochSeries.setData(stochData)

        const SMASeries = chart.current.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
            color: "orange"
        })
        SMASeries.setData(SMAData)
        //eslint-disable-next-line
    }, [])


    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }

            const { width, height } = entries[0].contentRect
            chart.current.applyOptions({ width: width, height: height})
        })

        resizeObserver.current.observe(chartContainerRef.current)

        return () => resizeObserver.current.disconnect()
        //eslint-disable-next-line
    }, [])


    // Tracks data at cursor position
    useEffect(() => {
        chart.current.subscribeCrosshairMove(function(param) {
            if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
                chart.current.isCrosshairVisible = false
            } else {
                chart.current.isCrosshairVisible = true
                const iterator = param.seriesPrices.values()
                const date = months[param.time['month']] + ` ${param.time['day']}, ${param.time['year']}`
                setLegend({
                    "time": date, 
                    "stoch": iterator.next().value.toFixed(2),
                    "sma": iterator.next().value.toFixed(2)
                })
            }
        })
        //eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (!last) {
            chart.current.timeScale().applyOptions({
                visible: false
            })
        } else {
            chart.current.timeScale().applyOptions({
                visible: true
            })
        }
        //eslint-disable-next-line
    }, [last])


    return (
        <div ref={chartContainerRef} style={{"height": `${1 / (2 + extLen) * 100}%`}} className="chart-container auxiliaryChart position-relative w-100">
            {legend &&
                <div className="chart-legend position-absolute top-0 start-0">
                    <div className="d-flex-inline">
                        <div className="indicator">
                            <small className="me-1">Stochastic</small>
                            <small className="mx-1">{legend.time}</small>
                            <small className="mx-1" style={{"color": "#2196f3"}}>{legend.stoch}</small>
                            <small className="mx-1" style={{"color": "orange"}}>{legend.sma}</small>
                            <div className="indicatorClose" onClick={() => removeSelector("externalSelections", "Stochastic Oscillator")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )    
}

export default StochasticOscillator