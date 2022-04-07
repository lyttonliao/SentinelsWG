import React, { useState, useRef, useEffect } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';


const MovingAverageConvDiv = ({ chart, data, removeSelector, last, extLen }) => {
    const chartContainerRef = useRef()
    const resizeObserver = useRef()
    const [ legend, setLegend ] = useState({})
    const months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec"}


    function calcEMA(n, smoothing=2) {
        let priorEMA = data.slice(0, n).reduce((a, b) => a + b.close, 0) / n
        const multiplier = smoothing / (n + 1)
        let EMAData = data.slice(n).map(d => {
            const currEMA = d.close * multiplier + priorEMA * (1 - multiplier)
            priorEMA = currEMA
            return ({
                "time": d.date,
                "value": currEMA
            })
        })

        return EMAData
    }


    function calcSignal(dataSet, n=9, smoothing=2) {
        let priorEMA = dataSet.slice(0, n).reduce((a, b) => a + b.value, 0) / n
        const multiplier = smoothing / (n + 1)
        let EMAData = dataSet.slice(n).map(d => {
            const currEMA = d.value * multiplier + priorEMA * (1 - multiplier)
            priorEMA = currEMA
            return ({
                "time": d.time,
                "value": currEMA
            })
        })

        return EMAData
    }


    function calcMACD() {
        const fastEMA = calcEMA(12)
        const slowEMA = calcEMA(26)

        const MACDData = []
        for (let i = 0; i < slowEMA.length; i++) {
            const diff = fastEMA[i+14].value - slowEMA[i].value
            MACDData.push({
                "time": slowEMA[i].time,
                "value": diff
            })
        }

        return MACDData
    }


    function differenceHistogram(macd, signal) {
        let positiveData = []
        let negativeData = []
        for (let i = 0; i < signal.length; i++) {
            const diff = macd[i+9].value - signal[i].value
            const time = signal[i].time
            const entry = {"time": time, "value": diff}
            const whitespace = {"time": time}
            if (diff > 0) {
                positiveData.push(entry)
                negativeData.push(whitespace)
            } else {
                positiveData.push(whitespace)
                negativeData.push(entry)
            }
        }
        return [positiveData, negativeData]
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

        const MACDData = calcMACD()
        const signalData = calcSignal(MACDData)
        const [positive, negative] = differenceHistogram(MACDData, signalData)

        const MACDSeries = chart.current.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
        })
        MACDSeries.setData(MACDData)

        const signalSeries = chart.current.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            color: "yellow"
        })
        signalSeries.setData(signalData)

        const posHistogramSeries = chart.current.addHistogramSeries({
            color: "rgba(38, 166, 154, 0.28)",
            priceLineVisible: false,
            lastValueVisible: false,
        })
        posHistogramSeries.setData(positive)

        const negHistogramSeries = chart.current.addHistogramSeries({
            color: "rgba(239, 83, 80, 0.28)",
            priceLineVisible: false,
            lastValueVisible: false,
        })
        negHistogramSeries.setData(negative)

    }, [])


    // Resize chart on container resizes
    useEffect(() => {
        resizeObserver.current = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target != chartContainerRef.current) { return; }

            const { width, height } = entries[0].contentRect
            chart.current.applyOptions({ width: width, height: height})
        })

        resizeObserver.current.observe(chartContainerRef.current)

        return () => resizeObserver.current.disconnect()
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
                    "fast": iterator.next().value.toFixed(2), 
                    "slow": iterator.next().value.toFixed(2),
                    "difference": iterator.next().value.toFixed(2)
                })
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
        <div ref={chartContainerRef} style={{"height": `${1 / (2 + extLen) * 100}%`}} className="chart-container auxiliaryChart position-relative w-100">
            {legend &&
                <div className="chart-legend position-absolute top-0 start-0">
                    <div className="d-flex-inline">
                        <div className="indicator">
                            <small className="me-1">MACD 12 26 close 9 EMA EMA</small>
                            <small className="mx-1">{legend.time}</small>
                            <small className={`mx-1 ${legend.difference > 0 ? 'positive' : 'negative'}`}>{legend.difference}</small>
                            <small className="mx-1" style={{"color": "#2196f3"}}>{legend.fast}</small>
                            <small className="mx-1" style={{"color": "yellow"}}>{legend.slow}</small>
                            <div className="indicatorClose" onClick={() => removeSelector("externalSelections", "Moving Average Convergence Divergence")}>
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

export default MovingAverageConvDiv