import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';


const CandleStickChart = ({ chart, symbol, data, techIndicators, removeSelector, last }) => {
    const chartContainerRef = useRef()
    const resizeObserver = useRef()

    const months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec"}
    const lastBar = data[data.length - 1]
    const time = data[data.length - 1].date
    const date = months[parseInt(time.slice(5,7))] + ` ${time.slice(8)}, ${time.slice(0,4)}`
    const defaultLegend = {
                            "time": date,
                            "open": lastBar.open,
                            "high": lastBar.high,
                            "close": lastBar.close,
                            "low": lastBar.low,
                            "volume": lastBar.volume,
                          }
    const [ legend, setLegend ] = useState(defaultLegend)
    const [ series, setSeries ] = useState({})

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

        const priceData = data.map(d => {
            return ({
                "time": d.date,
                "open": d.open,
                "high": d.high,
                "low": d.low,
                "close": d.close,
            })
        })

        const volumeData = data.map(d => {
            return ({
                "time": d.date,
                "value": d.volume
            })
        })

        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        })

        candleSeries.setData(priceData);

        const volumeSeries = chart.current.addHistogramSeries({
            color: '#182233',
            lineWidth: 2,
            priceFormat: {
                type: 'volume',
            },
            overlay: true,
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        })

        volumeSeries.setData(volumeData);
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


    // Updating legend when crosshair moves 
    useEffect(() => {
        chart.current.subscribeCrosshairMove(function(param) {
            if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
                chart.current.isCrosshairVisible = false
                setLegend(defaultLegend)
            } else {
                chart.current.isCrosshairVisible = true
                const iterator = param.seriesPrices.values()
                const date = months[param.time['month']] + ` ${param.time['day']}, ${param.time['year']}`
                setLegend({
                    "time": date,
                    ...iterator.next().value,
                    "volume": iterator.next().value
                })
            }
        })
    }, [])


    function simpleMovingAverage(n=20) {
        const lineSeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
        }) 

        let rollingSum = data.slice(0, n-1).reduce((a, b) => a + b.close, 0)
        let SMAData = data.slice(n-1).map((d, i) => {
            rollingSum = (i === 0) ? rollingSum + d.close : rollingSum + d.close - data[i-1].close
            return({
                "time": d.date,
                "value": rollingSum / n,
            })
        })
        
        lineSeries.setData(SMAData)
        setSeries({...series, 'Simple Moving Average': lineSeries})
    }


    function exponentialMovingAverage(n=20, smoothing=2) {
        const lineSeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
        })

        let priorEMA = data.slice(0,n).reduce((a, b) => a + b.close, 0) / n
        const multiplier = smoothing / (n + 1)
        let EMAData = data.slice(n).map(d => {
            const currEMA = d.close * multiplier + priorEMA * (1 - multiplier)
            priorEMA = currEMA
            return ({
                "time": d.date,
                "value": currEMA
            })
        })

        lineSeries.setData(EMAData)
        setSeries({...series, 'Exponential Moving Average': lineSeries})
    }


    function bollingerBands(n=20) {
        let startData = data.slice(0, n - 1)
        let recentSum = startData.reduce((a, b) => a + b.close, 0)
        let recentSumOfSquares = startData.reduce((a, b) => a + (b.close - recentSum / n)**2, 0)

        let upper = []
        let average = []
        let lower = []
        data.slice(n-1).forEach((d, i) => {
            recentSum = (i === 0) ? recentSum + d.close : recentSum + d.close - data[i-1].close
            const avgSum = recentSum / n
            recentSumOfSquares = (i === 0) ? recentSumOfSquares + (d.close - avgSum)**2 : recentSumOfSquares + (d.close - avgSum)**2 - (data[i-1].close - avgSum)**2
            const twoSD = Math.sqrt(recentSumOfSquares / n) * 2
            lower.push({"time": d.date, "value": (avgSum - twoSD)})
            average.push({"time": d.date, "value": avgSum})
            upper.push({"time": d.date, "value": (avgSum + twoSD)})
        })

        const lowerSeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,

        })

        const averageSeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
            color: "orange"
        })

        const upperSeries = chart.current.addLineSeries({
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
        })

        upperSeries.setData(upper)
        averageSeries.setData(average)
        lowerSeries.setData(lower)
        setSeries({...series, 'Bollinger Bands': [lowerSeries, averageSeries, upperSeries]})
    }


    useEffect(() => {
        for (let i = 0; i < techIndicators.length; i++) {
            const curr = techIndicators[i]

            if (!(curr in series)) {
                if (curr === "Simple Moving Average") {
                    simpleMovingAverage()
                }
                if (curr === 'Exponential Moving Average') {
                    exponentialMovingAverage()
                }
                if (curr === 'Bollinger Bands') {
                    bollingerBands()
                }
            }
        }
    }, [techIndicators])


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


    // Series are stored within state, {key: seriesName, value: series}
    // Removes series from chart, and removes selector from list of internal selections
    function removeIndicator(indicator) {
        const lineSeries = series[indicator]
        chart.current.removeSeries(lineSeries)
        const remainingSeries = {...series}
        delete remainingSeries[indicator]
        setSeries({...remainingSeries})
        removeSelector('internalSelections', indicator)
    }


    function indicatorsLegend() {
        return techIndicators.map((indicator, i) => {
            return(
                <div key={i} className="indicator">
                    <small>{indicator}</small>
                    <div className="indicatorClose" onClick={() => removeIndicator(indicator)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                </div>
            )
        })
    }


    return (
        <div ref={chartContainerRef} chart={chart} id="primaryChart" className="chart-container position-relative w-100 h-50">
            {legend && 
                <div className="chart-legend position-absolute top-0 start-0">
                    <div className="d-flex-inline">
                        <small className="ms-2 me-1 fs-6">{symbol}</small>
                        <small className="mx-1">{legend.time}</small>
                        <small className="mx-1"><strong>O</strong> {legend.open.toFixed(2)}</small>
                        <small className="mx-1"><strong>C</strong> {legend.close.toFixed(2)}</small>
                        <small className="mx-1"><strong>H</strong> {legend.high.toFixed(2)}</small>
                        <small className="mx-1"><strong>L</strong> {legend.low.toFixed(2)}</small>
                    </div>
                    <div>
                        <small className="mx-2"><strong>Vol</strong> {legend.volume}</small>
                    </div>
                    <div>
                        {indicatorsLegend()}
                    </div>
                </div>
            }
        </div>
    )
}

export default CandleStickChart;
