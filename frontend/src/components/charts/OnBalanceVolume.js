import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, PriceScaleMode } from "lightweight-charts";


// When volume sharply increases without significant price change, price will swing
const OnBalanceVolume = ({ chart, data, removeSelector, last }) => {
    const chartContainerRef = useRef()
    const resizeObserver = useRef()
    const [ legend, setLegend ] = useState({})
    const months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec"}


    function calcOBV() {
        let obv = 0
        let obvData = []
        for (let i = 1; i < data.length; i++) {
            const today = data[i]
            const yesterday = data[i-1]
            if (today.close > yesterday.close) {
                obv = obv + today.volume
            } else if (today.close < yesterday.close) {
                obv = obv - today.volume
            }

            obvData.push({
                "time": today.date,
                "value": obv
            })
        }

        return obvData
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
            localization: {
                priceFormatter: function(price) {
                    if (price < 10**9) {
                        return Math.round(price / 10**6) + 'M'
                    } 
                    return Math.round(price / 10**9) + 'B'
                }
            }
        })
        debugger

        const OBVData = calcOBV()

        const OBVSeries = chart.current.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
        })
        OBVSeries.setData(OBVData)
    }, [])


    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }

            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width: width, height: height })
        })

        resizeObserver.current.observe(chartContainerRef.current)

        return () => resizeObserver.current.disconnect()
    }, [])

    
    // Use this to keep track of specific RSI for target date
    useEffect(() => {
        chart.current.subscribeCrosshairMove(function(param) {
            if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
                chart.current.isCrosshairVisible = false
            } else {
                chart.current.isCrosshairVisible = true
                const iterator = param.seriesPrices.values()
                const val = iterator.next().value
                const date = months[param.time['month']] + ` ${param.time['day']}, ${param.time['year']}`
                const roundedVal = val > 10**9 ? (val / 10**9).toFixed(3) + 'B' : (val / 10**6).toFixed(3) + 'M'
                setLegend({"time": date, "value": roundedVal})
            }
        })
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
    }, [last])


    return (
        <div ref={chartContainerRef} className="chart-container auxiliaryChart position-relative w-100 h-25">
            {legend &&
                <div className="chart-legend position-absolute top-0 start-0">
                    <div className="d-flex-inline">
                        <div className="indicator">
                            <small className="me-1">OBV</small>
                            <small className="mx-1">{legend.time}</small>
                            <small className="mx-1">{legend.value}</small>
                            <div className="indicatorClose" onClick={() => removeSelector("externalSelections", "On-Balance Volume")}>
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

export default OnBalanceVolume