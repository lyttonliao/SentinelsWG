import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';


const RSI = ({ chart, data, removeSelector, last }) => {
    const chartContainerRef = useRef()
    const resizeObserver = useRef()
    const [ legend, setLegend ] = useState({})


    function calcRSI() {
        let prevGain = 0
        let prevLoss = 0
        for (let i = 1; i < 15; i++) {
            const diff = data[i].close - data[i-1].close
            if (diff > 0) {
                prevGain += diff
            } else {
                prevLoss -= diff
            }
        }

        let RSIData = []
        for (let i = 15; i < data.length; i++) {
            const diff = data[i].close - data[i-1].close
            let currGain = (diff > 0) ? prevGain + diff : prevGain
            let currLoss = (diff < 0) ? prevLoss - diff : prevLoss
            const removeDiff = data[i-14].close - data[i-15].close
            if (removeDiff > 0) {
                currGain -= removeDiff
            } else {
                currLoss += removeDiff   
            }
            const avgGain = ((prevGain / 14) * 13) + currGain / 14
            const avgLoss = ((prevLoss / 14) * 13) + currLoss / 14
            const rsi = 100 - (100 / (1 + (avgGain / avgLoss)))
            prevGain = currGain
            prevLoss = currLoss
            RSIData.push({
                "time": data[i].date,
                "value": rsi
            })
        }
        
        return RSIData
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
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1
                }
            },
            timeScale: {
                borderColor: '#485c7b',
            },

        })

        const RSISeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
        })

        const calculatedData = calcRSI()
        RSISeries.setData(calculatedData)

        // Updating legend when crosshair moves
        chart.current.subscribeCrosshairMove(function(param) {
            // Use this once crosshairs between multiple panes are synced

            // if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
            //     chart.current.isCrosshairVisible = false
            //     const lastBar = calculatedData[calculatedData.length - 1]
            //     setLegend({"value": lastBar.value.toFixed(2)})
            // } else {
            //     chart.current.isCrosshairVisible = true
            //     const iterator = param.seriesPrices.values()
            //     setLegend({"value": iterator.next().value.toFixed(2)})
            // }

            // Use this to keep track of specific RSI for target date
            if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
                chart.current.isCrosshairVisible = false
            } else {
                chart.current.isCrosshairVisible = true
                const iterator = param.seriesPrices.values()
                setLegend({"value": iterator.next().value.toFixed(2)})
            }
        })

        RSISeries.createPriceLine({
            price: 80.0,
            color: 'white',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

        RSISeries.createPriceLine({
            price: 20.0,
            color: 'white',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

    }, [])


    useEffect(() => {
        resizeObserver.current = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }

            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width: width, height: height })
        })

        resizeObserver.current.observe(chartContainerRef.current)

        return () => resizeObserver.current.disconnect()
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
            <div ref={chartContainerRef} chart={chart} className="chart-container auxiliaryChart position-relative w-100 h-25">
                {legend &&
                    <div className="chart-legend position-absolute top-0 start-0">
                        <div className="d-flex-inline">
                            <div className="indicator">
                                <small className="me-1">RSI</small>
                                <small className="mx-1">{legend.value}</small>
                                <div className="indicatorClose" onClick={() => removeSelector("externalSelections", "Relative Strength Index")}>
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

export default RSI