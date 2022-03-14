import React, { useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'


function CandleStickChart({ data }) {
    const chartContainerRef = useRef()
    const chart = useRef()
    const resizeObserver = useRef()

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


    return (
        <div className="d-flex flex-column h-50 flex-grow-1 border border-light">
            <div className="">

            </div>
            <div ref={chartContainerRef} className="chart-container flex-grow-1 w-100 h-100"/>
        </div>
    );
}

export default CandleStickChart;
