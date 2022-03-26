import React, { useEffect, useRef, useState } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'


const CandleStickChart = ({ symbol, data }) => {
    const chartContainerRef = useRef()
    const chart = useRef()
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
                            "volume": lastBar.volume
                          }
    const [ legend, setLegend ] = useState(defaultLegend)
    

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


    return (
        <div ref={chartContainerRef} className="chart-container position-relative flex-grow-1 w-100 h-100">
            {legend && 
                <div className="chart-legend position-absolute top-0 start-0">
                    <div className="d-flex-inline">
                        <small className="ms-2 me-1 fs-6">{symbol}</small>
                        <small className="mx-1">{legend.time}</small>
                        <small className="mx-1"><strong>O</strong> {legend.open}</small>
                        <small className="mx-1"><strong>C</strong> {legend.close}</small>
                        <small className="mx-1"><strong>H</strong> {legend.high}</small>
                        <small className="mx-1"><strong>L</strong> {legend.low}</small>
                    </div>
                    <div>
                        <small className="mx-2"><strong>Vol</strong> {legend.volume}</small>
                    </div>
                </div>
            }
        </div>
    )
}

export default CandleStickChart;
