import React, { useState, useEffect } from "react"
import CandleStickChart from "./charts/CandleStick"
import { getData } from "./utils/utils"

function Chart() {
    const [ chartData, setChartData ] = useState([])


    useEffect(() => {
        getData().then(data => setChartData(data))
    }, [])

    if (chartData.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <CandleStickChart data={chartData} />
    )
}

export default Chart
