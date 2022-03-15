import React, { useEffect, useRef, useState } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'


const CandleStickChart = ({ data }) => {
    const [ legend, setLegend ] = useState(null)

    const chartContainerRef = useRef()
    const chart = useRef()
    const resizeObserver = useRef()

    const months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec"}

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
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height });
            setTimeout(() => {
                chart.current.timeScale().fitContent();
            }, 0);
        });

        resizeObserver.current.observe(chartContainerRef.current);

        return () => resizeObserver.current.disconnect();
    }, []);


    // Updating legend when crosshair moves 
    useEffect(() => {
        chart.current.subscribeCrosshairMove(function(param) {
            if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chart.current.clientWidth || param.point.y < 0 || param.point.y > chart.current.clientHeight) {
                chart.current.isCrosshairVisible = false
                let lastBar = data[data.length - 1]
                let time = data[data.length - 1].date
                const date = months[parseInt(time.slice(5,7))] + ` ${time.slice(8)}, ${time.slice(0,4)}`
                setLegend({
                    "time": date,
                    "open": lastBar.open,
                    "high": lastBar.high,
                    "close": lastBar.close,
                    "low": lastBar.low
                })
            } else {
                chart.current.isCrosshairVisible = true
                const iterator = param.seriesPrices.values()
                const date = months[param.time['month']] + ` ${param.time['day']}, ${param.time['year']}`
                setLegend({
                    "time": date,
                    ...iterator.next().value
                })
            }
        })
    }, [])

    return (
        <div className="d-flex flex-column h-50 flex-grow-1 border border-light">
            <div ref={chartContainerRef} className="chart-container position-relative flex-grow-1 w-100 h-100">
                {legend && 
                    <div className="chart-legend position-absolute d-flex-inline top-0 start-0">
                        <small className="ms-2 me-1">{legend.time}</small>
                        <small className="mx-1">O {legend.open}</small>
                        <small className="mx-1">C {legend.close}</small>
                        <small className="mx-1">Hi {legend.high}</small>
                        <small className="mx-1">Lo {legend.low}</small>
                    </div>
                }
            </div>
        </div>
    );
}

export default CandleStickChart;
